import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );
  }

  async signUp(email: string, pass: string, name: string, studentId: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: 'https://project-se-kappa.vercel.app/login', 
      },
    });

    if (authError || !authData.user) {
      throw new BadRequestException(authError?.message || 'การสมัครสมาชิกล้มเหลว');
    }

    return this.prisma.student.create({
      data: {
        id: authData.user.id, 
        email,
        name,
        studentId,
      },
    });
  }

  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }

    let profile = await this.prisma.student.findUnique({
      where: { id: data.user.id },
    });

    if (!profile) {
      profile = await this.prisma.student.create({
        data: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || '',
        }
      });
    }

    return {
      profile: profile, 
      access_token: data.session?.access_token,
      user: data.user,
    };
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.student.update({
      where: { id: userId },
      data: { 
        profileData: data, 
        name: data.basicInfo?.name, 
        studentId: data.basicInfo?.studentId,
      },
    });
  }


  async getProfile(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: userId },
      select: { 
        profileData: true,
        role: true,
        name: true,       
        studentId: true,  
      } 
    });
    return student;
  }
}
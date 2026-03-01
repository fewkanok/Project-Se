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

  // ระบบสมัครสมาชิก
  async signUp(email: string, pass: string, name: string, studentId: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password: pass,
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

  // ระบบเข้าสู่ระบบ
  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }

    const profile = await this.prisma.student.findUnique({
      where: { id: data.user.id },
    });

    // ✅ ปรับให้เหลือแค่ profile และ token ให้ตรงกับที่ Login.jsx รอรับ
    return {
      profile: profile, // ในนี้จะมี id, name, studentId, profileData
      access_token: data.session?.access_token,
    };
  }
  async updateProfile(userId: string, data: any) {
    return this.prisma.student.update({
      where: { id: userId },
      data: { profileData: data },
    });
  }
async getProfile(userId: string) {
  const student = await this.prisma.student.findUnique({
    where: { id: userId },
    select: { profileData: true } // ดึงเฉพาะข้อมูลเกรด/วิชาที่เซฟไว้
  });
  return student;
}
}
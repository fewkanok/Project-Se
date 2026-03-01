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

    // ดึง Profile จากตาราง Student มาด้วย
    const profile = await this.prisma.student.findUnique({
      where: { id: data.user.id },
    });

    return {
      message: 'Login สำเร็จ',
      user: data.user,
      profile: profile,
      access_token: data.session?.access_token,
    };
  }
}
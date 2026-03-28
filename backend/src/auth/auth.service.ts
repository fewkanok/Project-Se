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

  // ระบบเข้าสู่ระบบ (ฉบับแก้ไขให้ Frontend รอด)
  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }

    // 1. ดึงข้อมูลจาก Prisma
    let profile = await this.prisma.student.findUnique({
      where: { id: data.user.id },
    });

    // 🛡️ 2. กันเหนียว: ถ้าหา profile ไม่เจอ (อาจเพราะสมัครแล้ว DB ยังไม่สร้าง) 
    // ให้สร้างหลอกๆ หรือดึงข้อมูลพื้นฐานจาก Supabase ไปก่อน
    if (!profile) {
      profile = await this.prisma.student.create({
        data: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || '',
        }
      });
    }

    // ✅ 3. ส่งกลับให้ครบตามที่ Login.jsx ต้องการ
    return {
      profile: profile, 
      access_token: data.session?.access_token,
      user: data.user, // <--- ต้องส่งก้อนนี้กลับไปด้วยเพื่อให้เช็ก email_confirmed_at ได้
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
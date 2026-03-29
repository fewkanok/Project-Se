import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { PrismaService } from '../../prisma/prisma.service'; // ✅ Import Prisma เข้ามา

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) { // ✅ ฉีด PrismaService เข้ามาใช้งาน
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://xibmfulctvyewbhbifoz.supabase.co/auth/v1/.well-known/jwks.json',
      }),
      algorithms: ['ES256'],
    });
  }

  async validate(payload: any) {
    // 🔍 1. เอา sub (ID จาก Supabase) ไปหาในตาราง Student ของเรา
    const user = await this.prisma.student.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true } // ดึงมาเฉพาะที่ต้องใช้
    });

    // 🛡️ 2. ถ้าไม่เจอ User ใน DB ของเราเอง ให้เตะออก
    if (!user) {
      throw new UnauthorizedException('ไม่พบข้อมูลนักศึกษาในระบบ');
    }

    // 🚀 3. คืนค่า user object กลับไป ซึ่งตอนนี้จะมี user.role ที่เป็น "admin" หรือ "student" จริงๆ แล้ว
    return user; 
  }
}
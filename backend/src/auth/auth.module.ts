import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // ✅ เพิ่มตัวนี้
import { PassportModule } from '@nestjs/passport'; // ✅ เพิ่มตัวนี้
import { JwtStrategy } from './strategies/jwt.strategy'; // 👈 ตัวนี้สำคัญ (เดี๋ยวผมบอกวิธีสร้าง)

@Module({
  imports: [
    PrismaModule,
    PassportModule, // ✅ ลงทะเบียน Passport
    JwtModule.register({
      // ✅ ใช้ Secret ที่ก๊อปมาจาก Legacy JWT Secret ใน Supabase
      secret: 'SUPABASE_JWKS_PROVIDER',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // ✅ ต้องใส่ JwtStrategy เข้ามาด้วย
  controllers: [AuthController],
  exports: [AuthService], // ✅ เผื่อ Module อื่นจะเรียกใช้
})
export class AuthModule {}
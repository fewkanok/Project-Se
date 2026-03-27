import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa'; // ✅ เพิ่มตัวนี้

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. ดึง Token จาก Header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      
      // 2. แทนที่จะใช้รหัสลับ ให้ชี้ไปที่ Discovery URL ในรูปของโก๋เลย!
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // ✅ ก๊อป URL จากช่อง Discovery URL ในรูปมาวางตรงนี้
        jwksUri: process.env.SUPABASE_JWKS_URL|| 'https://xibmfulctvyewbhbifoz.supabase.co/auth/v1/.well-known/jwks.json',
      }),
      
      // 3. ระบุ Algorithm ให้ตรงกับในรูป (ES256)
      algorithms: ['ES256'],
    });
  }

  async validate(payload: any) {
    // Supabase จะเก็บ ID ไว้ใน sub
    return { id: payload.sub, email: payload.email };
  }
}
// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // แนะนำให้ใส่ @Global() ไว้เลย จะได้ไม่ต้อง import ซ้ำทุก Module ครับ
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // สำคัญมาก: ต้องมีบรรทัดนี้!
})
export class PrismaModule {}
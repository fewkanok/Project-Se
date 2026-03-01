import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // ดึง Prisma มาใช้

@Module({
  imports: [PrismaModule], // ใส่ PrismaModule ในนี้
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
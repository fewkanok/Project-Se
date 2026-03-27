// ใน src/reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // ✅ 1. Import AuthModule เข้ามา

@Module({
  imports: [
    PrismaModule, 
    AuthModule // ✅ 2. ใส่ AuthModule ใน imports เพื่อให้ใช้ Guard ได้
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(studentId: string, createReviewDto: CreateReviewDto) {
    const { courseId, comment, rating } = createReviewDto;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/check-review';

    try {
      // 1. ส่งไปให้ n8n AI วิเคราะห์
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }), 
      });

      const aiResult = await response.json();

      // 2. ถ้า AI บอกว่า Toxic เตะกลับทันที
      if (aiResult.isToxic === true) {
        throw new BadRequestException('ตรวจพบคำไม่สุภาพ กรุณาใช้คำที่เหมาะสมนะเพื่อน!');
      }

      // 3. บันทึกลง Supabase
      return await this.prisma.review.create({
        data: {
          comment,
          rating,
          sentiment: aiResult.sentiment || 'ทั่วไป',
          courseId: Number(courseId),
          studentId: studentId, // UUID จาก Token
        },
        include: {
          author: { select: { name: true } } // ดึงชื่อคนรีวิวมาโชว์ด้วย
        }
      });

    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('รายละเอียด Error:', error.message);
      throw new BadRequestException('ระบบวิเคราะห์ขัดข้อง (Check n8n status)');
    }
  }

    async findAllByCourse(courseId: number) {
    return this.prisma.review.findMany({
      where: { 
        courseId: Number(courseId) 
      },
      include: {
        author: { select: { name: true } } 
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });
  }
}
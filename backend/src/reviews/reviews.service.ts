import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // อย่าลืมเช็ก path ของ PrismaService นะครับ
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(studentId: string, createReviewDto: CreateReviewDto) {
    const { courseId, comment, rating } = createReviewDto;

    // 1. ส่งข้อความไปให้ n8n (AI) ตรวจสอบ (เดี๋ยวเราจะมาใส่ URL ของ n8n ตรงนี้ทีหลัง)
    // const n8nResponse = await fetch('http://URL_N8N_ของโก๋/webhook/check-review', { ... });
    // const aiResult = await n8nResponse.json();

    // 💡 จำลองผลลัพธ์จาก AI ไปก่อน (เดี๋ยวตอนต่อ n8n ค่อยลบออก)
    const aiResult = {
      isToxic: false, // จำลองว่าข้อความคลีน
      sentiment: 'ชิลๆ เนื้อหาน่าสนใจ', 
    };

    // 2. ถ้า AI บอกว่าหยาบ เตะกลับทันที!
    if (aiResult.isToxic) {
      throw new BadRequestException('ข้อความไม่เหมาะสม กรุณาใช้คำสุภาพในการรีวิวนะครับ');
    }

    // 3. ถ้าผ่านฉลุย เซฟลง Database พร้อม Tag อารมณ์จาก AI
    return this.prisma.review.create({
      data: {
        courseId,
        comment,
        rating,
        sentiment: aiResult.sentiment, // Tag ที่ได้จาก AI
        studentId, // ID ของคนที่ Login อยู่
      },
    });
  }

  // ดึงรีวิวทั้งหมดของวิชานั้นๆ
  findAllByCourse(courseId: number) {
    return this.prisma.review.findMany({
      where: { courseId },
      include: {
        author: {
          select: { name: true, role: true }, // ดึงชื่อและ role (แอดมิน/นักศึกษา) มาโชว์
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
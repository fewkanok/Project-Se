import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // --- 1. สร้างรีวิว (แบบปกติ ไม่ใช้ n8n) ---
  async create(studentId: string, createReviewDto: CreateReviewDto) {
    const { courseId, comment, rating } = createReviewDto;

    try {
      return await this.prisma.review.create({
        data: {
          comment,
          rating,
          sentiment: 'ทั่วไป', // ค่า Default หรือจะเอาออกก็ได้ถ้า Schema ไม่บังคับ
          courseId: Number(courseId),
          studentId: studentId, // UUID จาก Token
        },
        include: {
          author: { select: { name: true } }
        }
      });
    } catch (error) {
      console.error('Create Review Error:', error.message);
      throw new BadRequestException('ไม่สามารถบันทึกรีวิวได้ กรุณาตรวจสอบข้อมูล');
    }
  }

  // --- 2. ดึงรีวิวตามวิชา ---
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

  // --- 3. ลบรีวิว (เช็ก Role Admin หรือ เจ้าของ) ---
  async remove(reviewId: number, userId: string, userRole: string) {
    // ค้นหารีวิวก่อนว่ามีจริงไหม
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      throw new NotFoundException('ไม่พบรีวิวที่ต้องการลบ');
    }

    if (userRole !== 'admin' && review.studentId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบรีวิวของคนอื่น!');
    }

    try {
      return await this.prisma.review.delete({
        where: { id: reviewId }
      });
    } catch (error) {
      throw new BadRequestException('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  }
}
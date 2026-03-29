import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // --- 1. สร้างรีวิว ---
  async create(studentId: string, createReviewDto: CreateReviewDto) {
    const { courseId, comment, rating } = createReviewDto;

    try {
      return await this.prisma.review.create({
        data: {
          comment,
          rating,
          sentiment: 'ทั่วไป',
          courseId: Number(courseId),
          studentId: studentId,
        },
        include: {
          // ✅ แก้ตรงนี้: ดึงทั้งชื่อและ profileData (ที่มีรูป)
          author: { 
            select: { 
              name: true,
              profileData: true 
            } 
          }
        }
      });
    } catch (error) {
      console.error('Create Review Error:', error.message);
      throw new BadRequestException('ไม่สามารถบันทึกรีวิวได้');
    }
  }

  // --- 2. ดึงรีวิวตามวิชา ---
  async findAllByCourse(courseId: number) {
    return this.prisma.review.findMany({
      where: { 
        courseId: Number(courseId) 
      },
      include: {
        // ✅ แก้ตรงนี้เหมือนกัน: เพื่อให้คอมเมนต์เก่าดึงชื่อและรูปปัจจุบันมาโชว์
        author: { 
          select: { 
            name: true,
            profileData: true 
          } 
        }
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });
  }

  // --- 3. ลบรีวิว (คงเดิม) ---
  async remove(reviewId: number, userId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) throw new NotFoundException('ไม่พบรีวิวที่ต้องการลบ');

    if (userRole !== 'admin' && review.studentId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบรีวิวของคนอื่น!');
    }

    return await this.prisma.review.delete({
      where: { id: reviewId }
    });
  }
}
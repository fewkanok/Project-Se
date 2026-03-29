import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // 🛡️ 1. สร้างรีวิว หรือ ตอบกลับรีวิว (พร้อมระบบกัน Spam)
  async create(studentId: string, createReviewDto: CreateReviewDto) {
    const { courseId, comment, rating, parentId } = createReviewDto;

    // --- ด่านกักกันคอมเมนต์ขยะ (Anti-Spam Filter) ---
    const cleanComment = comment.trim();
    
    // 1. เช็คความยาวขั้นต่ำ
    if (cleanComment.length < 5) {
      throw new BadRequestException('พิมสั้นไปเอาให้ยาวกว่านี้อีกนิดนะ!');
    }

    // 2. ดักตัวอักษรซ้ำรัวๆ (เช่น "55555555555555" หรือ "aaaaaaaa")
    if (/(.)\1{7,}/.test(cleanComment)) {
      throw new BadRequestException('อย่าพิมอักษรซ้ำๆกันสิ!');
    }

    // 3. Flood Protection: 1 คนโพสต์ได้ 1 ครั้งต่อ 15 วินาที
    const lastPost = await this.prisma.review.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });

    if (lastPost) {
      const timeDiff = Date.now() - lastPost.createdAt.getTime();
      if (timeDiff < 15000) { // 15 วินาที
        throw new BadRequestException('(Flood Protection) 15sec');
      }
    }

    try {
      return await this.prisma.review.create({
        data: {
          comment: cleanComment,
          rating,
          courseId: Number(courseId),
          studentId: studentId,
          parentId: parentId ? Number(parentId) : null, // ถ้าส่ง parentId มาจะเป็นการ Reply
          sentiment: 'ทั่วไป',
        },
        include: {
          author: { 
            select: { 
              name: true,
              profileData: true 
            } 
          }
        }
      });
    } catch (error) {
      throw new BadRequestException('ไม่สามารถบันทึกรีวิวได้ กรุณาตรวจสอบข้อมูล');
    }
  }

  // 🔍 2. ดึงรีวิวตามวิชา (ดึงรีวิวหลัก และ Include Reply/Like มาด้วย)
  async findAllByCourse(courseId: number) {
    return this.prisma.review.findMany({
      where: { 
        courseId: Number(courseId),
        parentId: null // ดึงเฉพาะโพสต์หลัก (Top-level)
      },
      include: {
        author: { 
          select: { name: true, profileData: true } 
        },
        likes: {
          select: { studentId: true } // ดูว่าใครไลก์บ้าง
        },
        replies: { // ✅ ดึงคอมเมนต์ตอบกลับมาด้วย
          include: {
            author: { select: { name: true, profileData: true } },
            likes: { select: { studentId: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });
  }

  // ❤️ 3. ระบบ Toggle Like (กดเพิ่ม/กดออก)
  async toggleLike(reviewId: number, studentId: string) {
    // เช็คว่าเคยไลก์ยัง
    const existingLike = await this.prisma.reviewLike.findUnique({
      where: {
        reviewId_studentId: { reviewId, studentId }
      }
    });

    if (existingLike) {
      // ถ้าเคยไลก์แล้ว -> ลบออก (Unlike)
      await this.prisma.reviewLike.delete({
        where: { id: existingLike.id }
      });
      return { liked: false };
    } else {
      // ถ้ายังไม่เคยไลก์ -> สร้างใหม่ (Like)
      await this.prisma.reviewLike.create({
        data: { reviewId, studentId }
      });
      return { liked: true };
    }
  }

  // 🗑️ 4. ลบรีวิว (รองรับการลบลูกพ่วงไปด้วยถ้าตั้ง Cascade ไว้ใน Prisma)
  async remove(reviewId: number, userId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) throw new NotFoundException('ไม่พบรีวิวที่ต้องการลบ');

    if (userRole !== 'admin' && review.studentId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบรีวิวนี้!');
    }

    return await this.prisma.review.delete({
      where: { id: reviewId }
    });
  }
}
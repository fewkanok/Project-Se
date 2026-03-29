import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}


  async create(studentId: string, createReviewDto: CreateReviewDto) {
    const { courseId, comment, rating, parentId } = createReviewDto;

    
    const cleanComment = comment.trim();
    
    if (cleanComment.length < 5) {
      throw new BadRequestException('พิมสั้นไปเอาให้ยาวกว่านี้อีกนิดนะ!');
    }

    if (/(.)\1{7,}/.test(cleanComment)) {
      throw new BadRequestException('อย่าพิมอักษรซ้ำๆกันสิ!');
    }

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
          parentId: parentId ? Number(parentId) : null,
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

  async findAllByCourse(courseId: number) {
    return this.prisma.review.findMany({
      where: { 
        courseId: Number(courseId),
        parentId: null
      },
      include: {
        author: { 
          select: { name: true, profileData: true } 
        },
        likes: {
          select: { studentId: true }
        },
        replies: { 
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

  async toggleLike(reviewId: number, studentId: string) {
    const existingLike = await this.prisma.reviewLike.findUnique({
      where: {
        reviewId_studentId: { reviewId, studentId }
      }
    });

    if (existingLike) {
      await this.prisma.reviewLike.delete({
        where: { id: existingLike.id }
      });
      return { liked: false };
    } else {
      await this.prisma.reviewLike.create({
        data: { reviewId, studentId }
      });
      return { liked: true };
    }
  }

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
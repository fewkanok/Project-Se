import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 🟢 รับข้อมูลรีวิวใหม่
  @Post()
  @UseGuards(AuthGuard('jwt')) 
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    // 🛡️ ดึง ID จาก Token
    const studentId = req.user.id || req.user.sub; 
    return this.reviewsService.create(studentId, createReviewDto);
  }

  // 🔵 ดึงรีวิวทั้งหมดของวิชานั้นๆ
  @Get('course/:courseId')
  findAllByCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.findAllByCourse(+courseId);
  }

  // 🔴 ลบรีวิว (เพิ่มเข้ามาใหม่ครับโก๋)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ✅ ต้อง Login ถึงจะลบได้
  async remove(@Param('id') id: string, @Req() req: any) {
    
    // 🛡️ ดึงข้อมูลคนลบจาก Token
    const userId = req.user.id || req.user.sub;
    const userRole = req.user.role; // ✅ ดึง Role มาเช็ค (ต้องแน่ใจว่าใน JWT Strategy ของโก๋ใส่ role มาใน user object นะ)

    // ส่งไปประหารที่ Service
    return this.reviewsService.remove(+id, userId, userRole);
  }
}
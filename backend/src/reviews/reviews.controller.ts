import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport'; // ✅ ใช้ตัวสำเร็จรูป ไม่ต้องสร้างไฟล์ Guard เอง

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 🟢 รับข้อมูลรีวิวใหม่
  @Post()
  @UseGuards(AuthGuard('jwt')) // ✅ บังคับ Login (ถ้าไม่ส่ง Token มาจะขึ้น 401)
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    
    // 🛡️ ดึง ID จาก Token (เช็กใน JWT Payload ของโก๋นะว่าใช้ชื่อ id หรือ sub)
    const studentId = req.user.id || req.user.sub; 

    return this.reviewsService.create(studentId, createReviewDto);
  }

  // 🔵 ดึงรีวิวทั้งหมดของวิชานั้นๆ
  @Get('course/:courseId')
  findAllByCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.findAllByCourse(+courseId);
  }
}
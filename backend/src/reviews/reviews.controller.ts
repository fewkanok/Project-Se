import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 🟢 1. รับข้อมูลรีวิวใหม่ (POST /reviews)
  @Post()
  // @UseGuards(JwtAuthGuard) // 💡 เปิดคอมเมนต์บรรทัดนี้ในอนาคต เพื่อบังคับว่าต้อง Login ก่อนถึงรีวิวได้
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    
    // 🛡️ ดึง ID นักศึกษาจาก Token ที่ Login (เพื่อความปลอดภัย ไม่ให้ React ส่ง ID มามั่วๆ)
    // แต่ช่วงที่เราเทสระบบ API กันอยู่ ให้ใช้ Hardcode ID ไปก่อนได้ครับ
    const studentId = req.user?.id || 'user-id-ทดสอบ-ใส่-id-ที่มีใน-db-ตรงนี้'; 

    return this.reviewsService.create(studentId, createReviewDto);
  }

  // 🔵 2. ดึงรีวิวทั้งหมดของวิชานั้นๆ (GET /reviews/course/1)
  @Get('course/:courseId')
  findAllByCourse(@Param('courseId') courseId: string) {
    
    // หน้าเว็บจะส่ง courseId มาเป็น String (เช่น "1") 
    // เราต้องใส่เครื่องหมาย + ข้างหน้า เพื่อแปลงเป็น Number (Integer) ก่อนส่งให้ Prisma ครับ
    return this.reviewsService.findAllByCourse(+courseId);
  }
}
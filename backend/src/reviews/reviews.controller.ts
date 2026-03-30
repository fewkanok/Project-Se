import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    const studentId = req.user.id || req.user.sub; 
    return this.reviewsService.create(studentId, createReviewDto);
  }

  @Get('course/:courseId')
  findAllByCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.findAllByCourse(+courseId);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    const studentId = req.user.id || req.user.sub;
    return this.reviewsService.toggleLike(+id, studentId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    const userRole = req.user.role; 

    return this.reviewsService.remove(+id, userId, userRole);
  }
}
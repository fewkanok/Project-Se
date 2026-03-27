import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  courseId: number; // รหัสวิชา (อ้างอิงจากตาราง Course)

  @IsString()
  @IsNotEmpty()
  comment: string;  // ข้อความที่รีวิว

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;   // ดาว 1-5
}
import { IsString, IsInt, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

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

  // ✅ เพิ่มตัวนี้ครับ เพื่อรองรับการ Reply
  @IsInt()
  @IsOptional()
  parentId?: number; // ID ของรีวิวหลักที่ต้องการตอบกลับ (ถ้ามี)
}
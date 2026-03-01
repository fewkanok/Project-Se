import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // แก้ไขส่วนนี้เพื่อให้รองรับการส่ง Header และ Credentials จาก Vercel
  app.enableCors({
    origin: '*', // ในช่วงพัฒนาใช้ * ได้ แต่ถ้าทำเสร็จแล้วควรเปลี่ยนเป็น URL ของ Vercel
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ใช้ process.env.PORT ที่ Render กำหนดมาให้
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
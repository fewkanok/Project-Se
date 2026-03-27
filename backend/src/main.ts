import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 
  app.enableCors({
    origin: [
      'http://localhost:5173', // สำหรับตอนรัน docker-compose ในเครื่อง
      'https://project-se-kappa.vercel.app' // เผื่อไว้ตอน Deploy ขึ้น Vercel จริงๆ
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.useGlobalPipes(new ValidationPipe());
  // ✅ บรรทัดนี้ถูกต้องเยี่ยมมากครับ! การใส่ '0.0.0.0' จำเป็นมากสำหรับ Docker
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
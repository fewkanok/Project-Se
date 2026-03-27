import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
// import { ConfigModule } from '@nestjs/config';
// ConfigModule.forRoot({
//       isGlobal: true,
//     })
@Module({
  imports: [PrismaModule, AuthModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

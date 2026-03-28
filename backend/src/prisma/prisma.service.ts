// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // เชื่อมต่อ DB ทันทีที่ App เริ่มทำงาน
  }
  async onModuleDestroy() {
      await this.$disconnect();
  }
}
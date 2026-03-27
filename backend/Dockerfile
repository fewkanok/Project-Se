# /backend/Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# ✅ เติมบรรทัดนี้ลงไป! เพื่อลง OpenSSL ให้ Prisma ใช้คุยกับ Database
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# -----------------------------------------------------------
FROM node:22-alpine

WORKDIR /app

# ✅ เติมที่นี่ด้วย! ให้ตอนรันจริงมี OpenSSL ใช้
RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]
# /frontend/Dockerfile
# -----------------------------------------------------------
# Stage stage 1: Build React
# -----------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# A. ลง dependencies
COPY package*.json ./
RUN npm install

# B. ก๊อปปี้โค้ดและ build
COPY . .

# รับค่า API URL ตอน build (สำหรับ Vite ต้องขึ้นต้นด้วย VITE_)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# -----------------------------------------------------------
# Stage 2: Serve with Nginx
# -----------------------------------------------------------
FROM nginx:alpine

# C. ก๊อปปี้ไฟล์ที่ build เสร็จแล้วจาก Stage 1 ไปยัง Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# D. (ตัวเลือก) ก๊อปปี้ไฟล์ config ของ Nginx ถ้ามี (ปกติไม่ต้อง)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# E. รัน Nginx
CMD ["nginx", "-g", "daemon off;"]
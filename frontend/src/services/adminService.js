// src/services/adminService.js
// ==========================================
// API SERVICE LAYER
// ปัจจุบัน: LocalStorage (mock)
// เมื่อ Backend พร้อม: เปลี่ยนแค่ข้างใน function นี้เป็น axios/fetch
// Interface ไม่เปลี่ยน → Frontend ทำงานต่อได้ทันที
// ==========================================

import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';

const COURSE_STORAGE_KEY  = 'survivor_courses_db';
const REVIEW_STORAGE_KEY  = 'survivor_reviews_db';

// ─── Seed initial data ───────────────────────────────────────────
const initializeData = () => {
  if (!localStorage.getItem(COURSE_STORAGE_KEY)) {
    let allCourses = [];
    roadmapData.forEach(y =>
      y.semesters.forEach(s =>
        s.courses.forEach(c =>
          allCourses.push({ ...c, category: 'Core', year: y.year, semester: s.term })
        )
      )
    );
    electiveCourses.forEach(c =>
      allCourses.push({ ...c, category: 'Elective', year: 'Any', semester: 'Any' })
    );
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(allCourses));
  }

  if (!localStorage.getItem(REVIEW_STORAGE_KEY)) {
    const mockReviews = [
      { id: 1, courseId: '040613101', user: 'Student A', rating: 5, comment: 'อาจารย์ใจดีมาก สอนเข้าใจ', flagged: false },
      { id: 2, courseId: '040613101', user: 'Student B', rating: 1, comment: 'ข้อสอบยากชิบหาย ตกนรก', flagged: true },
      { id: 3, courseId: '040623172', user: 'Student C', rating: 3, comment: 'เฉยๆ ง่วงแต่พอผ่านได้', flagged: false },
      { id: 4, courseId: '040613201', user: 'Student D', rating: 4, comment: 'สนุก Lab เยอะ ได้ทำจริง', flagged: false },
      { id: 5, courseId: '040613301', user: 'Student E', rating: 2, comment: 'SQL ง่าย แต่ Final โหดมาก', flagged: true },
    ];
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(mockReviews));
  }
};

initializeData();

// ==========================================
// ─── COURSE SERVICES ──────────────────────
// ==========================================

/**
 * GET all courses
 * TODO: return await axios.get('/api/admin/courses');
 */
export const getCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) || '[]');
      resolve(data);
    }, 400);
  });
};

/**
 * ADD or UPDATE a course
 * TODO (add):  return await axios.post('/api/admin/courses', courseData);
 * TODO (edit): return await axios.put(`/api/admin/courses/${courseData.uid}`, courseData);
 */
export const saveCourse = async (courseData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let courses = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) || '[]');
      if (courseData.uid) {
        courses = courses.map(c => c.uid === courseData.uid ? courseData : c);
      } else {
        const newCourse = { ...courseData, uid: `uid_${Date.now()}` };
        courses.push(newCourse);
      }
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
      resolve({ success: true });
    }, 500);
  });
};

/**
 * DELETE a course by uid / id / code
 * TODO: return await axios.delete(`/api/admin/courses/${courseId}`);
 */
export const deleteCourse = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let courses = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) || '[]');
      courses = courses.filter(c =>
        c.uid !== courseId && c.id !== courseId && c.code !== courseId
      );
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
      resolve({ success: true });
    }, 300);
  });
};

// ==========================================
// ─── REVIEW SERVICES ──────────────────────
// ==========================================

/**
 * GET all reviews (admin view)
 * TODO: return await axios.get('/api/admin/reviews');
 */
export const getReviews = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
      resolve(data);
    }, 300);
  });
};

/**
 * DELETE a review (censor)
 * TODO: return await axios.delete(`/api/admin/reviews/${reviewId}`);
 */
export const deleteReview = async (reviewId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let reviews = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
      reviews = reviews.filter(r => r.id !== reviewId);
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
      resolve({ success: true });
    }, 300);
  });
};

/**
 * OVERRIDE a review's rating (admin action)
 * TODO: return await axios.patch(`/api/admin/reviews/${reviewId}/rating`, { rating });
 */
export const overrideReviewRating = async (reviewId, newRating) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let reviews = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
      reviews = reviews.map(r =>
        r.id === reviewId ? { ...r, rating: newRating, overriddenByAdmin: true } : r
      );
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
      resolve({ success: true });
    }, 300);
  });
};
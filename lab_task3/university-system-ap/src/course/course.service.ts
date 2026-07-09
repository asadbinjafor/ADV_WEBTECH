import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
  private courses = [
    { id: '101', name: 'Software Requirements Engineering', code: 'CS111101' },
    { id: '102', name: 'Web Technologies', code: 'CS222201' },
    { id: '103', name: 'Machine Learning', code: 'CS333301' },
  ];

  getAllCourses() {
    return {
      message: 'All courses fetched',
      data: this.courses,
    };
  }

  getCourseById(id: string) {
    const course = this.courses.find(c => c.id === id);
    return {
      message: 'Course fetched',
      data: course,
    };
  }

  createCourse(name: string, code: string) {
    
    const newCourse = {
      id: String(this.courses.length + 1),
      name: name,
      code: code,
    };
    this.courses.push(newCourse);
    return {
      message: 'Course created',
      data: newCourse,
    };
  }
}
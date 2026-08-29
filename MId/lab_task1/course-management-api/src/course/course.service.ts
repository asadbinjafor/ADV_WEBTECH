import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
  private courses: string[] = [];
  private idCounter = 1;
  getAllCourses(): string {
    return 'Get All Courses';
  }

  getCourseById(id: string): string {
    return `Get Course with ID ${id}`;
  }
  createCourse(): string {
    return 'Created a new Course';
  }
  updateCourse(id: string): string {
    return `Updated Course ${id}`;
  }
  deleteCourse(id: string): string {
    return `Deleted Course ${id}`;
  }
  patchCourse(id: string): string {
    return `Patched Course ${id}`;
  }
}
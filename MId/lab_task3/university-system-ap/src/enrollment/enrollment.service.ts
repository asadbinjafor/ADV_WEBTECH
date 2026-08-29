import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { NotificationService } from '../notification/notification.service';

export interface Enrollment {
  id: string;
  student: string;
  course: {
    message: string;
    data: {
      id: string;
      name: string;
      code: string;
    } | undefined;
  };
  enrolledAt: Date;
}

@Injectable()
export class EnrollmentService {
  private enrollments: Enrollment[] = [];

  constructor(
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  enrollStudent(studentName: string, courseId: string) {
    const course = this.courseService.getCourseById(courseId);
    
    const enrollment: Enrollment = {
      id: String(this.enrollments.length + 1),
      student: studentName,
      course: course,
      enrolledAt: new Date(),
    };
    this.enrollments.push(enrollment);

    const courseName = course.data?.name || 'the course';
    
    const notification = this.notificationService.sendNotification(
      studentName,
      `Welcome to ${courseName}! You have been enrolled successfully.`
    );

    return {
      message: 'Student enrolled successfully',
      student: studentName,
      course: course,
      notification: notification,
    };
  }

  getEnrollments() {
    return {
      message: 'All enrollments fetched',
      data: this.enrollments,
    };
  }
}
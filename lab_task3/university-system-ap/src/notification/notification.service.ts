import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => EnrollmentService))
    private readonly enrollmentService: EnrollmentService,
  ) {}

  sendNotification(studentName: string, message: string) {
    return {
      message: 'Notification sent successfully',
      student: studentName,
      notification: message,
    };
  }

  checkEnrollmentAndNotify(studentName: string, courseId: string) {
    const enrollmentStatus = this.enrollmentService.getEnrollments();

    return {
      message: 'Enrollment checked successfully',
      student: studentName,
      courseId: courseId,
      enrollmentStatus: enrollmentStatus,
    };
  }
}
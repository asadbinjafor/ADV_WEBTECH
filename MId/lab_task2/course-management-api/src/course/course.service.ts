import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  private courses: any[] = [
    { id: '1', name: 'Mathematics 101', code: 'MATH101', instructor: 'Dr. Smith', credits: 3 },
    { id: '2', name: 'Physics 101', code: 'PHYS101', instructor: 'Dr. Johnson', credits: 4 },
    { id: '3', name: 'Chemistry 101', code: 'CHEM101', instructor: 'Dr. Williams', credits: 3 },
    { id: '4', name: 'Biology 101', code: 'BIO101', instructor: 'Dr. Brown', credits: 4 },
    { id: '5', name: 'Computer Science 101', code: 'CS101', instructor: 'Dr. Davis', credits: 3 },
  ];

  private idCounter = 6;

  getAllCourses() {
    return {
      message: "All courses fetched successfully",
      data: this.courses
    };
  }

  getCourseById(id: string) {
    const course = this.courses.find(c => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return {
      message: "Course fetched successfully",
      id: id
    };
  }

  createCourse(dto: CreateCourseDto) {
    const newCourse = {
      id: String(this.idCounter++),
      ...dto,
    };
    this.courses.push(newCourse);
    return {
      message: "Course created successfully",
      data: dto
    };
  }

  updateCourse(id: string, dto: UpdateCourseDto) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    this.courses[index] = {
      ...this.courses[index],
      ...dto
    };

    return {
      message: "Course updated successfully",
      id: id,
      data: dto
    };
  }

  patchCourse(id: string, dto: UpdateCourseDto) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const updatedFields = Object.keys(dto);
    
    this.courses[index] = {
      ...this.courses[index],
      ...dto
    };

    return {
      message: "Course patched successfully",
      id: id,
      updatedFields: updatedFields
    };
  }

  deleteCourse(id: string) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    this.courses.splice(index, 1);
    
    return {
      message: "Course deleted successfully",
      id: id
    };
  }

  uploadCourseMaterial(id: string, file: any) {
    const course = this.courses.find(c => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return {
      message: "Material uploaded successfully",
      courseId: id,
      filename: file.filename,  
      path: file.path           
    };
  }
}
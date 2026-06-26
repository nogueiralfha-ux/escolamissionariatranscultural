export interface CourseModule {
  id: string;
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
}

export interface StudentProgress {
  courseId: string;
  progressPercentage: number;
  lastAccessed: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  badges: string[];
}

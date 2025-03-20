export interface Course {
  id: number;
  dept: string;
  number: string;
  title: string;
}

export interface CourseOffering {
  id: number;
  course: number; // foreign key to Course
  semester: "Spring" | "Summer" | "Fall" | "Winter";
  year: number;
}

export interface TA {
  id: number;
  username: string;
  first: string;
  last: string;
}

export interface TACourseRel {
  id: number;
  ta: number; // foreign key to TA
  course_offering: number; // foreign key to CourseOffering
  classification: "UG" | "GR";
}

export interface Homework {
  id: number;
  hw_name: string;
  course_offering: number; // foreign key to CourseOffering
}

export interface Question {
  id: number;
  hw: number; // foreign key to Homework
  question_name: string;
  difficulty: number;
  required_tas: number;
  required_gtas: number;
  required_utas: number;
}

export interface GradingRel {
  id: number;
  ta: number; // foreign key to TA
  question: number; // foreign key to Question
}


export interface TAAssignmentForHW {
  id: number;
  question_id: number;
  ta_id: number;
  ta_username: string;
  ta_first: string;
  ta_last: string;
}


// For convenience when typing ChangeEvent for different form fields
export type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
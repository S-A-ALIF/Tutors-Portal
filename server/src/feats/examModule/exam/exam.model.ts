export interface Exam {
    id: string;
    creator_id: string;
    inst_id?: string;
    name: string;
    subject: string;
    exam_date: string;
    exam_time: string;
    grade: string;
    section?: string;
    duration_minutes: number;
    total_marks: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateExamDTO {
    inst_id?: string;
    name: string;
    subject: string;
    exam_date: string;
    exam_time: string;
    grade: string;
    section?: string;
    duration_minutes: number;
    total_marks: number;
}

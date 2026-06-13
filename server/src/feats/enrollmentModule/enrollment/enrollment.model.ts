/**
 * Enrollment Model
 * Defines the structure for the Enrollment entity (Academic records).
 */
export interface Enrollment {
    id: string;
    student_id: string;
    inst_id: string;
    academic_year: string;
    grade: string;
    section: string | null;
    roll_no: string | null;
    monthly_fee: number | null;
    is_current_year: boolean;
    created_at?: Date;
}
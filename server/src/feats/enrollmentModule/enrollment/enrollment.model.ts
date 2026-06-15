/**
 * Enrollment Model
 * Defines the structure for the Enrollment entity (Academic records).
 */
export interface Enrollment {
    id: string;
    academic_year: string;
    grade: string;
    section: string | null;
    roll_no: string | null;
    monthly_fee: number | null;
    created_at?: Date;
}

/**
 * Extended interface including relational data from junction tables
 */
export interface EnrollmentDetails extends Enrollment {
    student_id: string;
    inst_id: string;
    status: 'active' | 'graduated' | 'transferred' | 'expelled';
    joined_at?: Date;
    left_at?: Date | null;
}
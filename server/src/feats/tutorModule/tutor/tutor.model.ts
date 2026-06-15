/**
 * Tutor Model
 * Defines the structure for the Tutor entity.
 */
export interface Tutor {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null; // Added email
    phone_number: string;
    bio?: string | null;
    hourly_rate?: number | null;
    monthly_salary?: number | null;
    subjects?: string[] | null;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * Extended interface including relational data from junction tables
 */
export interface TutorDetails extends Tutor {
    inst_id?: string;
}
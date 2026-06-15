/**
 * Student Model
 * Defines the structure for the Student entity.
 */
export interface Student {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone_number?: string | null;
    address?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    guardian_name?: string | null;
    guardian_phone?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * Extended interface including relational data from junction tables
 */
export interface StudentDetails extends Student {
    user_id?: string;
}
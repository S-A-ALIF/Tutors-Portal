/**
 * Student Model
 * Defines the structure for the Student entity.
 */
export interface Student {
    id: string;
    user_id: string | null;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string;
    date_of_birth: string;
    guardian_name: string;
    guardian_phone: string;
    created_at?: Date;
}
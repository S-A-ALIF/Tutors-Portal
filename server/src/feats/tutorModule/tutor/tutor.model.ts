export interface Tutor {
    id: string;
    user_id?: string | null;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone_number: string;
    bio?: string | null;
    hourly_rate?: number | null;
    monthly_salary?: number | null;
    subjects?: string[] | null;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}
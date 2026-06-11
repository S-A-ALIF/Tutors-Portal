/**
 * Institution Model
 * Defines the structure for the Institution entity.
 */
export interface Institution {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    address: string | null;
    logo_url: string | null;
    is_active: boolean;
    user_id?: string; // Foreign key to link to the User
    created_at?: Date;
}
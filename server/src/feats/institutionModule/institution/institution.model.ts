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
    created_at?: Date;
}
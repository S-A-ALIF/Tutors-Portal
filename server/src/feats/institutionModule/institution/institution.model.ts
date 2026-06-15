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
    created_at?: Date;
}

/**
 * Extended interface for creation payload involving junction tables
 */
export interface InstitutionCreationPayload extends Institution {
    user_id: string;
}
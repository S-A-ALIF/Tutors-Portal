export interface Invitation {
    id: string;
    inst_id: string;
    email: string;
    code: string;
    expires_at: Date;
    status: 'pending' | 'accepted' | 'expired';
    role?: 'student' | 'tutor';
    academic_year?: string | null;
    grade?: string | null;
    section?: string | null;
    roll_no?: string | null;
    monthly_fee?: number | null;
    created_at?: Date;
}

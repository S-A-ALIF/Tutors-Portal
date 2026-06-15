export interface ClassEntity {
    id: string;
    inst_id?: string;
    grade: string;
    department?: string;
    section?: string;
    floor?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateClassDTO {
    inst_id?: string;
    grade: string;
    department?: string;
    section?: string;
    floor?: string;
}

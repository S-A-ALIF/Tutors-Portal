import db from '../../../config/db.config';

export interface IInstitution {
    id: string; 
    name: string;
    email: string;
    phone: string;
    address?: string | null;
    logoUrl?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInstitutionDTO {
    name: string;
    email: string;
    phone: string;
    address?: string;
    logoUrl?: string;
}

export const create = async (data: CreateInstitutionDTO): Promise<IInstitution> => {
    const query = `
        INSERT INTO institutions (name, email, phone, address, logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, address, logo_url AS "logoUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt";
    `;
    const values = [data.name, data.email, data.phone, data.address || null, data.logoUrl || null];
    const { rows } = await db.query(query, values);
    return rows[0];
};

export const findByEmail = async (email: string): Promise<IInstitution | null> => {
    const query = `
        SELECT id, name, email, phone, address, logo_url AS "logoUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt" 
        FROM institutions 
        WHERE email = $1 LIMIT 1;
    `;
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
};

export const findById = async (id: string): Promise<IInstitution | null> => {
    const query = `
        SELECT id, name, email, phone, address, logo_url AS "logoUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt" 
        FROM institutions 
        WHERE id = $1 LIMIT 1;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
};

export const findAll = async (): Promise<IInstitution[]> => {
    const query = `
        SELECT id, name, email, phone, address, logo_url AS "logoUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt" 
        FROM institutions 
        ORDER BY created_at DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};

export const update = async (id: string, data: Partial<CreateInstitutionDTO> & { isActive?: boolean }): Promise<IInstitution | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    // Map TS camelCase properties to SQL snake_case columns
    const columnMapping: Record<string, string> = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        address: 'address',
        logoUrl: 'logo_url',
        isActive: 'is_active'
    };

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && columnMapping[key]) {
            fields.push(`${columnMapping[key]} = $${index}`);
            values.push(value);
            index++;
        }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
        UPDATE institutions 
        SET ${fields.join(', ')}, updated_at = NOW() 
        WHERE id = $${index} 
        RETURNING id, name, email, phone, address, logo_url AS "logoUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const { rows } = await db.query(query, values);
    return rows[0] || null;
};

export const remove = async (id: string): Promise<IInstitution | null> => {
    const query = `
        DELETE FROM institutions 
        WHERE id = $1 
        RETURNING id, name, email, phone, address, logo_url AS "logoUrl", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt";
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
};

export default {
    create,
    findByEmail,
    findById,
    findAll,
    update,
    remove
};
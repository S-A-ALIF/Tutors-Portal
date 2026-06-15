/**
 * Tutor Sanitizer
 * Normalizes inputs and ensures only provided fields are mapped.
 */
export const sanitizeTutor = (data: any, isUpdate = false) => {
    const sanitized: any = {};

    if (data.user_id !== undefined) sanitized.user_id = data.user_id;
    if (data.user_role !== undefined) sanitized.user_role = data.user_role;
    
    if (data.first_name !== undefined) sanitized.first_name = data.first_name?.trim();
    if (data.last_name !== undefined) sanitized.last_name = data.last_name?.trim();
    
    // Process email
    if (data.email !== undefined) sanitized.email = data.email ? data.email.trim().toLowerCase() : null;
    
    if (data.phone_number !== undefined) sanitized.phone_number = data.phone_number?.trim();
    if (data.bio !== undefined) sanitized.bio = data.bio ? data.bio.trim() : null;
    if (data.hourly_rate !== undefined) sanitized.hourly_rate = data.hourly_rate ? Number(data.hourly_rate) : null;
    if (data.monthly_salary !== undefined) sanitized.monthly_salary = data.monthly_salary ? Number(data.monthly_salary) : null;
    
    if (data.subjects !== undefined) {
        sanitized.subjects = data.subjects ? data.subjects.map((sub: string) => sub.trim()).filter(Boolean) : null;
    }

    if (data.is_active !== undefined) {
        sanitized.is_active = Boolean(data.is_active);
    } else if (!isUpdate) {
        sanitized.is_active = true; // Default to true on creation
    }

    return sanitized;
};
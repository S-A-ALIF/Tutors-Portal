/**
 * Student Sanitizer
 * Normalizes inputs and ensures only provided fields are mapped.
 */
export const sanitizeStudent = (data: any, isUpdate = false) => {
    const sanitized: any = {};

    if (data.user_id !== undefined && !isUpdate) sanitized.user_id = data.user_id;

    if (data.first_name !== undefined) sanitized.first_name = data.first_name?.trim();
    if (data.last_name !== undefined) sanitized.last_name = data.last_name?.trim();
    
    if (data.email !== undefined) sanitized.email = data.email ? data.email.trim().toLowerCase() : null;
    if (data.phone_number !== undefined) sanitized.phone_number = data.phone_number ? data.phone_number.trim() : null;
    if (data.address !== undefined) sanitized.address = data.address ? data.address.trim() : null;
    if (data.date_of_birth !== undefined) sanitized.date_of_birth = data.date_of_birth ? data.date_of_birth.trim() : null;
    if (data.gender !== undefined) sanitized.gender = data.gender ? data.gender.trim() : null;
    if (data.guardian_name !== undefined) sanitized.guardian_name = data.guardian_name ? data.guardian_name.trim() : null;
    if (data.guardian_phone !== undefined) sanitized.guardian_phone = data.guardian_phone ? data.guardian_phone.trim() : null;

    return sanitized;
};
/**
 * Institution Sanitizer
 * Normalizes inputs and ensures only provided fields are returned.
 */
export const sanitizeInstitution = (data: any, isUpdate = false) => {
    const sanitized: Record<string, any> = {};

    if (data.name !== undefined) sanitized.name = data.name.trim();
    if (data.email !== undefined) sanitized.email = data.email.toLowerCase().trim();
    if (data.phone_number !== undefined) sanitized.phone_number = data.phone_number.trim();
    
    // Address and logo_url are nullable, so if they are falsy (like empty strings), convert to null
    if (data.address !== undefined) sanitized.address = data.address ? data.address.trim() : null;
    if (data.logo_url !== undefined) sanitized.logo_url = data.logo_url ? data.logo_url.trim() : null;
    
    if (data.is_active !== undefined) sanitized.is_active = data.is_active;

    // For creation only: supply default values for missing fields
    if (!isUpdate) {
        if (sanitized.is_active === undefined) sanitized.is_active = true;
    }

    return sanitized;
};
/**
 * Institution Sanitizer
 * Normalizes inputs and ensures only provided fields are returned.
 */
export const sanitizeInstitution = (data: any) => {
    const sanitized: Record<string, any> = {};

    if (data.name !== undefined) sanitized.name = data.name.trim();
    if (data.email !== undefined) sanitized.email = data.email.toLowerCase().trim();
    if (data.phone_number !== undefined) sanitized.phone_number = data.phone_number.trim();
    
    // Address and logo_url are nullable
    if (data.address !== undefined) sanitized.address = data.address ? data.address.trim() : null;
    if (data.logo_url !== undefined) sanitized.logo_url = data.logo_url ? data.logo_url.trim() : null;
    
    // Extract user_id for junction mapping on creation
    if (data.user_id !== undefined) sanitized.user_id = data.user_id;

    return sanitized;
};
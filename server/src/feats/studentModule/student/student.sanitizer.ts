/**
 * Student Sanitizer
 * Normalizes inputs. Email is optional (nullable).
 */
export const sanitizeStudent = (data: any) => {
    return {
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        email: data.email ? data.email.toLowerCase().trim() : null,
        phone_number: data.phone_number?.trim(),
        date_of_birth: data.date_of_birth,
        guardian_name: data.guardian_name?.trim(),
        guardian_phone: data.guardian_phone?.trim(),
    };
};
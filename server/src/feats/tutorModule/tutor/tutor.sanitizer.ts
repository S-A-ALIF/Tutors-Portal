export const sanitizeTutor = (data: any) => {
    return {
        ...data,
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone_number: data.phone_number?.trim(),
        bio: data.bio?.trim(),
        // Ensure subjects are trimmed and filtered for empty strings if provided
        subjects: data.subjects ? data.subjects.map((sub: string) => sub.trim()).filter(Boolean) : null,
        // Default is_active to true if not explicitly provided during creation
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
    };
};
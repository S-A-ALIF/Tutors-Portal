import { z } from 'zod';

const idParamSchema = z.object({
    id: z.string().uuid("Invalid tutor ID format"),
});

export const tutorSchema = {
    create: z.object({
        body: z.object({
            user_id: z.string().uuid("Valid user ID is required").optional().nullable(),
            user_role: z.string().refine((val) => ['tutor', 'admin'].includes(val), {
                message: "Role must be 'tutor' or 'admin'"
            }),
            first_name: z.string().min(1, "First name is required"),
            last_name: z.string().min(1, "Last name is required"),
            email: z.string().email("Invalid email format").optional().nullable(),
            phone_number: z.string().min(10, "Valid phone number is required"),
            bio: z.string().max(1000, "Bio is too long").optional().nullable(),
            hourly_rate: z.number().nonnegative("Hourly rate must be a positive number").optional().nullable(),
            monthly_salary: z.number().nonnegative("Monthly salary must be a positive number").optional().nullable(),
            subjects: z.array(z.string()).optional().nullable(),
            is_active: z.boolean().optional(),
        }),
    }),
    update: z.object({
        params: idParamSchema,
        body: z.object({
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            email: z.string().email("Invalid email format").optional().nullable(),
            phone_number: z.string().optional(),
            bio: z.string().max(1000, "Bio is too long").optional().nullable(),
            hourly_rate: z.number().nonnegative("Hourly rate must be a positive number").optional().nullable(),
            monthly_salary: z.number().nonnegative("Monthly salary must be a positive number").optional().nullable(),
            subjects: z.array(z.string()).optional().nullable(),
            is_active: z.boolean().optional(),
        }).refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        }),
    }),
    delete: z.object({
        params: idParamSchema,
    }),
    getOne: z.object({
        params: idParamSchema,
    }),
};
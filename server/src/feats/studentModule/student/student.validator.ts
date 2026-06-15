import { z } from 'zod';

const idParamSchema = z.object({
    id: z.string().uuid("Invalid student ID format"),
});

export const studentSchema = {
    create: z.object({
        body: z.object({
            user_id: z.string().uuid("Valid user ID is required").optional().nullable(),
            first_name: z.string().min(1, "First name is required"),
            last_name: z.string().min(1, "Last name is required"),
            email: z.string().email("Invalid email format").optional().nullable(),
            phone_number: z.string().optional().nullable(),
            address: z.string().optional().nullable(),
            date_of_birth: z.string().optional().nullable(),
            gender: z.string().optional().nullable(),
            guardian_name: z.string().optional().nullable(),
            guardian_phone: z.string().optional().nullable(),
        }),
    }),
    update: z.object({
        params: idParamSchema,
        body: z.object({
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            email: z.string().email("Invalid email format").optional().nullable(),
            phone_number: z.string().optional().nullable(),
            address: z.string().optional().nullable(),
            date_of_birth: z.string().optional().nullable(),
            gender: z.string().optional().nullable(),
            guardian_name: z.string().optional().nullable(),
            guardian_phone: z.string().optional().nullable(),
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
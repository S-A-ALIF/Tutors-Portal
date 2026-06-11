import { z } from 'zod';

// Schema for params validation
const idParamSchema = z.object({
    id: z.string().uuid("Invalid institution ID format"),
});

export const institutionSchema = {
    create: z.object({
        body: z.object({
            name: z.string().min(1, "Name is required"),
            email: z.string().email("Invalid email format"),
            phone_number: z.string().min(10, "Valid phone number is required"),
            address: z.string().optional().nullable(),
            logo_url: z.string().url("Invalid URL format").optional().nullable(),
            is_active: z.boolean().optional(),
            user_id: z.string().uuid("Invalid user ID format"), // ADDED THIS
        }),
    }),
    update: z.object({
        params: idParamSchema,
        body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone_number: z.string().optional(),
            address: z.string().optional().nullable(),
            logo_url: z.string().url().optional().nullable(),
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
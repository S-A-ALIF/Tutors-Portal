import { z } from 'zod';

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
            user_id: z.string().uuid("Invalid user ID format"), 
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
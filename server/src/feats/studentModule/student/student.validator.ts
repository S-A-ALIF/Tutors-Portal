import { z } from 'zod';

// Schema for params validation
const idParamSchema = z.object({
    id: z.string().uuid("Invalid student ID format"),
});

export const studentSchema = {
    enroll: z.object({
        body: z.object({
            first_name: z.string().min(1, "First name is required"),
            last_name: z.string().min(1, "Last name is required"),
            email: z.string().email("Invalid email format").optional().nullable(),
            phone_number: z.string().min(10, "Valid phone number is required"),
            date_of_birth: z.string().min(1, "Date of birth is required"),
            guardian_name: z.string().min(1, "Guardian name is required"),
            guardian_phone: z.string().min(10, "Guardian phone number is required"),
        }),
    }),
    update: z.object({
        params: idParamSchema,
        body: z.object({
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            phone_number: z.string().optional(),
            guardian_name: z.string().optional(),
            guardian_phone: z.string().optional(),
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
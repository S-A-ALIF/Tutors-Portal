import { z } from 'zod';

const idParamSchema = z.object({
    id: z.string().uuid("Invalid ID format"),
});

const studentIdParamSchema = z.object({
    studentId: z.string().uuid("Invalid student ID format"),
});

const statusEnum = z.enum(['active', 'graduated', 'transferred', 'expelled']);

export const enrollmentSchema = {
    create: z.object({
        body: z.object({
            student_id: z.string().uuid("Valid student ID is required"),
            inst_id: z.string().uuid("Valid institution ID is required"),
            academic_year: z.string().min(1, "Academic year is required (e.g., 2023-2024)"),
            grade: z.string().min(1, "Grade/Class is required"),
            section: z.string().optional().nullable(),
            roll_no: z.string().optional().nullable(),
            monthly_fee: z.number().nonnegative("Fee cannot be negative").optional().nullable(),
            status: statusEnum.optional(),
        }),
    }),
    update: z.object({
        params: idParamSchema,
        body: z.object({
            academic_year: z.string().optional(),
            grade: z.string().optional(),
            section: z.string().optional().nullable(),
            roll_no: z.string().optional().nullable(),
            monthly_fee: z.number().nonnegative().optional().nullable(),
            status: statusEnum.optional(),
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
    getByStudent: z.object({
        params: studentIdParamSchema,
    })
};
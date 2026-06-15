import { z } from 'zod';

export const invitationSchema = {
    send: z.object({
        body: z.object({
            inst_id: z.string().uuid("Valid institution ID is required"),
            email: z.string().email("Invalid email format"),
            role: z.enum(['student', 'tutor']).default('student'),
            academic_year: z.string().optional().nullable(),
            grade: z.string().optional().nullable(),
            section: z.string().optional().nullable(),
            roll_no: z.string().optional().nullable(),
            monthly_fee: z.number().nonnegative().optional().nullable(),
            expiry_option: z.enum(['10m', '1h', '24h', '7d']).default('24h')
        }).superRefine((data, ctx) => {
            if (data.role === 'student') {
                if (!data.academic_year) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Academic year is required for students", path: ['academic_year'] });
                }
                if (!data.grade) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Grade is required for students", path: ['grade'] });
                }
            }
        }),
    }),
    verify: z.object({
        body: z.object({
            code: z.string().length(6, "Code must be exactly 6 characters"),
            user_id: z.string().uuid("User ID is required"),
        }),
    }),
    pending: z.object({
        params: z.object({
            email: z.string().email("Invalid email format"),
        }),
    }),
    reject: z.object({
        body: z.object({
            id: z.string().uuid("Invalid invitation ID"),
            email: z.string().email("Invalid email format"),
        }),
    }),
};

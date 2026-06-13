/**
 * Enrollment Sanitizer
 * Normalizes inputs for academic records.
 */
export const sanitizeEnrollment = (data: any) => {
    return {
        student_id: data.student_id,
        inst_id: data.inst_id,
        academic_year: data.academic_year?.trim(),
        grade: data.grade?.trim(),
        section: data.section ? data.section.trim() : null,
        roll_no: data.roll_no ? data.roll_no.trim() : null,
        monthly_fee: data.monthly_fee ? Number(data.monthly_fee) : null,
        is_current_year: data.is_current_year !== undefined ? Boolean(data.is_current_year) : true,
    };
};
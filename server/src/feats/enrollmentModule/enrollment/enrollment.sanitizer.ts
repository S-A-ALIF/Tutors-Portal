/**
 * Enrollment Sanitizer
 * Normalizes inputs for academic records and relational mapping.
 */
export const sanitizeEnrollment = (data: any, isUpdate = false) => {
    const sanitized: any = {};

    if (data.student_id !== undefined) sanitized.student_id = data.student_id;
    if (data.inst_id !== undefined) sanitized.inst_id = data.inst_id;
    if (data.academic_year !== undefined) sanitized.academic_year = data.academic_year?.trim();
    if (data.grade !== undefined) sanitized.grade = data.grade?.trim();
    if (data.section !== undefined) sanitized.section = data.section ? data.section.trim() : null;
    if (data.roll_no !== undefined) sanitized.roll_no = data.roll_no ? data.roll_no.trim() : null;
    if (data.monthly_fee !== undefined) sanitized.monthly_fee = data.monthly_fee ? Number(data.monthly_fee) : null;
    
    if (data.status !== undefined) {
        sanitized.status = data.status.trim();
    } else if (!isUpdate) {
        sanitized.status = 'active'; // Default for new records per schema
    }

    return sanitized;
};
import apiClient from '../../../services/apiClient';

/**
 * Utility to strip out completely empty strings to prevent strict 
 * backend validators (like Zod) from throwing format mismatches.
 */
const cleanPayload = (payload) => {
    return Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== '' && value !== undefined)
    );
};

export const addStudentWithEnrollment = async (data) => {
    // 1. Create the Student Profile
    const rawStudentPayload = {
        inst_id: data.inst_id, 
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email, 
        phone_number: data.phone_number,
        gender: data.gender,
        address: data.address,
        date_of_birth: data.date_of_birth,
        guardian_name: data.guardian_name,
        guardian_phone: data.guardian_phone,
    };
    
    // Send cleaned payload
    const studentPayload = cleanPayload(rawStudentPayload);
    const studentRes = await apiClient.post('/students', studentPayload);
    
    // Safely extract the new student ID
    const newStudentId = studentRes.data?.data?.id || studentRes.data?.id || studentRes.data?.data?._id;

    if (!newStudentId) {
        throw new Error("Failed to retrieve student ID after creation.");
    }

    // 2. Create the Enrollment Record using the new student's ID & the institution ID
    const rawEnrollmentPayload = {
        student_id: String(newStudentId),
        inst_id: String(data.inst_id), 
        academic_year: data.academic_year,
        grade: data.grade,
        section: data.section,
        roll_no: data.roll_no,
        monthly_fee: data.monthly_fee ? Number(data.monthly_fee) : undefined,
        status: 'active' 
    };

    const enrollmentPayload = cleanPayload(rawEnrollmentPayload);
    const enrollmentRes = await apiClient.post('/enrollments', enrollmentPayload);

    return {
        student: studentRes.data?.data || studentRes.data,
        enrollment: enrollmentRes.data?.data || enrollmentRes.data
    };
};
import apiClient from '../../../services/apiClient';

/**
 * Creates a student profile and immediately enrolls them.
 */
export const addStudentWithEnrollment = async (data) => {
    // 1. Create the Student Profile
    const studentPayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone_number: data.phone_number,
        date_of_birth: data.date_of_birth,
        guardian_name: data.guardian_name,
        guardian_phone: data.guardian_phone,
    };
    
    // Removed the /api/v1/ prefix since apiClient already handles it
    const studentRes = await apiClient.post('/students', studentPayload);
    
    // Safely extract the new student ID based on standard Axios wrapper
    const newStudentId = studentRes.data?.data?.id || studentRes.data?.id;

    // 2. Create the Enrollment Record using the new student's ID & your inst_id
    const enrollmentPayload = {
        student_id: newStudentId,
        inst_id: data.inst_id, 
        academic_year: data.academic_year,
        grade: data.grade,
        section: data.section || null,
        roll_no: data.roll_no || null,
        monthly_fee: data.monthly_fee ? Number(data.monthly_fee) : null,
        is_current_year: true
    };

    // Removed the /api/v1/ prefix since apiClient already handles it
    const enrollmentRes = await apiClient.post('/enrollments', enrollmentPayload);

    return {
        student: studentRes.data?.data || studentRes.data,
        enrollment: enrollmentRes.data?.data || enrollmentRes.data
    };
};
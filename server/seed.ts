import { pool } from './src/config/db.config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

const runSeed = async () => {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting database seeding...');
        await client.query('BEGIN');

        console.log('🧹 Clearing existing data...');
        // TRUNCATE clears the tables, CASCADE removes dependent rows in connected tables automatically.
        await client.query(`
            TRUNCATE TABLE 
                users, institutions, tutors, students, 
                user_institutions, user_tutors, user_students, 
                tutor_institutions, enrollments, student_enrollments, 
                institution_enrollments, classes, exams, 
                routine_periods, routine_slots, invitations
            CASCADE;
        `);

        const defaultPassword = await hashPassword('password123');

        // 1. Create Institution & Admin
        console.log('🏢 Creating Institution and Admin...');
        const adminUserId = crypto.randomUUID();
        const instId = crypto.randomUUID();

        await client.query(
            `INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)`,
            [adminUserId, 'admin@example.com', defaultPassword, 'admin']
        );

        await client.query(
            `INSERT INTO institutions (id, name, email, phone_number, address) VALUES ($1, $2, $3, $4, $5)`,
            [instId, 'Global Tech Academy', 'admin@example.com', '+1234567890', '123 Academic Blvd, Tech City']
        );

        await client.query(
            `INSERT INTO user_institutions (user_id, inst_id) VALUES ($1, $2)`,
            [adminUserId, instId]
        );

        // 2. Create Tutors
        console.log('👨‍🏫 Creating Tutors...');
        const tutors = [
            { first: 'John', last: 'Doe', email: 'tutor1@example.com', sub: ['Mathematics', 'Physics'] },
            { first: 'Jane', last: 'Smith', email: 'tutor2@example.com', sub: ['Chemistry', 'Biology'] },
            { first: 'Alan', last: 'Turing', email: 'tutor3@example.com', sub: ['Computer Science'] }
        ];

        const tutorIds: string[] = [];

        for (const t of tutors) {
            const userId = crypto.randomUUID();
            const tutorId = crypto.randomUUID();
            tutorIds.push(tutorId);

            await client.query(
                `INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)`,
                [userId, t.email, defaultPassword, 'tutor']
            );

            await client.query(
                `INSERT INTO tutors (id, first_name, last_name, phone_number, hourly_rate, subjects, email) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [tutorId, t.first, t.last, '555-010' + tutorIds.length, 50.00, t.sub, t.email]
            );

            await client.query(`INSERT INTO user_tutors (user_id, tutor_id) VALUES ($1, $2)`, [userId, tutorId]);
            await client.query(`INSERT INTO tutor_institutions (tutor_id, inst_id) VALUES ($1, $2)`, [tutorId, instId]);
        }

        // 3. Create Classes
        console.log('🏫 Creating Classes...');
        const classes = [
            { grade: 'Grade 10', section: 'A', dept: 'Science', floor: '1st Floor' },
            { grade: 'Grade 10', section: 'B', dept: 'Science', floor: '1st Floor' },
            { grade: 'Grade 11', section: 'A', dept: 'Arts', floor: '2nd Floor' }
        ];
        
        const classIds: string[] = [];
        for (const c of classes) {
            const classId = crypto.randomUUID();
            classIds.push(classId);
            await client.query(
                `INSERT INTO classes (id, inst_id, grade, section, department, floor) VALUES ($1, $2, $3, $4, $5, $6)`,
                [classId, instId, c.grade, c.section, c.dept, c.floor]
            );
        }

        // 4. Create Students & Enrollments
        console.log('🎓 Creating Students...');
        const students = [
            { first: 'Alice', last: 'Wonderland', email: 'student1@example.com', classIndex: 0 },
            { first: 'Bob', last: 'Builder', email: 'student2@example.com', classIndex: 0 },
            { Charlie: 'Charlie', last: 'Chaplin', email: 'student3@example.com', classIndex: 1 },
            { first: 'Daisy', last: 'Duck', email: 'student4@example.com', classIndex: 1 },
            { first: 'Eve', last: 'Hacker', email: 'student5@example.com', classIndex: 2 }
        ];

        for (const s of students) {
            const userId = crypto.randomUUID();
            const studentId = crypto.randomUUID();
            const enrollmentId = crypto.randomUUID();
            const targetClass = classes[s.classIndex];

            // User
            await client.query(
                `INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)`,
                [userId, s.email, defaultPassword, 'student']
            );

            // Student profile
            await client.query(
                `INSERT INTO students (id, first_name, last_name, phone_number, date_of_birth, guardian_name, guardian_phone, gender, email) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [studentId, s.first || 'Charlie', s.last, '555-1234', '2005-05-15', 'Guardian ' + s.last, '555-9999', 'Male', s.email]
            );

            await client.query(`INSERT INTO user_students (user_id, student_id) VALUES ($1, $2)`, [userId, studentId]);

            // Enrollment
            await client.query(
                `INSERT INTO enrollments (id, academic_year, grade, section, department, roll_no, monthly_fee) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [enrollmentId, '2026-2027', targetClass.grade, targetClass.section, targetClass.dept, 'R' + Math.floor(Math.random() * 100), 100]
            );

            await client.query(`INSERT INTO student_enrollments (student_id, enrollment_id) VALUES ($1, $2)`, [studentId, enrollmentId]);
            await client.query(`INSERT INTO institution_enrollments (inst_id, enrollment_id) VALUES ($1, $2)`, [instId, enrollmentId]);
        }

        // 5. Create Exams
        console.log('📝 Creating Exams...');
        await client.query(
            `INSERT INTO exams (id, creator_id, inst_id, name, subject, exam_date, exam_time, grade, section, duration_minutes, total_marks)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [crypto.randomUUID(), adminUserId, instId, 'Midterm Math', 'Mathematics', '2026-07-15', '10:00', 'Grade 10', 'A', 120, 100]
        );
        await client.query(
            `INSERT INTO exams (id, creator_id, inst_id, name, subject, exam_date, exam_time, grade, section, duration_minutes, total_marks)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [crypto.randomUUID(), adminUserId, instId, 'Final Physics', 'Physics', '2026-12-10', '13:00', 'Grade 10', 'B', 180, 100]
        );

        // 6. Create Routines
        console.log('📅 Creating Routines...');
        const periods = [
            { num: 1, start: '09:00 AM', end: '09:45 AM' },
            { num: 2, start: '09:45 AM', end: '10:30 AM' },
            { num: 3, start: '10:30 AM', end: '11:15 AM' },
            { num: 4, start: '11:30 AM', end: '12:15 PM' },
            { num: 5, start: '12:15 PM', end: '01:00 PM' }
        ];

        const periodIds: string[] = [];
        for (const p of periods) {
            const pid = crypto.randomUUID();
            periodIds.push(pid);
            await client.query(
                `INSERT INTO routine_periods (id, inst_id, period_number, start_time, end_time) VALUES ($1, $2, $3, $4, $5)`,
                [pid, instId, p.num, p.start, p.end]
            );
        }

        // Assign some slots on Monday
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
        for (const cid of classIds) {
            for (let i = 0; i < 5; i++) {
                // Randomly skip some periods
                if (Math.random() > 0.8) continue; 
                const sid = crypto.randomUUID();
                const tutorId = tutorIds[Math.floor(Math.random() * tutorIds.length)];
                const subject = subjects[Math.floor(Math.random() * subjects.length)];
                
                await client.query(
                    `INSERT INTO routine_slots (id, inst_id, day_of_week, class_id, period_id, subject, tutor_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [sid, instId, 'Monday', cid, periodIds[i], subject, tutorId]
                );
            }
        }

        await client.query('COMMIT');
        console.log('✅ Seeding completed successfully!');
        
        console.log('\n--- Login Credentials ---');
        console.log('All passwords are: password123');
        console.log('Admin:   admin@example.com');
        console.log('Tutor:   tutor1@example.com');
        console.log('Student: student1@example.com');
        console.log('-------------------------\n');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', e);
    } finally {
        client.release();
        process.exit(0);
    }
};

runSeed();

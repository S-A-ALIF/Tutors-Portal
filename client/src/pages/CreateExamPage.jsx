import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateExamForm from '../features/exam/components/CreateExamForm';
import { useCreateExam } from '../features/exam/hooks/examHooks';
import { useAuth } from '../context/AuthContext';

const CreateExamPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { mutate: createExam, isPending } = useCreateExam();

    const handleSubmit = (examData) => {
        const role = user?.role || user?.data?.role;
        const profile = user?.profile || user?.data?.profile;
        const instId = role === 'admin' ? profile?.id : undefined;

        const payload = {
            ...examData,
            inst_id: instId
        };

        createExam(payload, {
            onSuccess: () => {
                alert('Exam created successfully!');
                window.history.back();
            },
            onError: (error) => {
                const errorMsg = error?.message || 'Failed to create exam.';
                alert(`Error: ${errorMsg}`);
            }
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Schedule Assessment</h1>
            </div>
            
            <CreateExamForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    );
};

export default CreateExamPage;
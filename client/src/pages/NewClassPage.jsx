import React from 'react';
import CreateClassForm from '../features/class/components/CreateClassForm';
import { useCreateClass } from '../features/class/hooks/classHooks';
import { useAuth } from '../context/AuthContext';

const NewClassPage = () => {
    const { user } = useAuth();
    const { mutate: createClass, isPending } = useCreateClass();

    const handleSubmit = (classData) => {
        const role = user?.role || user?.data?.role;
        const profile = user?.profile || user?.data?.profile;
        const instId = role === 'admin' ? profile?.id : undefined;

        const payload = {
            ...classData,
            inst_id: instId
        };

        createClass(payload, {
            onSuccess: () => {
                alert('Class added successfully!');
                window.history.back();
            },
            onError: (error) => {
                const errorMsg = error?.message || 'Failed to add class.';
                alert(`Error: ${errorMsg}`);
            }
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Add New Class</h1>
            </div>
            
            <CreateClassForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    );
};

export default NewClassPage;
import React, { useState } from 'react';
import { useTutors, useDeleteTutor, useUpdateTutor, TutorCard, EditTutorModal } from '../features/tutor';
import LoadingComponent from '../components/ui/LoadingComponent';
import InviteTutorModal from '../features/tutor/components/InviteTutorModal';
import { useAuth } from '../context/AuthContext';

const TutorsPage = () => {
    const { user } = useAuth();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTutor, setEditingTutor] = useState(null);
    
    const instId = user?.profile?.id;

    const { data: tutorsData, isLoading, isError, error } = useTutors();
    const { mutate: deleteTutor, isLoading: isDeleting } = useDeleteTutor();
    const { mutate: updateTutor, isLoading: isUpdating } = useUpdateTutor();

    if (isLoading) {
        return <LoadingComponent message="Loading tutors..." />;
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
                <p className="font-semibold">Failed to load tutors</p>
                <p className="text-sm mt-1">{error?.message || 'Please try again later.'}</p>
            </div>
        );
    }

    const tutors = Array.isArray(tutorsData) 
        ? tutorsData 
        : (tutorsData?.data || tutorsData?.tutors || []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this tutor?')) {
            deleteTutor(id);
        }
    };

    const handleEditClick = (tutor) => {
        setEditingTutor(tutor);
        setIsEditModalOpen(true);
    };

    const handleSaveTutor = (updatedData) => {
        if (!editingTutor) return;
        const tutorId = editingTutor.id || editingTutor._id;
        
        updateTutor(
            { id: tutorId, data: updatedData },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setEditingTutor(null);
                },
                onError: (err) => {
                    const errorMessage = err?.message || err?.error || 'Validation Error';
                    alert(`Server rejected the update:\n"${errorMessage}"`);
                }
            }
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Tutors Management</h1>
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Invite Tutor
                </button>
            </div>

            {tutors.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                    <p className="text-lg font-medium">No tutors found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tutors.map((tutor) => (
                        <TutorCard 
                            key={tutor.id || tutor._id || Math.random()} 
                            tutor={tutor} 
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <InviteTutorModal 
                instId={instId}
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={(data) => {
                    // Refetching happens via react-query in theory, but here we just alert success
                    console.log('Tutor invited successfully', data);
                }}
            />

            <EditTutorModal 
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTutor(null);
                }} 
                tutor={editingTutor} 
                onSubmit={handleSaveTutor} 
                isLoading={isUpdating} 
            />
        </div>
    );
};

export default TutorsPage;
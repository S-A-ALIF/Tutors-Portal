import React, { useState } from 'react';
import { useStudents } from '../features/student/hooks/studentHooks';
import { useTutors } from '../features/tutor/hooks/tutorHooks';
import { Bell, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '../services/apiClient';

const NotificationPage = () => {
    // Form State
    const [deliveryMethod, setDeliveryMethod] = useState('email');
    const [recipientGroup, setRecipientGroup] = useState('all_students');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Data
    const { data: studentsData, isLoading: loadingStudents } = useStudents();
    const { data: tutorsData, isLoading: loadingTutors } = useTutors();

    // Safely extract arrays
    const students = Array.isArray(studentsData) ? studentsData : (studentsData?.data || studentsData?.students || []);
    const tutors = Array.isArray(tutorsData) ? tutorsData : (tutorsData?.data || tutorsData?.tutors || []);

    const handleRecipientGroupChange = (e) => {
        setRecipientGroup(e.target.value);
        setSelectedRecipients([]); // Clear selection when switching groups
    };

    const handleToggleRecipient = (id) => {
        setSelectedRecipients(prev => 
            prev.includes(id) 
                ? prev.filter(rId => rId !== id)
                : [...prev, id]
        );
    };

    const getFinalRecipients = () => {
        if (recipientGroup === 'all_students') {
            return students.map(s => s.email).filter(Boolean);
        }
        if (recipientGroup === 'all_tutors') {
            return tutors.map(t => t.email).filter(Boolean);
        }
        if (recipientGroup === 'selected_students') {
            return students.filter(s => selectedRecipients.includes(s.id || s._id)).map(s => s.email).filter(Boolean);
        }
        if (recipientGroup === 'selected_tutors') {
            return tutors.filter(t => selectedRecipients.includes(t.id || t._id)).map(t => t.email).filter(Boolean);
        }
        return [];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (deliveryMethod === 'sms') {
            toast.error("SMS notification service is not integrated yet.");
            return;
        }

        if (!message.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        const finalRecipients = getFinalRecipients();

        if (finalRecipients.length === 0) {
            toast.error("No valid recipients found. Make sure they have email addresses.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                recipients: finalRecipients,
                message: message,
                method: deliveryMethod,
                subject: 'New Notification'
            };

            // Notice the route depends on how email routes are mounted in app.ts, typically /api/v1/email/bulk
            const response = await apiClient.post('/send-emails/bulk', payload);
            
            if (response?.data?.success) {
                toast.success(`Notification successfully sent via ${deliveryMethod}!`);
                setMessage('');
                setSelectedRecipients([]);
            } else {
                throw new Error("Failed to send notification.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send notification. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render list of users with checkboxes for specific selection
    const renderUserSelectionList = (users, type) => {
        if (users.length === 0) return <p className="text-gray-500 text-sm p-4 text-center border rounded-lg bg-gray-50">No {type} found.</p>;

        return (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Select {type}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{selectedRecipients.length} selected</span>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                    {users.map(user => {
                        const id = user.id || user._id;
                        const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Unknown User';
                        const subtitle = user.email || user.roll_no || user.phone_number || '';
                        const isSelected = selectedRecipients.includes(id);

                        return (
                            <label 
                                key={id} 
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                    isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'
                                }`}
                            >
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={isSelected} 
                                    onChange={() => handleToggleRecipient(id)} 
                                />
                                <div className="flex-shrink-0">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'
                                    }`}>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>{name}</p>
                                    <p className="text-xs text-gray-500">{subtitle}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pb-20">
            <div className="mb-8 flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                    <Bell className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
                    <p className="text-gray-500 text-sm">Send announcements via email, SMS, or in-app alerts.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div className="p-6 md:p-8 space-y-8">
                    
                    {/* 1. Notify Through (Delivery Method) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                            1. Notify Through
                        </label>
                        <div className="relative">
                            <select 
                                value={deliveryMethod}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none cursor-pointer appearance-none"
                            >
                                <option value="email">Email</option>
                                <option value="sms">Phone Number (SMS)</option>
                                <option value="webapp">Web App (In-app Notification)</option>
                            </select>
                            {/* Custom arrow for select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:right-[50%]">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Recipient Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                            2. Who should receive this?
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${recipientGroup === 'all_students' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="recipientGroup" value="all_students" checked={recipientGroup === 'all_students'} onChange={handleRecipientGroupChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-3 font-medium text-gray-800">All Students</span>
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${recipientGroup === 'selected_students' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="recipientGroup" value="selected_students" checked={recipientGroup === 'selected_students'} onChange={handleRecipientGroupChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-3 font-medium text-gray-800">Selected Student(s)</span>
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${recipientGroup === 'all_tutors' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="recipientGroup" value="all_tutors" checked={recipientGroup === 'all_tutors'} onChange={handleRecipientGroupChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-3 font-medium text-gray-800">All Tutors</span>
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${recipientGroup === 'selected_tutors' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="recipientGroup" value="selected_tutors" checked={recipientGroup === 'selected_tutors'} onChange={handleRecipientGroupChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-3 font-medium text-gray-800">Selected Tutor(s)</span>
                            </label>
                        </div>

                        {/* Dynamic User Selection List */}
                        {recipientGroup === 'selected_students' && (
                            loadingStudents ? <p className="mt-4 text-sm text-gray-500">Loading students...</p> : renderUserSelectionList(students, 'students')
                        )}
                        {recipientGroup === 'selected_tutors' && (
                            loadingTutors ? <p className="mt-4 text-sm text-gray-500">Loading tutors...</p> : renderUserSelectionList(tutors, 'tutors')
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. The Message Box */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                            3. Message
                        </label>
                        <textarea 
                            rows="5"
                            placeholder="Type your notification message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y"
                        ></textarea>
                        <p className="text-right text-xs text-gray-400 mt-2">{message.length} characters</p>
                    </div>

                </div>

                {/* Submit Action */}
                <div className="bg-gray-50 px-6 md:px-8 py-5 border-t border-gray-200 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        {isSubmitting ? 'Sending...' : 'Send Notification'}
                    </button>
                </div>
                
            </form>
        </div>
    );
};

export default NotificationPage;
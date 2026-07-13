import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../features/class/hooks/classHooks';
import { useTutors } from '../features/tutor/hooks/tutorHooks';
import { usePeriods, useSetupPeriods, useRoutine, useSaveSlot } from '../features/routine/hooks/routineHooks';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const RoutinesPage = () => {
    const { user } = useAuth();
    const role = user?.role || user?.data?.role;
    const profile = user?.profile || user?.data?.profile;
    const instId = role === 'admin' ? profile?.id : profile?.inst_id;

    const { data: periodsData, isLoading: loadingPeriods } = usePeriods(instId);
    
    if (loadingPeriods) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const periods = periodsData || [];

    return (
        <div className="p-6 max-w-[1400px] mx-auto h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Routine Management</h1>
            {periods.length === 0 ? (
                role === 'admin' ? (
                    <SetupPhase instId={instId} />
                ) : (
                    <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="text-lg font-medium">Routine schedule has not been set up yet by the administrator.</p>
                    </div>
                )
            ) : (
                <GridPhase instId={instId} periods={periods} role={role} />
            )}
        </div>
    );
};

const SetupPhase = ({ instId }) => {
    const [numPeriods, setNumPeriods] = useState(1);
    const [periodsConfig, setPeriodsConfig] = useState([{ period_number: 1, start_time: '09:00 AM', end_time: '09:45 AM' }]);
    const { mutate: setupPeriods, isPending } = useSetupPeriods();

    const handleNumChange = (e) => {
        const val = e.target.value;
        setNumPeriods(val);
        
        const num = parseInt(val, 10);
        if (!isNaN(num) && num > 0) {
            const newConfig = [];
            for (let i = 1; i <= num; i++) {
                newConfig.push(periodsConfig[i - 1] || { period_number: i, start_time: '', end_time: '' });
            }
            setPeriodsConfig(newConfig);
        } else {
            setPeriodsConfig([]);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...periodsConfig];
        updated[index][field] = value;
        setPeriodsConfig(updated);
    };

    const handleSubmit = () => {
        // Validate
        for (const p of periodsConfig) {
            if (!p.start_time || !p.end_time) {
                alert("Please fill all time fields");
                return;
            }
        }
        setupPeriods({ inst_id: instId, periods: periodsConfig });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Setup Institution Periods</h2>
            <p className="text-gray-500 text-sm mb-6">Before creating routines, define the universal time periods for your institution.</p>
            
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Periods per Day</label>
                <input 
                    type="number" 
                    min="1" max="15" 
                    value={numPeriods} 
                    onChange={handleNumChange}
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-4 mb-6">
                {periodsConfig.map((p, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="w-20 font-medium text-gray-700">Period {p.period_number}</div>
                        <input 
                            type="text" 
                            placeholder="Start (e.g. 09:00 AM)" 
                            value={p.start_time}
                            onChange={(e) => handleChange(i, 'start_time', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <span className="text-gray-400">to</span>
                        <input 
                            type="text" 
                            placeholder="End (e.g. 09:45 AM)" 
                            value={p.end_time}
                            onChange={(e) => handleChange(i, 'end_time', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                ))}
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
                {isPending ? 'Saving...' : 'Save Periods'}
            </button>
        </div>
    );
};

const GridPhase = ({ instId, periods, role }) => {
    const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[0]);
    const { data: classesResponse } = useClasses(instId);
    const { data: routineSlots } = useRoutine(instId, activeDay);
    
    const [editingCell, setEditingCell] = useState(null); // { class_id, period_id, existingSlot }

    const classes = classesResponse?.data || [];
    const slots = routineSlots || [];

    const getSlot = (classId, periodId) => {
        return slots.find(s => s.class_id === classId && s.period_id === periodId);
    };

    const handleCellClick = (cls, p, slot) => {
        if (role !== 'admin') return;
        setEditingCell({ class_id: cls.id, period_id: p.id, slot });
    };

    return (
        <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
                {DAYS_OF_WEEK.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                            activeDay === day 
                                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
            
            <div className="p-4 flex-1 overflow-auto bg-gray-50">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="p-3 text-left font-semibold text-gray-700 border-r border-gray-200 sticky left-0 bg-gray-100 z-10 w-48 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                Class
                            </th>
                            {periods.map(p => (
                                <th key={p.id} className="p-3 text-center border-r border-gray-200 min-w-[160px]">
                                    <div className="font-bold text-gray-800">Period {p.period_number}</div>
                                    <div className="text-xs text-gray-500 font-medium">{p.start_time} - {p.end_time}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length === 0 ? (
                            <tr><td colSpan={periods.length + 1} className="p-8 text-center text-gray-500">No classes found. Add classes first.</td></tr>
                        ) : (
                            classes.map(cls => (
                                <tr key={cls.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-gray-900 border-r border-gray-200 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                        <div className="font-bold">{cls.grade} {cls.section ? ` - ${cls.section}` : ''}</div>
                                        {cls.department && <div className="text-xs text-gray-500">{cls.department}</div>}
                                    </td>
                                    {periods.map(p => {
                                        const slot = getSlot(cls.id, p.id);
                                        return (
                                            <td 
                                                key={p.id} 
                                                onClick={() => handleCellClick(cls, p, slot)}
                                                className={`p-2 border-r border-gray-200 text-center relative group ${role === 'admin' ? 'cursor-pointer hover:bg-blue-50/50 transition-colors' : ''}`}
                                            >
                                                {slot && (slot.subject || slot.tutor_id) ? (
                                                    <div className="flex flex-col items-center justify-center h-full min-h-[60px] p-2 rounded-md bg-blue-50 border border-blue-100">
                                                        <span className="font-bold text-blue-900 text-sm truncate w-full">{slot.subject || 'No Subject'}</span>
                                                        {(slot.first_name || slot.last_name) && (
                                                            <span className="text-xs text-blue-700 font-medium truncate w-full mt-1">
                                                                {slot.first_name} {slot.last_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className={`min-h-[60px] flex items-center justify-center text-gray-300 transition-colors ${role === 'admin' ? 'group-hover:text-blue-300' : ''}`}>
                                                        <span className="text-2xl">{role === 'admin' ? '+' : '-'}</span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {editingCell && (
                <EditModal 
                    instId={instId} 
                    dayOfWeek={activeDay}
                    cell={editingCell} 
                    onClose={() => setEditingCell(null)} 
                />
            )}
        </div>
    );
};

const EditModal = ({ instId, dayOfWeek, cell, onClose }) => {
    const { slot } = cell;
    const [subject, setSubject] = useState(slot?.subject || '');
    const [tutorId, setTutorId] = useState(slot?.tutor_id || '');
    
    const { data: tutorsData } = useTutors();
    const tutors = Array.isArray(tutorsData) ? tutorsData : (tutorsData?.data || tutorsData?.tutors || []);
    
    const { mutate: saveSlot, isPending } = useSaveSlot();

    const handleSave = () => {
        saveSlot({
            inst_id: instId,
            day_of_week: dayOfWeek,
            class_id: cell.class_id,
            period_id: cell.period_id,
            subject,
            tutor_id: tutorId || null
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                    <h3 className="text-lg font-bold text-blue-900">Assign Subject & Tutor</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Mathematics" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tutor (Optional)</label>
                        <select 
                            value={tutorId} 
                            onChange={(e) => setTutorId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Select Tutor --</option>
                            {tutors.map(t => (
                                <option key={t.id || t._id} value={t.id || t._id}>
                                    {t.first_name} {t.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isPending}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoutinesPage;
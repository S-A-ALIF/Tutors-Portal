export interface RoutinePeriod {
    id: string;
    inst_id: string;
    period_number: number;
    start_time: string;
    end_time: string;
}

export interface RoutineSlot {
    id: string;
    inst_id: string;
    day_of_week: string;
    class_id: string;
    period_id: string;
    subject?: string;
    tutor_id?: string;
    first_name?: string; // from tutor join
    last_name?: string;  // from tutor join
}

export interface SetupPeriodsDTO {
    inst_id: string;
    periods: {
        period_number: number;
        start_time: string;
        end_time: string;
    }[];
}

export interface SaveSlotDTO {
    inst_id: string;
    day_of_week: string;
    class_id: string;
    period_id: string;
    subject?: string;
    tutor_id?: string;
}

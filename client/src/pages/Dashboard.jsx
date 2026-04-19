import React from "react";
import AppContainer from "../components/layouts/AppContainer";
import DashboardHeader from "../features/dashboard/components/DashboardHeader";
import QuickActionsSection from "../features/dashboard/components/QuickActionsSection";
import StatsSection from "../features/dashboard/components/StatsSection";
import RecentFeesSection from "../features/dashboard/components/RecentFeesSection";
import ScheduleTimeline from "../features/dashboard/components/ScheduleTimeline";
import FeeChartWidget from "../features/dashboard/components/FeeChartWidget";
import ExamResultsWidget from "../features/dashboard/components/ExamResultsWidget";

const Dashboard = () => {
  return (
    <AppContainer>
      <DashboardHeader />
      <QuickActionsSection />
      <StatsSection />

      {/* Grid Row 1 (Matches original .grid-2) */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-[14px] mb-[14px]">
        <RecentFeesSection />
        <ScheduleTimeline />
      </div>

      {/* Grid Row 2 (Matches original .grid-2) */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-[14px]">
        <FeeChartWidget />
        <ExamResultsWidget />
      </div>
    </AppContainer>
  );
};

export default Dashboard;

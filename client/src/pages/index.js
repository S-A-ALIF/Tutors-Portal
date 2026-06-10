import Dashboard from "./Dashboard";
import Examinations from "./ExaminationsPage";
import FeeCollection from "./FeeCollectionPage";
import PayRoll from "./PayRollPage";
import Routine from "./RoutinesPage";
import Settings from "./SettingsPage";
import StudentDashboard from "./StudentDashboard";
import Students from "./StudentsPage";
import Tutors from "./TutorsPage";
import LoginPage from "./authentication/LoginPage";
import SignupPage from "./authentication/SignupPage";
import EnrollStudent from "./EnrollStudentPage";
import CreateExam from "./CreateExamPage";
import NewClass from "./NewClassPage";
import RecordPayment from "./RecordPaymentPage";
import RecentTransactions from "./RecentTransactionsPage";
import AllResults from "./AllResultsPage";
import ProfilePage from "./ProfilePage";
import NotificationPage from "./NotificationPage";

export const pages = [
    {
      path: "login",
      component: LoginPage,
      isProtected: false,
    },
    {
      path: "signup",
      component: SignupPage,
      isProtected: false,
    },
  {
    path: "dashboard",
    component: Dashboard,
    isProtected: true,
  },
  {
    path: "student-dashboard",
    component: StudentDashboard,
    isProtected: true,
  },
  {
    path: "examinations",
    component: Examinations,
    isProtected: true,
  },
  {
    path: "fee-collection",
    component: FeeCollection,
    isProtected: true,
  },
  {
    path: "payroll",
    component: PayRoll,
    isProtected: true,
  },
  {
    path: "routines",
    component: Routine,
    isProtected: true,
  },
  {
    path: "settings",
    component: Settings,
    isProtected: true,
  },
  {
    path: "students",
    component: Students,
    isProtected: true,
  },
  {
    path: "tutors",
    component: Tutors,
    isProtected: true,
  },
  {
    path: "enroll-student",
    component: EnrollStudent,
    isProtected: true,
  },
  {
    path: "create-exam",
    component: CreateExam,
    isProtected: true,
  },
  {
    path: "new-class",
    component: NewClass,
    isProtected: true,
  },
  {
    path: "record-payment",
    component: RecordPayment,
    isProtected: true,
  },
  {
    path: "recent-transactions",
    component: RecentTransactions,
    isProtected: true,
  },
  {
    path: "all-results",
    component: AllResults,
    isProtected: true,
  },
  {
    path: "profile",
    component: ProfilePage,
    isProtected: true,
  },
  {
    path: "notifications",
    component: NotificationPage,
    isProtected: true,
  },
];
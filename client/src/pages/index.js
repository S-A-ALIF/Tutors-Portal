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
import AcceptInvitationPage from "./AcceptInvitationPage";
import CreateExam from "./CreateExamPage";
import NewClass from "./NewClassPage";
import RecordPayment from "./RecordPaymentPage";
import RecentTransactions from "./RecentTransactionsPage";
import AllResults from "./AllResultsPage";
import ProfilePage from "./ProfilePage";
import NotificationPage from "./NotificationPage";
import TutorDashboard from "./TutorDashboard";
import StudentFeesPage from "./StudentFeesPage";

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
    allowedRoles: ['admin'],
  },
  {
    path: "student-dashboard",
    component: StudentDashboard,
    isProtected: true,
    allowedRoles: ['student'],
  },
  {
    path: "tutor-dashboard",
    component: TutorDashboard,
    isProtected: true,
    allowedRoles: ['tutor'],
  },
  {
    path: "my-fees",
    component: StudentFeesPage,
    isProtected: true,
    allowedRoles: ['student'],
  },
  {
    path: "examinations",
    component: Examinations,
    isProtected: true,
    allowedRoles: ['admin', 'tutor', 'student'],
  },
  {
    path: "fee-collection",
    component: FeeCollection,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "payroll",
    component: PayRoll,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "routines",
    component: Routine,
    isProtected: true,
    allowedRoles: ['admin', 'tutor', 'student'],
  },
  {
    path: "settings",
    component: Settings,
    isProtected: true,
    allowedRoles: ['admin', 'tutor', 'student'],
  },
  {
    path: "students",
    component: Students,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "tutors",
    component: Tutors,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "enroll-student",
    component: EnrollStudent,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "create-exam",
    component: CreateExam,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "new-class",
    component: NewClass,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "record-payment",
    component: RecordPayment,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "recent-transactions",
    component: RecentTransactions,
    isProtected: true,
    allowedRoles: ['admin'],
  },
  {
    path: "all-results",
    component: AllResults,
    isProtected: true,
    allowedRoles: ['admin', 'tutor', 'student'],
  },
  {
    path: "profile",
    component: ProfilePage,
    isProtected: true,
    allowedRoles: ['admin', 'tutor', 'student'],
  },
  {
    path: "notifications",
    component: NotificationPage,
    isProtected: true,
    allowedRoles: ['admin', 'tutor', 'student'],
  },
  {
    path: "accept-invitation",
    component: AcceptInvitationPage,
    isProtected: true,
    allowedRoles: ['tutor', 'student'],
  }
];
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Users } from './views/Users';
import { Catalogs } from './views/Catalogs';
import { AcademicPlans } from './views/AcademicPlans';
import { CurriculumDesign } from './views/CurriculumDesign';
import { AcademicPeriod } from './views/AcademicPeriod';
import { AcademicOffering } from './views/AcademicOffering';
import { SchedulePlanner } from './views/SchedulePlanner';
import { StudentEnrollment } from './views/StudentEnrollment';
import { TeacherPortal } from './views/TeacherPortal';
import { AttendanceRecord } from './views/AttendanceRecord';
import { AttendanceSheet } from './views/AttendanceSheet';

import { MainLayout } from './components/layout/MainLayout';

export type ActiveScreen =
  | 'login'
  | 'dashboard'
  | 'users'
  | 'catalogs'
  | 'academic-plans'
  | 'curriculum-design'
  | 'academic-period'
  | 'academic-offering'
  | 'schedule-planner'
  | 'student-enrollment'
  | 'teacher-portal'
  | 'attendance-record'
  | 'attendance-sheet';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('login');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const handleNavigate = async (key: string) => {
    if (key === 'login') {
      await logout();
      setActiveScreen('login');
      return;
    }
    setActiveScreen(key as ActiveScreen);
  };

  if (!isAuthenticated || activeScreen === 'login') {
    return (
      <Login
        onLoginSuccess={() => setActiveScreen('dashboard')}
      />
    );
  }

  return (
    <MainLayout
      onNavigate={handleNavigate}
      activeScreen={activeScreen}
    >
      {activeScreen === 'dashboard' && <Dashboard />}
      {activeScreen === 'users' && <Users />}
      {activeScreen === 'catalogs' && <Catalogs />}
      {activeScreen === 'academic-plans' && (
        <AcademicPlans
          onNavigateToMalla={() => setActiveScreen('curriculum-design')}
        />
      )}
      {activeScreen === 'curriculum-design' && (
        <CurriculumDesign
          onBackToPlans={() => setActiveScreen('academic-plans')}
        />
      )}
      {activeScreen === 'academic-period' && <AcademicPeriod />}
      {activeScreen === 'academic-offering' && <AcademicOffering />}
      {activeScreen === 'schedule-planner' && <SchedulePlanner />}
      {activeScreen === 'student-enrollment' && <StudentEnrollment />}
      {activeScreen === 'teacher-portal' && (
        <TeacherPortal
          onNavigateToAttendance={(sessionId, courseId) => {
            setSelectedSessionId(sessionId);
            if (courseId) setSelectedCourseId(courseId);
            setActiveScreen('attendance-record');
          }}
        />
      )}
      {activeScreen === 'attendance-record' && (
        <AttendanceRecord
          sessionId={selectedSessionId}
          onBack={() => setActiveScreen('teacher-portal')}
          onNavigateToSheet={(courseId) => {
            if (courseId) setSelectedCourseId(courseId);
            setActiveScreen('attendance-sheet');
          }}
        />
      )}
      {activeScreen === 'attendance-sheet' && (
        <AttendanceSheet
          idMateriaPorGrupo={selectedCourseId}
          onBack={() => setActiveScreen('teacher-portal')}
        />
      )}
    </MainLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

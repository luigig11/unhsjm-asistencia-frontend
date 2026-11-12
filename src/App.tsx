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

type ActiveScreen =
  | 'P01'
  | 'P02'
  | 'P03'
  | 'P04'
  | 'P05'
  | 'P06'
  | 'P07'
  | 'P08'
  | 'P09'
  | 'P10'
  | 'P11'
  | 'P12'
  | 'P13';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('P01');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const handleNavigate = async (key: string) => {
    if (key === 'P01') {
      await logout();
      setActiveScreen('P01');
      return;
    }
    setActiveScreen(key as ActiveScreen);
  };

  if (!isAuthenticated || activeScreen === 'P01') {
    return (
      <Login
        onLoginSuccess={() => setActiveScreen('P02')}
      />
    );
  }

  return (
    <MainLayout
      onNavigate={handleNavigate}
      activeScreen={activeScreen}
    >
      {activeScreen === 'P02' && <Dashboard />}
      {activeScreen === 'P03' && <Users />}
      {activeScreen === 'P04' && <Catalogs />}
      {activeScreen === 'P05' && (
        <AcademicPlans
          onNavigateToMalla={() => setActiveScreen('P06')}
        />
      )}
      {activeScreen === 'P06' && (
        <CurriculumDesign
          onBackToPlans={() => setActiveScreen('P05')}
        />
      )}
      {activeScreen === 'P07' && <AcademicPeriod />}
      {activeScreen === 'P08' && <AcademicOffering />}
      {activeScreen === 'P09' && <SchedulePlanner />}
      {activeScreen === 'P10' && <StudentEnrollment />}
      {activeScreen === 'P11' && (
        <TeacherPortal
          onNavigateToAttendance={(sessionId, courseId) => {
            setSelectedSessionId(sessionId);
            if (courseId) setSelectedCourseId(courseId);
            setActiveScreen('P12');
          }}
        />
      )}
      {activeScreen === 'P12' && (
        <AttendanceRecord
          sessionId={selectedSessionId}
          onBack={() => setActiveScreen('P11')}
          onNavigateToSheet={(courseId) => {
            if (courseId) setSelectedCourseId(courseId);
            setActiveScreen('P13');
          }}
        />
      )}
      {activeScreen === 'P13' && (
        <AttendanceSheet
          idMateriaPorGrupo={selectedCourseId}
          onBack={() => setActiveScreen('P11')}
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


import { useState } from 'react';

import { Pantalla01Login } from './views/Pantalla01Login';
import { Pantalla02Dashboard } from './views/Pantalla02Dashboard';
import { Pantalla03UsuariosDocentes } from './views/Pantalla03UsuariosDocentes';
import { Pantalla04Catalogos } from './views/Pantalla04Catalogos';
import { Pantalla05PlanesAcademicos } from './views/Pantalla05PlanesAcademicos';
import { Pantalla06ConstructorMalla } from './views/Pantalla06ConstructorMalla';
import { Pantalla07PeriodoEscolar } from './views/Pantalla07PeriodoEscolar';
import { Pantalla08OfertaAcademica } from './views/Pantalla08OfertaAcademica';
import { Pantalla09ProgramadorHorarios } from './views/Pantalla09ProgramadorHorarios';
import { Pantalla10MatriculaEstudiante } from './views/Pantalla10MatriculaEstudiante';
import { Pantalla11PortalDocente } from './views/Pantalla11PortalDocente';
import { Pantalla12ActaAsistencia } from './views/Pantalla12ActaAsistencia';
import { Pantalla13SabanaAsistencia } from './views/Pantalla13SabanaAsistencia';

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

function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('P06');

  // Pantalla de inicio de sesión
  if (activeScreen === 'P01') {
    return (
      <Pantalla01Login
        onLoginSuccess={() => setActiveScreen('P02')}
      />
    );
  }

  return (
    <MainLayout
      onNavigate={(key) => setActiveScreen(key as ActiveScreen)}
      activeScreen={activeScreen}
    >
      {/* P02 - Dashboard */}
      {activeScreen === 'P02' && (
        <Pantalla02Dashboard />
      )}

      {/* P03 - Usuarios y Docentes */}
      {activeScreen === 'P03' && (
        <Pantalla03UsuariosDocentes />
      )}

      {/* P04 - Catálogos Institucionales */}
      {activeScreen === 'P04' && (
        <Pantalla04Catalogos />
      )}

      {/* P05 - Planes Académicos */}
      {activeScreen === 'P05' && (
        <Pantalla05PlanesAcademicos
          onNavigateToMalla={() => setActiveScreen('P06')}
        />
      )}

      {/* P06 - Constructor de Malla Curricular */}
      {activeScreen === 'P06' && (
        <Pantalla06ConstructorMalla
          onBackToPlans={() => setActiveScreen('P05')}
        />
      )}

      {/* P07 - Período Escolar y Feriados */}
      {activeScreen === 'P07' && (
        <Pantalla07PeriodoEscolar />
      )}

      {/* P08 - Oferta Académica y Grupos */}
      {activeScreen === 'P08' && (
        <Pantalla08OfertaAcademica />
      )}

      {/* P09 - Programador de Horarios */}
      {activeScreen === 'P09' && (
        <Pantalla09ProgramadorHorarios />
      )}

      {/* P10 - Matrícula de Estudiantes */}
      {activeScreen === 'P10' && (
        <Pantalla10MatriculaEstudiante />
      )}

      {/* P11 - Portal del Docente */}
      {activeScreen === 'P11' && (
        <Pantalla11PortalDocente />
      )}

      {/* P12 - Acta de Asistencia */}
      {activeScreen === 'P12' && (
        <Pantalla12ActaAsistencia />
      )}
      {/* P13 - Sábana Consolidada de Asistencia */}
      {activeScreen === 'P13' && (
      <Pantalla13SabanaAsistencia />
      )}
    </MainLayout>
  );
}

export default App;

import { useState } from 'react'
import { Pantalla01Login } from './views/Pantalla01Login'
import { Pantalla02Dashboard } from './views/Pantalla02Dashboard'
import { Pantalla03UsuariosDocentes } from './views/Pantalla03UsuariosDocentes'
import { Pantalla04Catalogos } from './views/Pantalla04Catalogos'
import { Pantalla05PlanesAcademicos } from './views/Pantalla05PlanesAcademicos'
import { Pantalla06ConstructorMalla } from './views/Pantalla06ConstructorMalla'
import { MainLayout } from './components/layout/MainLayout'

type ActiveScreen = 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06'

function App() {
  // Configurada en 'P06' como primera pantalla para captura en Figma con html.to.design
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('P06')

  // Pantalla pública autónoma (Login)
  if (activeScreen === 'P01') {
    return <Pantalla01Login onLoginSuccess={() => setActiveScreen('P02')} />
  }

  // Pantallas privadas con MainLayout maestro compartido
  return (
    <MainLayout
      onNavigate={(key) => setActiveScreen(key as ActiveScreen)}
      activeScreen={activeScreen}
    >
      {activeScreen === 'P02' && <Pantalla02Dashboard />}
      {activeScreen === 'P03' && <Pantalla03UsuariosDocentes />}
      {activeScreen === 'P04' && <Pantalla04Catalogos />}
      {activeScreen === 'P05' && (
        <Pantalla05PlanesAcademicos
          onNavigateToMalla={() => setActiveScreen('P06')}
        />
      )}
      {activeScreen === 'P06' && (
        <Pantalla06ConstructorMalla
          onBackToPlans={() => setActiveScreen('P05')}
        />
      )}
    </MainLayout>
  )
}

export default App

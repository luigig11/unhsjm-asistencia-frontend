import { useState } from 'react'
import { Pantalla01Login } from './views/Pantalla01Login'
import { Pantalla02Dashboard } from './views/Pantalla02Dashboard'
import { Pantalla03UsuariosDocentes } from './views/Pantalla03UsuariosDocentes'
import { Pantalla04Catalogos } from './views/Pantalla04Catalogos'
import { MainLayout } from './components/layout/MainLayout'

type ActiveScreen = 'P01' | 'P02' | 'P03' | 'P04'

function App() {
  // Inicializada en 'P01' (Login) como primera pantalla
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('P01')

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
    </MainLayout>
  )
}

export default App

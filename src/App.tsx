import { useState } from 'react'
import { Pantalla01Login } from './views/Pantalla01Login'
import { Pantalla02Dashboard } from './views/Pantalla02Dashboard'

type ActiveScreen = 'P01' | 'P02'

function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('P01')

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="bg-[#0A294D] text-white border-b border-[#1D63B8] px-4 py-1.5 flex items-center justify-end gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setActiveScreen('P01')}
          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
            activeScreen === 'P01'
              ? 'bg-white text-[#0F3C6E] border-white font-semibold'
              : 'bg-[#0F3C6E] text-[#EBF3FC] border-[#1D63B8] hover:bg-[#1D63B8]'
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setActiveScreen('P02')}
          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
            activeScreen === 'P02'
              ? 'bg-white text-[#0F3C6E] border-white font-semibold'
              : 'bg-[#0F3C6E] text-[#EBF3FC] border-[#1D63B8] hover:bg-[#1D63B8]'
          }`}
        >
          Dashboard
        </button>
      </div>

      <div className="flex-1">
        {activeScreen === 'P01' ? (
          <Pantalla01Login />
        ) : (
          <Pantalla02Dashboard
            onNavigate={(screenKey) => {
              if (screenKey === 'P01' || screenKey === 'P02') {
                setActiveScreen(screenKey)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App

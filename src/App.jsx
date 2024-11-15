import { useState } from 'react'
import './App.css'
import { MainView } from './components/mainView/mainView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <MainView/>
    </>
  )
}

export default App

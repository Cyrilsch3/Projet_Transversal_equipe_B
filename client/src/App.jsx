import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import History from './pages/History'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
    </Routes>
  )
}

export default App

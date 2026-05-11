import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Projet Transversal</div>
      <ul className="navbar-links">
        <li><NavLink to="/" end>Accueil</NavLink></li>
      </ul>
    </nav>
  )
}

export default Navbar

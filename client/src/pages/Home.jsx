import './Home.css'

const TEAM_NAME = "Équipe B"
const PLACEHOLDER = {
  personnes: 0,
  entrees: 0,
  sorties: 0,
}

function Home() {
  const { personnes, entrees, sorties } = PLACEHOLDER

  return (
    <div className="home-wrapper">
      <div className="dashboard">

        <header className="dashboard-header">
          <span className="team-name">{TEAM_NAME}</span>
          <div className="presence-counter">
            <span className="counter-value">{personnes}</span>
            <span className="counter-label">dans la pièce</span>
          </div>
        </header>

        <section className="dashboard-center">
          <p className="tagline">Appuyer sur le bouton pour signaler votre présence</p>
          <div className="pulse-ring">
            <div className="pulse-dot" />
          </div>
        </section>

        <footer className="dashboard-footer">
          <div className="stat-card">
            <span className="stat-value">{entrees}</span>
            <span className="stat-label">Entrées</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <span className="stat-value">{sorties}</span>
            <span className="stat-label">Sorties</span>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Home

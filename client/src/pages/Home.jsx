import { useState, useEffect } from 'react'
import api from '../services/api'
import './Home.css'

const TEAM_NAME = "Équipe B"
const POLL_INTERVAL = 3000

function Home() {
  const [presents, setPresents] = useState([])

  useEffect(() => {
    async function fetchPresent() {
      try {
        const { data } = await api.get('/present')
        setPresents(data)
      } catch {
        // silencieux, on garde l'état précédent
      }
    }

    fetchPresent()
    const timer = setInterval(fetchPresent, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const [assignOpen, setAssignOpen]   = useState(false)
  const [usersOpen, setUsersOpen]     = useState(false)
  const [username, setUsername]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [users, setUsers]             = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [deletingId, setDeletingId]   = useState(null)

  async function handleAssign(e) {
    e.preventDefault()
    if (!username.trim()) return
    setLoading(true)
    setError(null)
    try {
      await api.post('/assign-card', { username: username.trim() })
      setUsername('')
      setAssignOpen(false)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  async function openUsers() {
    setUsersOpen(true)
    setUsersLoading(true)
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch {
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="home-wrapper">
      <div className="dashboard">

        <header className="dashboard-header">
          <span className="team-name">{TEAM_NAME}</span>
          <div className="presence-counter">
            <span className="counter-value">{presents.length}</span>
            <span className="counter-label">dans la pièce</span>
          </div>
        </header>

        <section className="dashboard-center">
          <div className="presence-table-wrapper">
            <table className="presence-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>ID Carte</th>
                </tr>
              </thead>
              <tbody>
                {presents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="table-empty">Aucune personne dans la pièce</td>
                  </tr>
                ) : (
                  presents.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.Username}</td>
                      <td>{p.id_carte}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dashboard-footer">
          <div className="footer-left">
            <button className="assign-btn" onClick={() => setAssignOpen(true)}>
              + Assigner une carte
            </button>
            <button className="users-btn" onClick={openUsers}>
              Gérer les utilisateurs
            </button>
          </div>
        </footer>

      </div>

      {/* Modal — Assigner une carte */}
      {assignOpen && (
        <div className="modal-overlay" onClick={() => setAssignOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Assigner une carte RFID</h2>
            <p className="modal-sub">Scannez la carte puis entrez le nom d'utilisateur.</p>
            <form className="modal-form" onSubmit={handleAssign}>
              <input
                className="modal-input"
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
              {error && <p className="modal-error">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setAssignOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-add" disabled={loading}>
                  {loading ? 'Envoi…' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal — Gérer les utilisateurs */}
      {usersOpen && (
        <div className="modal-overlay" onClick={() => setUsersOpen(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h2 className="modal-title">Utilisateurs enregistrés</h2>
                <p className="modal-sub">Cartes RFID associées à un compte.</p>
              </div>
              <button className="btn-close" onClick={() => setUsersOpen(false)}>✕</button>
            </div>

            {usersLoading ? (
              <p className="modal-loading">Chargement…</p>
            ) : (
              <div className="users-table-wrapper">
                <table className="presence-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom d'utilisateur</th>
                      <th>ID Carte</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="table-empty">Aucun utilisateur enregistré</td>
                      </tr>
                    ) : (
                      users.map((u, i) => (
                        <tr key={u.id}>
                          <td>{i + 1}</td>
                          <td>{u.Username}</td>
                          <td className="card-id">{u.id_carte}</td>
                          <td>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(u.id)}
                              disabled={deletingId === u.id}
                            >
                              {deletingId === u.id ? '…' : 'Supprimer'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

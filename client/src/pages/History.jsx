import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './History.css'

function History() {
    const navigate = useNavigate()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLogs() {
            try {
                const { data } = await api.get('/logs')
                setLogs(data)
            } catch {
                setLogs([])
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    function formatDate(iso) {
        const d = new Date(iso)
        return d.toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    function formatTime(iso) {
        const d = new Date(iso)
        return d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    return (
        <div className="history-wrapper">
            <div className="history-dashboard">

                <header className="history-header">
                    <button className="back-btn" onClick={() => navigate('/')}>← Retour</button>
                    <h1 className="history-title">Historique des accès</h1>
                </header>

                <section className="history-body">
                    {loading ? (
                        <p className="history-loading">Chargement…</p>
                    ) : (
                        <div className="history-table-wrapper">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Utilisateur</th>
                                        <th>ID Carte</th>
                                        <th>Action</th>
                                        <th>Date</th>
                                        <th>Heure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="table-empty">Aucun log enregistré</td>
                                        </tr>
                                    ) : (
                                        logs.map((log, i) => (
                                            <tr key={log.id}>
                                                <td>{i + 1}</td>
                                                <td>{log.username}</td>
                                                <td className="card-id">{log.id_carte}</td>
                                                <td>
                                                    <span className={`action-badge action-badge--${log.action}`}>
                                                        {log.action === 'entree' ? '🟢 Entrée' : '🔵 Sortie'}
                                                    </span>
                                                </td>
                                                <td>{formatDate(log.timestamp)}</td>
                                                <td>{formatTime(log.timestamp)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>
        </div>
    )
}

export default History
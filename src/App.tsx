import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LoginPage from './pages/LoginPage';
import PanelPage from './pages/PanelPage';
import PresupuestosPage from './pages/PresupuestosPage';
import RecibosPage from './pages/RecibosPage';
import AgendaPage from './pages/AgendaPage';
import PersonalPage from './pages/PersonalPage';
import NuevoPresupuestoPage from './pages/NuevoPresupuestoPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<RootLayout />}>
                    <Route path="/panel" element={<PanelPage />} />
                    <Route path="/presupuestos" element={<PresupuestosPage />} />
                    <Route path="/presupuestos/new" element={<NuevoPresupuestoPage />} />
                    <Route path="/recibos" element={<RecibosPage />} />
                    <Route path="/agenda" element={<AgendaPage />} />
                    <Route path="/personal" element={<PersonalPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BuildingsPage from './pages/buildings/BuildingsPage';
import FloorsPage from './pages/floors/FloorsPage';
import UnitsPage from './pages/units/UnitsPage';
import DevicesPage from './pages/devices/DevicesPage';
import AllUnitsPage from './pages/units/AllUnitsPage';
import AllDevicesPage from './pages/devices/AllDevicesPage';
import AllEnergyPage from './pages/energy/AllEnergyPage';
import AllMaintenancePage from './pages/maintenance/AllMaintenancePage';
import UsersPage from './pages/users/UsersPage';
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="buildings" element={<BuildingsPage />} />
          <Route path="buildings/:buildingId/floors" element={<FloorsPage />}/>
          <Route path="floors/:floorId/units" element={<UnitsPage />} />
          <Route path="units/:unitId/devices"element={<DevicesPage />}/>
          <Route path="units" element={<AllUnitsPage />} />
          <Route path="devices" element={<AllDevicesPage />} />
          <Route path="energy" element={<AllEnergyPage />} />
          <Route path="maintenance" element={<AllMaintenancePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

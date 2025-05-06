import react from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/Notfound'
import ResetPassword from './pages/ResetPassword'
import PasswordResetCondirm from './pages/PasswordResetConfirm'
import ProtectedRoute from './components/ProtectedRoute'

function LogOut() {
  localStorage.clear();
  return <Navigate to="/login" />;
}
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}
export default function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={ <Home /> } />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<RegisterAndLogout />} />
    <Route path="/logout" element={<LogOut />} />
    <Route path="/reset-password" element={<ResetPassword/>} />
    <Route path="/reset-password/:uid/:token" element={<PasswordResetCondirm/>} />
    <Route path="*" element={<NotFound />} />

  </Routes>
  </BrowserRouter>
  )
}



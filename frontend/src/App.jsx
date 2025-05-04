import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import Recette from './pages/Recette'
import Plantes from './pages/Plantes'
import Blog from './pages/Blog'
import Forum from './pages/Forum'
import Register from './pages/register'
import Login from './pages/login'
import UserDashboard from './pages/UserDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes avec layout complet */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="recettes" element={<Recette />} />
          <Route path="plantes" element={<Plantes />} />
          <Route path="blog" element={<Blog />} />
          <Route path="forum" element={<Forum />} />
          <Route path='dashboard' element={<UserDashboard />} />
        </Route>

        {/* Routes sans navbar/footer */}
        <Route element={<AuthLayout />}>
          <Route path='register' element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
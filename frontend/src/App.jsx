import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Recette from './pages/Recette'
import Plantes from './pages/Plantes'
import Blog from './pages/Blog'
import Forum from './pages/Forum'

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recettes" element={<Recette />} />
          <Route path="/plantes" element={<Plantes />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
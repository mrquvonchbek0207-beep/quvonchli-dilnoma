import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ServerWakingNotice from './components/ServerWakingNotice.jsx'
import './i18n/i18n.js'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Editor = lazy(() => import('./pages/Editor.jsx'))
const PublicCard = lazy(() => import('./pages/PublicCard.jsx'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'))
const AdminTemplates = lazy(() => import('./pages/admin/AdminTemplates.jsx'))
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes.jsx'))

function PageLoading() {
  return (
    <main
      className="min-h-[calc(100vh-73px)] animate-pulse bg-rose-50 dark:bg-slate-950"
      aria-busy="true"
    />
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-rose-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
            <Navbar />
            <ServerWakingNotice />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/dashboard"
                element={
                  <Suspense
                    fallback={
                      <main
                        className="min-h-[calc(100vh-73px)] animate-pulse bg-rose-50 dark:bg-slate-950"
                        aria-busy="true"
                      />
                    }
                  >
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="/editor"
                element={
                  <Suspense
                    fallback={
                      <main
                        className="min-h-[calc(100vh-73px)] animate-pulse bg-rose-50 dark:bg-slate-950"
                        aria-busy="true"
                      />
                    }
                  >
                    <Editor />
                  </Suspense>
                }
              />
              <Route
                path="/card/:id"
                element={
                  <Suspense
                    fallback={
                      <main
                        className="min-h-[calc(100vh-73px)] animate-pulse bg-rose-50 dark:bg-slate-950"
                        aria-busy="true"
                      />
                    }
                  >
                    <PublicCard />
                  </Suspense>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<PageLoading />}>
                    <AdminLogin />
                  </Suspense>
                }
              />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<PageLoading />}>
                    <AdminLayout />
                  </Suspense>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="templates" element={<AdminTemplates />} />
                <Route path="quotes" element={<AdminQuotes />} />
              </Route>
              <Route path="*" element={<Landing />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

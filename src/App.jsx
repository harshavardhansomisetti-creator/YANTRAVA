import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth'

import { auth, googleProvider } from './firebase'
import './App.css'

import Components from './Components'
import CircuitLab from './CircuitLab'
import Simulations from './Simulations'
import SimulationWorkspace from './SimulationWorkspace'

const menuItems = [
  { name: 'Dashboard', icon: '⌂', section: 'WORKSPACE' },
  { name: 'Components', icon: '◈', section: 'WORKSPACE' },
  { name: 'Circuit Lab', icon: '⌘', section: 'WORKSPACE' },
  { name: 'Simulations', icon: '▦', section: 'WORKSPACE' },
  { name: 'My Projects', icon: '▤', section: 'MANAGE' },
  { name: 'Settings', icon: '⚙', section: 'MANAGE' }
]

const features = [
  {
    number: '01',
    category: 'LEARN',
    icon: '◈',
    title: 'Components',
    description: 'Explore electronic components through interactive 3D models.',
    action: 'Explore library',
    page: 'Components',
    color: 'blue'
  },
  {
    number: '02',
    category: 'DESIGN',
    icon: '⌘',
    title: 'Circuit Lab',
    description: 'Build electronic circuits and explore their connections.',
    action: 'Open workspace',
    page: 'Circuit Lab',
    color: 'purple'
  },
  {
    number: '03',
    category: 'EXPERIMENT',
    icon: '⌁',
    title: 'Simulations',
    description: 'Explore virtual electronics and embedded experiments.',
    action: 'Start experimenting',
    page: 'Simulations',
    color: 'orange'
  },
  {
    number: '04',
    category: 'BUILD',
    icon: '▤',
    title: 'My Projects',
    description: 'Organize your designs, experiments and engineering ideas.',
    action: 'View projects',
    page: 'My Projects',
    color: 'green'
  }
]

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return 'S'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function App() {
  const [page, setPage] = useState('Dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)

  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')

  const [studentName, setStudentName] = useState(
    () => localStorage.getItem('yantrava-name') || ''
  )

  const [studentCourse, setStudentCourse] = useState(
    () => localStorage.getItem('yantrava-course') || 'ECE'
  )

  const [darkMode, setDarkMode] = useState(true)

  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('yantrava-projects')) || []
    } catch {
      return []
    }
  })

  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedBoard, setSelectedBoard] = useState(null)

  // FIREBASE AUTHENTICATION STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const signedInUser = {
          uid: firebaseUser.uid,
          name:
            firebaseUser.displayName ||
            firebaseUser.email ||
            'YANTRAVA Student',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || ''
        }

        setUser(signedInUser)
        setStudentName(signedInUser.name)
        setSignInOpen(false)
        setAuthError('')
      } else {
        setUser(null)
      }
    })

    return unsubscribe
  }, [])

  const openPage = (name) => {
    setPage(name)
    setMobileMenuOpen(false)
    setAccountMenuOpen(false)
    setSelectedFolder(null)
    setSelectedBoard(null)
  }

  const handleBoardSelect = (board) => {
    setSelectedBoard(board)
  }

  const handleBackToBoards = () => {
    setSelectedBoard(null)
  }

  const updateProjects = (updatedProjects) => {
    setProjects(updatedProjects)

    localStorage.setItem(
      'yantrava-projects',
      JSON.stringify(updatedProjects)
    )
  }

  const createProject = (type) => {
    const projectName = window.prompt('Enter project name:')
    if (!projectName?.trim()) return

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      type,
      createdAt: new Date().toLocaleDateString()
    }

    updateProjects([...projects, newProject])
  }

  const renameProject = (project) => {
    const newName = window.prompt('Enter new project name:', project.name)
    if (!newName?.trim()) return

    updateProjects(
      projects.map((item) =>
        item.id === project.id
          ? { ...item, name: newName.trim() }
          : item
      )
    )
  }

  const duplicateProject = (project) => {
    updateProjects([
      ...projects,
      {
        ...project,
        id: Date.now(),
        name: `${project.name} Copy`,
        createdAt: new Date().toLocaleDateString()
      }
    ])
  }

  const deleteProject = (project) => {
    if (!window.confirm(`Delete "${project.name}"?`)) return

    updateProjects(projects.filter((item) => item.id !== project.id))
  }

  const saveProfile = () => {
    localStorage.setItem('yantrava-name', studentName)
    localStorage.setItem('yantrava-course', studentCourse)

    alert('Profile details saved!')
  }

  const openSignIn = () => {
    setAccountMenuOpen(false)
    setAuthError('')
    setSignInOpen(true)
  }

  // REAL GOOGLE SIGN-IN
  const handleGoogleSignIn = async () => {
    setAuthError('')

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Google sign-in error:', error)

      setAuthError(
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in window was closed. Please try again.'
          : error.code === 'auth/unauthorized-domain'
            ? 'This website domain is not authorized in Firebase yet. Add localhost in Firebase Authentication settings.'
            : 'Google sign-in failed. Please try again.'
      )
    }
  }

  // REAL GOOGLE SIGN-OUT
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setAccountMenuOpen(false)
      setPage('Dashboard')
    } catch (error) {
      console.error('Sign-out error:', error)
      alert('Unable to sign out. Please try again.')
    }
  }

  const renderDashboard = () => (
    <div className="dashboard-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">
            <span className="status-dot"></span>
            YOUR ECE WORKSPACE
          </div>

          <h1>
            Think. Design.
            <br />
            <span>Bring circuits to life.</span>
          </h1>

          <p>
            A practical learning environment to understand electronics,
            design circuits and experiment with technology.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => openPage('Components')}
            >
              Explore workspace <span>↗</span>
            </button>

            <button
              className="secondary-btn"
              onClick={() => openPage('Circuit Lab')}
            >
              Open Circuit Lab
            </button>
          </div>
        </div>

        <div className="hero-visual yantrava-brand-visual">
          <img
            src="/assets/yantrava-logo.png"
            alt="YANTRAVA Complete ECE Laboratory"
            className="hero-brand-image"
          />
        </div>

        <div className="hero-version">
          YANTRAVA / ENGINEERING STUDIO
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">YOUR WORKSPACE</span>
            <h2>Explore YANTRAVA</h2>
            <p>Everything you need to learn and build in electronics.</p>
          </div>

          <span className="section-count">01 — 04</span>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article
              className="feature-card"
              key={feature.title}
              onClick={() => openPage(feature.page)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter') openPage(feature.page)
              }}
            >
              <div className="feature-top">
                <span className="feature-number">{feature.number}</span>
                <span className="feature-category">{feature.category}</span>
                <span className="feature-arrow">↗</span>
              </div>

              <div className={`feature-icon ${feature.color}`}>
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <div className="feature-action">
                {feature.action} <span>→</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-banner">
        <div>
          <span className="section-kicker">THE YANTRAVA APPROACH</span>
          <h3>Understand the concept. Build the circuit. Learn by doing.</h3>
        </div>
        <span className="banner-symbol">⌁</span>
      </section>

      <footer className="app-footer">
        <span>YANTRAVA © 2026</span>
        <span>Understand. Design. Simulate. Experiment.</span>
        <span>VERSION 0.1</span>
      </footer>
    </div>
  )

  const renderMyProjects = () => {
    const folderProjects = selectedFolder
      ? projects.filter((project) => project.type === selectedFolder)
      : []

    return (
      <div className="module-page">
        <div className="module-heading">
          <span className="section-kicker">YOUR ENGINEERING WORK</span>
          <h1>My Projects</h1>
          <p>Manage your circuit designs and simulation projects.</p>
        </div>

        {!selectedFolder ? (
          <div className="project-folder-grid">
            <button
              className="project-folder-card"
              onClick={() => setSelectedFolder('circuit')}
            >
              <span className="project-folder-icon">⌘</span>
              <h2>Circuit Lab</h2>
              <p>
                {projects.filter((p) => p.type === 'circuit').length} projects
              </p>
              <span>Open folder →</span>
            </button>

            <button
              className="project-folder-card"
              onClick={() => setSelectedFolder('simulation')}
            >
              <span className="project-folder-icon">▦</span>
              <h2>Simulations</h2>
              <p>
                {projects.filter((p) => p.type === 'simulation').length} projects
              </p>
              <span>Open folder →</span>
            </button>
          </div>
        ) : (
          <div className="project-folder-content">
            <button
              className="module-back-btn"
              onClick={() => setSelectedFolder(null)}
            >
              ← All folders
            </button>

            <div className="project-folder-title">
              <div>
                <span className="section-kicker">PROJECT FOLDER</span>
                <h2>
                  {selectedFolder === 'circuit' ? 'Circuit Lab' : 'Simulations'}
                </h2>
              </div>

              <button
                className="primary-btn"
                onClick={() => createProject(selectedFolder)}
              >
                + New Project
              </button>
            </div>

            {folderProjects.length === 0 ? (
              <div className="empty-projects">
                <div className="placeholder-icon">▤</div>
                <h3>No projects yet</h3>
                <p>Create your first project in this folder.</p>
              </div>
            ) : (
              <div className="project-list">
                {folderProjects.map((project) => (
                  <div className="project-list-item" key={project.id}>
                    <div className="project-list-icon">
                      {project.type === 'circuit' ? '⌘' : '▦'}
                    </div>

                    <div className="project-list-info">
                      <strong>{project.name}</strong>
                      <span>Created: {project.createdAt}</span>
                    </div>

                    <div className="project-list-actions">
                      <button
                        onClick={() =>
                          alert('Workspace opening will be connected next.')
                        }
                      >
                        Open
                      </button>

                      <button onClick={() => renameProject(project)}>
                        Rename
                      </button>

                      <button onClick={() => duplicateProject(project)}>
                        Duplicate
                      </button>

                      <button
                        className="delete-project-btn"
                        onClick={() => deleteProject(project)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderSettings = () => (
    <div className="module-page">
      <div className="module-heading">
        <span className="section-kicker">PREFERENCES</span>
        <h1>Settings</h1>
        <p>Manage your YANTRAVA workspace preferences.</p>
      </div>

      <div className="settings-panel">
        <div className="settings-item">
          <div>
            <h3>Appearance</h3>
            <p>Choose the appearance of your workspace.</p>
          </div>

          <select
            value={darkMode ? 'dark' : 'light'}
            onChange={(event) =>
              setDarkMode(event.target.value === 'dark')
            }
          >
            <option value="dark">Dark mode</option>
            <option value="light">Light mode</option>
          </select>
        </div>

        <div className="settings-item">
          <div>
            <h3>Workspace</h3>
            <p>Current workspace type.</p>
          </div>

          <span className="settings-value">ECE Engineering Studio</span>
        </div>

        <div className="settings-item">
          <div>
            <h3>Application version</h3>
            <p>Current YANTRAVA version.</p>
          </div>

          <span className="settings-value">0.1</span>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="module-page">
      <div className="module-heading">
        <span className="section-kicker">YOUR ACCOUNT</span>
        <h1>My Profile</h1>
        <p>Manage your personal learning workspace details.</p>
      </div>

      <div className="profile-panel">
        <div className="profile-large-avatar">
          {user ? getInitials(user.name) : 'S'}
        </div>

        <div className="profile-form">
          <label>
            Display name
            <input
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Course / Department
            <input
              value={studentCourse}
              onChange={(event) => setStudentCourse(event.target.value)}
              placeholder="Example: ECE"
            />
          </label>

          <label>
            Account status
            <input
              value={user ? 'Signed in' : 'Not signed in'}
              disabled
            />
          </label>

          <button className="primary-btn" onClick={saveProfile}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${
        mobileMenuOpen ? 'mobile-menu-open' : ''
      } ${darkMode ? '' : 'light-mode'}`}
    >
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/assets/yantrava-icon.png" alt="YANTRAVA" />
          </div>

          <div className="brand-text">
            <h2>YANTRAVA</h2>
            <span>ENGINEERING STUDIO</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          <span className="nav-heading">MAIN MENU</span>

          {menuItems
            .filter((item) => item.section === 'WORKSPACE')
            .map((item) => (
              <button
                key={item.name}
                title={sidebarCollapsed ? item.name : undefined}
                aria-label={item.name}
                className={`nav-item ${page === item.name ? 'active' : ''}`}
                onClick={() => openPage(item.name)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.name}</span>

                {page === item.name && (
                  <span className="nav-indicator"></span>
                )}
              </button>
            ))}

          <span className="nav-heading manage-heading">PERSONAL</span>

          {menuItems
            .filter((item) => item.section === 'MANAGE')
            .map((item) => (
              <button
                key={item.name}
                title={sidebarCollapsed ? item.name : undefined}
                aria-label={item.name}
                className={`nav-item ${page === item.name ? 'active' : ''}`}
                onClick={() => openPage(item.name)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.name}</span>

                {page === item.name && (
                  <span className="nav-indicator"></span>
                )}
              </button>
            ))}
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="sidebar-help">
          <div className="help-icon">✦</div>

          <div>
            <strong>Keep exploring.</strong>
            <span>Learn something new today.</span>
          </div>
        </div>

        <div className="account-area">
          <div className="account-trigger">
            <button
              className="account-main-button"
              onClick={() => {
                if (!user) {
                  openSignIn()
                } else {
                  setAccountMenuOpen((previous) => !previous)
                }
              }}
              title={user ? user.name : 'Sign in'}
            >
              <div className="profile-avatar">
                {user ? getInitials(user.name) : '↗'}
              </div>

              <div className="profile-info">
                <strong>{user ? user.name : 'Sign in'}</strong>

                <span>
                  {user ? user.email : 'Access your account'}
                </span>
              </div>
            </button>

            <button
              className="profile-menu-button"
              title="Account menu"
              aria-label="Open account menu"
              onClick={() => {
                if (!user) {
                  openSignIn()
                } else {
                  setAccountMenuOpen((previous) => !previous)
                }
              }}
            >
              ⋯
            </button>
          </div>

          {accountMenuOpen && user && (
            <div className="account-dropdown">
              <button onClick={() => openPage('Profile')}>
                <span>◉</span> My Profile
              </button>

              <button onClick={() => openPage('Settings')}>
                <span>⚙</span> Account Settings
              </button>

              <button
                className="signout-option"
                onClick={handleSignOut}
              >
                <span>↪</span> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="sidebar-toggle"
              onClick={() => {
                if (window.matchMedia('(max-width: 760px)').matches) {
                  setMobileMenuOpen((previous) => !previous)
                } else {
                  setSidebarCollapsed((previous) => !previous)
                }
              }}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              ☰
            </button>

            <div className="breadcrumb">
              <span>YANTRAVA</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{page}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="workspace-status">
              <span className="status-dot"></span>
              Workspace ready
            </div>

            <div className="topbar-divider"></div>

            <button
              className="topbar-profile"
              title={user ? user.name : 'Sign in'}
              onClick={() => {
                if (!user) {
                  openSignIn()
                } else {
                  setAccountMenuOpen((previous) => !previous)
                }
              }}
            >
              {user ? getInitials(user.name) : '↗'}
            </button>
          </div>
        </header>

        {page === 'Dashboard' ? (
          renderDashboard()
        ) : page === 'Components' ? (
          <div className="components-scroll-area">
            <Components />
          </div>
        ) : page === 'Circuit Lab' ? (
          <div className="workspace-page">
            <CircuitLab />
          </div>
        ) : page === 'Simulations' ? (
          selectedBoard ? (
            <SimulationWorkspace
              board={selectedBoard}
              onBack={handleBackToBoards}
            />
          ) : (
            <Simulations onSelectBoard={handleBoardSelect} />
          )
        ) : page === 'My Projects' ? (
          renderMyProjects()
        ) : page === 'Settings' ? (
          renderSettings()
        ) : page === 'Profile' ? (
          renderProfile()
        ) : (
          renderDashboard()
        )}
      </main>

      {signInOpen && (
        <div
          className="signin-overlay"
          onClick={() => setSignInOpen(false)}
        >
          <div
            className="signin-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="signin-close"
              onClick={() => setSignInOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="signin-logo">
              <img src="/assets/yantrava-icon.png" alt="YANTRAVA" />
            </div>

            <span className="section-kicker">WELCOME TO YANTRAVA</span>

            <h2>Sign in to your workspace</h2>

            <p>
              Sign in with your Google account to access your personal
              engineering workspace.
            </p>

            <button
              className="google-signin-button"
              onClick={handleGoogleSignIn}
            >
              <span className="google-g">G</span>
              Continue with Google
            </button>

            {authError && (
              <span
                className="signin-note"
                role="alert"
                style={{ color: '#ff9999' }}
              >
                {authError}
              </span>
            )}

            <span className="signin-note">
              Secure sign-in powered by Google and Firebase.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
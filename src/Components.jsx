
import { useState } from 'react'
import componentCategories, { getComponentDetails } from './componentsData'
import ComponentViewer from './components3d/ComponentViewer'
import './Components.css'

function Components() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)

  const allGroups = componentCategories.flatMap(category =>
    category.groups.map(group => ({
      name: group,
      category: category.name,
      categoryId: category.id
    }))
  )

  const filteredGroups = allGroups.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const visibleGroups = selectedCategory
    ? filteredGroups.filter(item => item.categoryId === selectedCategory)
    : filteredGroups

  const details = selectedComponent
    ? getComponentDetails(selectedComponent.name, selectedComponent.categoryId)
    : null

  if (selectedComponent) {
    return (
      <main className="components-page">

        <button
          className="back-button"
          onClick={() => setSelectedComponent(null)}
        >
          ← Back to Components
        </button>

        <header className="detail-header">
          <p>YANTRAVA / COMPONENT EXPLORER</p>
          <h1>{selectedComponent.name}</h1>
          <span>{selectedComponent.category}</span>
        </header>

        <section className="component-detail-layout">

          <div className="detail-viewer">
            <h2>3D Interactive Model</h2>

            {/* Selected component name is passed to the 3D viewer */}
            <ComponentViewer
              componentName={selectedComponent.name}
            />

            <p>
              Drag to rotate · Scroll to zoom · Right-click drag to pan
            </p>
          </div>

          <div className="detail-information">
            <h2>Component Information</h2>

            <div className="info-section">
              <h3>Overview</h3>
              <p>{details.overview}</p>
            </div>

            <div className="info-section">
              <h3>Working Principle</h3>
              <p>{details.workingPrinciple}</p>
            </div>

            <div className="info-section">
              <h3>Terminals / Pin Configuration</h3>
              <ul>
                {details.terminals.map((terminal, index) => (
                  <li key={index}>{terminal}</li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>Polarity & Connection</h3>
              <p>{details.polarity}</p>
            </div>

            <div className="info-section">
              <h3>Technical Specifications</h3>
              <ul>
                {details.specifications.map((specification, index) => (
                  <li key={index}>{specification}</li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>Applications</h3>
              <ul>
                {details.applications.map((application, index) => (
                  <li key={index}>{application}</li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>Limitations</h3>
              <ul>
                {details.limitations.map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>Datasheet & Reference</h3>
              <p>{details.referenceNote}</p>
            </div>

          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="components-page">

      <header className="library-header">
        <p className="eyebrow">YANTRAVA / KNOWLEDGE DATABASE</p>
        <h1>Component Library</h1>
        <p>Explore electrical and electronic components.</p>

        <input
          type="text"
          placeholder="Search resistor, capacitor, sensors..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setSelectedCategory(null)
          }}
        />
      </header>

      <div className="component-categories">
        <button
          className={!selectedCategory ? 'active' : ''}
          onClick={() => setSelectedCategory(null)}
        >
          All Components
        </button>

        {componentCategories.map(category => (
          <button
            key={category.id}
            className={selectedCategory === category.id ? 'active' : ''}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <section className="component-grid">
        {visibleGroups.map(item => (
          <article
            className="component-card"
            key={`${item.categoryId}-${item.name}`}
            onClick={() => setSelectedComponent(item)}
          >
            <div className="component-image">
              <span>⚡</span>
            </div>

            <div className="component-info">
              <p>{item.category}</p>
              <h2>{item.name}</h2>
              <span>Explore Component ↗</span>
            </div>
          </article>
        ))}
      </section>

      {visibleGroups.length === 0 && (
        <p className="no-results">
          No matching components found.
        </p>
      )}

    </main>
  )
}

export default Components

import { useEffect, useState } from 'react'
import './App.css'

type Student = {
  id: number
  name: string
  course: string
  year: string
  email: string
  color: string
  gpa: number
}

const studentData: Student[] = [
  { id: 1, name: 'Aarav Mehta', course: 'Computer Science', year: 'Year 2', email: 'aarav.mehta@campus.edu', color: '#2e6da4', gpa: 3.8 },
  { id: 2, name: 'Maya Chen', course: 'Information Technology', year: 'Year 3', email: 'maya.chen@campus.edu', color: '#78b89b', gpa: 3.6 },
  { id: 3, name: 'Noah Williams', course: 'Software Engineering', year: 'Year 1', email: 'noah.williams@campus.edu', color: '#e79a5d', gpa: 3.9 },
  { id: 4, name: 'Sofia Garcia', course: 'Computer Science', year: 'Year 4', email: 'sofia.garcia@campus.edu', color: '#2e6da4', gpa: 3.7 },
  { id: 5, name: 'Liam Okafor', course: 'Data Science', year: 'Year 2', email: 'liam.okafor@campus.edu', color: '#78b89b', gpa: 3.5 },
  { id: 6, name: 'Zara Khan', course: 'Information Technology', year: 'Year 3', email: 'zara.khan@campus.edu', color: '#e79a5d', gpa: 3.8 },
]

function SearchBar({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  return (
    <label className="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Search students by name or major..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </label>
  )
}

function SortControls({ sort, setSort }: { sort: string; setSort: (value: string) => void }) {
  return (
    <div className="sort-controls">
      <span>Sort by</span>
      <button className={sort === 'default' ? 'active' : ''} onClick={() => setSort('default')}>Default</button>
      <button className={sort === 'name' ? 'active' : ''} onClick={() => setSort('name')}>Name A-Z</button>
      <button className={sort === 'gpa' ? 'active' : ''} onClick={() => setSort('gpa')}>GPA</button>
    </div>
  )
}

function StudentCard({ student, isFavorite, toggleFavorite }: { student: Student; isFavorite: boolean; toggleFavorite: (id: number) => void }) {
  return (
    <article className="student-card">
      <div className="card-topline">
        <div className="avatar" style={{ backgroundColor: student.color }}>{student.name.split(' ').map((part) => part[0]).join('')}</div>
        <button className={`favorite-button ${isFavorite ? 'favorite' : ''}`} onClick={() => toggleFavorite(student.id)} aria-label={`${isFavorite ? 'Remove' : 'Add'} ${student.name} ${isFavorite ? 'from' : 'to'} favorites`}>
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <h2>{student.name}</h2>
      <p className="course">{student.course}</p>
      <div className="student-details"><span><strong>{student.gpa.toFixed(1)}</strong> current GPA</span><span>{student.year} <span className="detail-separator">•</span> {student.email}</span></div>
    </article>
  )
}

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('default')
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const filteredStudents = students
    .filter((student) => `${student.name} ${student.course}`.toLowerCase().includes(query.toLowerCase()))
    .sort((first, second) => {
      if (sort === 'name') return first.name.localeCompare(second.name)
      if (sort === 'gpa') return second.gpa - first.gpa
      return first.id - second.id
    })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents(studentData)
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.title = `Dashboard - ${filteredStudents.length} Students`
  })

  function toggleFavorite(id: number) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favoriteId) => favoriteId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">CAMPUS DIRECTORY / LAB 02</p>
          <h1>Student Dashboard</h1>
          <p className="subtitle">Browse, filter, and save students from the campus directory.</p>
        </div>
        <div className="favorite-summary"><span>★</span><strong>{favorites.length}</strong><small>favorites</small></div>
      </header>
      <section className="toolbar">
        <SearchBar query={query} setQuery={setQuery} />
        <SortControls sort={sort} setSort={setSort} />
      </section>
      <section className="results-heading"><div><p className="eyebrow">DIRECTORY RESULTS</p><h2>All students</h2></div><span>{filteredStudents.length} displayed</span></section>
      {isLoading ? <div className="loading"><span className="spinner"></span><p>Loading student data...</p></div> : <section className="student-grid">{filteredStudents.map((student) => <StudentCard key={student.id} student={student} isFavorite={favorites.includes(student.id)} toggleFavorite={toggleFavorite} />)}</section>}
      {!isLoading && filteredStudents.length === 0 && <p className="empty-state">No students match your search.</p>}
      <footer>Interactive Student Directory <span>•</span> React + TypeScript</footer>
    </main>
  )
}

export default App

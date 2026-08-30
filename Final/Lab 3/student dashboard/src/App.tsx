import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import './App.css'

type Theme = 'light' | 'dark'

type Student = {
  id: number
  name: string
  course: string
  year: string
  email: string
  color: string
  gpa: number
}

type NewStudentForm = {
  name: string
  id: string
  course: string
  gpa: string
}

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

type StudentContextType = {
  students: Student[]
  query: string
  setQuery: (value: string) => void
  sort: string
  setSort: (value: string) => void
  favorites: number[]
  toggleFavorite: (id: number) => void
  filteredStudents: Student[]
  addStudent: (student: NewStudentForm) => void
  removeStudent: (id: number) => void
}

const initialStudents: Student[] = [
  { id: 1, name: 'Aarav Mehta', course: 'Computer Science', year: 'Year 2', email: 'aarav.mehta@campus.edu', color: '#2e6da4', gpa: 3.8 },
  { id: 2, name: 'Maya Chen', course: 'Information Technology', year: 'Year 3', email: 'maya.chen@campus.edu', color: '#78b89b', gpa: 3.6 },
  { id: 3, name: 'Noah Williams', course: 'Software Engineering', year: 'Year 1', email: 'noah.williams@campus.edu', color: '#e79a5d', gpa: 3.9 },
  { id: 4, name: 'Sofia Garcia', course: 'Computer Science', year: 'Year 4', email: 'sofia.garcia@campus.edu', color: '#2e6da4', gpa: 3.7 },
  { id: 5, name: 'Liam Okafor', course: 'Data Science', year: 'Year 2', email: 'liam.okafor@campus.edu', color: '#78b89b', gpa: 3.5 },
  { id: 6, name: 'Zara Khan', course: 'Information Technology', year: 'Year 3', email: 'zara.khan@campus.edu', color: '#e79a5d', gpa: 3.8 },
]

const THEME_KEY = 'student-dashboard-theme'
const STUDENTS_KEY = 'student-dashboard-students'
const FAVORITES_KEY = 'student-dashboard-favorites'

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => undefined,
})

const StudentContext = createContext<StudentContextType | undefined>(undefined)

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const savedTheme = window.localStorage.getItem(THEME_KEY)
  return savedTheme === 'dark' ? 'dark' : 'light'
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    document.body.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const value: ThemeContextType = {
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window === 'undefined') return initialStudents

    const savedStudents = window.localStorage.getItem(STUDENTS_KEY)
    if (!savedStudents) return initialStudents

    try {
      const parsedStudents = JSON.parse(savedStudents) as Student[]
      return parsedStudents.length > 0 ? parsedStudents : initialStudents
    } catch {
      return initialStudents
    }
  })

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('default')
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []

    const savedFavorites = window.localStorage.getItem(FAVORITES_KEY)
    if (!savedFavorites) return []

    try {
      return JSON.parse(savedFavorites) as number[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  }, [students])

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const filteredStudents = useMemo(() => {
    return [...students]
      .filter((student) => `${student.name} ${student.course}`.toLowerCase().includes(query.toLowerCase()))
      .sort((first, second) => {
        if (sort === 'name') return first.name.localeCompare(second.name)
        if (sort === 'gpa') return second.gpa - first.gpa
        return first.id - second.id
      })
  }, [students, query, sort])

  const addStudent = (studentForm: NewStudentForm) => {
    const name = studentForm.name.trim()
    const course = studentForm.course.trim()
    const numericId = Number(studentForm.id)
    const gpa = Number(studentForm.gpa)

    const nextId = students.length > 0 ? Math.max(...students.map((student) => student.id)) + 1 : 1

    const newStudent: Student = {
      id: Number.isInteger(numericId) ? numericId : nextId,
      name,
      course,
      year: gpa >= 3.5 ? 'Year 3' : 'Year 1',
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      color: ['#2e6da4', '#78b89b', '#e79a5d'][students.length % 3],
      gpa,
    }

    setStudents((currentStudents) => [newStudent, ...currentStudents])
  }

  const toggleFavorite = (id: number) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(id)
        ? currentFavorites.filter((favoriteId) => favoriteId !== id)
        : [...currentFavorites, id],
    )
  }

  const removeStudent = (id: number) => {
    setStudents((currentStudents) => currentStudents.filter((student) => student.id !== id))
    setFavorites((currentFavorites) => currentFavorites.filter((favoriteId) => favoriteId !== id))
  }

  const value: StudentContextType = {
    students,
    query,
    setQuery,
    sort,
    setSort,
    favorites,
    toggleFavorite,
    filteredStudents,
    addStudent,
    removeStudent,
  }

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

function useTheme() {
  return useContext(ThemeContext)
}

function useStudents() {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('StudentContext must be used inside StudentProvider')
  }
  return context
}

function SearchBar() {
  const { query, setQuery } = useStudents()

  return (
    <label className="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Search students by name or course..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </label>
  )
}

function SortControls() {
  const { sort, setSort } = useStudents()

  return (
    <div className="sort-controls">
      <span>Sort by</span>
      <button className={sort === 'default' ? 'active' : ''} onClick={() => setSort('default')} type="button">
        Default
      </button>
      <button className={sort === 'name' ? 'active' : ''} onClick={() => setSort('name')} type="button">
        Name A-Z
      </button>
      <button className={sort === 'gpa' ? 'active' : ''} onClick={() => setSort('gpa')} type="button">
        GPA
      </button>
    </div>
  )
}

function StudentCard({ student }: { student: Student }) {
  const { favorites, toggleFavorite, removeStudent } = useStudents()
  const isFavorite = favorites.includes(student.id)

  return (
    <article className="student-card">
      <div className="card-topline">
        <div className="avatar" style={{ backgroundColor: student.color }}>
          {student.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div className="card-actions">
          <button
            className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
            onClick={() => toggleFavorite(student.id)}
            type="button"
            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${student.name} ${isFavorite ? 'from' : 'to'} favorites`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <button
            className="remove-button"
            onClick={() => removeStudent(student.id)}
            type="button"
            aria-label={`Remove ${student.name}`}
          >
            Remove
          </button>
        </div>
      </div>

      <h2>{student.name}</h2>
      <p className="course">{student.course}</p>

      <div className="student-details">
        <span>
          <strong>{student.gpa.toFixed(1)}</strong> current GPA
        </span>
        <span>
          {student.year} <span className="detail-separator">•</span> {student.email}
        </span>
      </div>
    </article>
  )
}

function AddStudentForm() {
  const { addStudent } = useStudents()
  const [form, setForm] = useState<NewStudentForm>({ name: '', id: '', course: '', gpa: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!form.id.trim()) {
      nextErrors.id = 'Student ID is required.'
    } else if (!/^\d+$/.test(form.id.trim())) {
      nextErrors.id = 'Student ID must be numeric.'
    }

    if (!form.course.trim()) {
      nextErrors.course = 'Major is required.'
    }

    if (!form.gpa.trim()) {
      nextErrors.gpa = 'GPA is required.'
    } else {
      const gpaValue = Number(form.gpa)
      if (Number.isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
        nextErrors.gpa = 'GPA must be between 0.0 and 4.0.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    addStudent(form)
    setForm({ name: '', id: '', course: '', gpa: '' })
    setErrors({})
    setSuccessMessage('Student added successfully!')

    window.setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <section className="form-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Add new student</p>
          <h2>Student registration</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="student-form">
        <div className="field-group">
          <label htmlFor="student-name">Full Name</label>
          <input
            id="student-name"
            type="text"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Enter full name"
          />
          {errors.name && <small className="error-message">{errors.name}</small>}
        </div>

        <div className="field-group">
          <label htmlFor="student-id">Student ID</label>
          <input
            id="student-id"
            type="text"
            value={form.id}
            onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
            placeholder="101"
          />
          {errors.id && <small className="error-message">{errors.id}</small>}
        </div>

        <div className="field-group">
          <label htmlFor="student-major">Major</label>
          <input
            id="student-major"
            type="text"
            value={form.course}
            onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))}
            placeholder="Computer Science"
          />
          {errors.course && <small className="error-message">{errors.course}</small>}
        </div>

        <div className="field-group">
          <label htmlFor="student-gpa">GPA</label>
          <input
            id="student-gpa"
            type="number"
            step="0.1"
            min="0"
            max="4"
            value={form.gpa}
            onChange={(event) => setForm((current) => ({ ...current, gpa: event.target.value }))}
            placeholder="3.8"
          />
          {errors.gpa && <small className="error-message">{errors.gpa}</small>}
        </div>

        <button className="submit-button" type="submit">
          Add Student
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </section>
  )
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const { favorites, filteredStudents } = useStudents()

  return (
    <main className={`dashboard ${theme}`}>
      <header className="dashboard-header">
        <div className="header-copy">
          <div className="brand-mark">SD</div>
          <div>
            <p className="eyebrow">CAMPUS DIRECTORY / LAB 03</p>
            <h1>Student Dashboard</h1>
            <p className="subtitle">Browse, filter, and manage the campus student list.</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="favorite-summary">
            <span>★</span>
            <strong>{favorites.length}</strong>
            <small>favorites</small>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </header>

      <section className="toolbar">
        <SearchBar />
        <SortControls />
      </section>

      <AddStudentForm />

      <section className="results-heading">
        <div>
          <p className="eyebrow">Directory results</p>
          <h2>All students</h2>
        </div>
        <span>{filteredStudents.length} displayed</span>
      </section>

      <section className="student-grid" aria-label="Student directory">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </section>

      {filteredStudents.length === 0 && <p className="empty-state">No students match your search.</p>}

      <footer>
        Student Directory <span>•</span> React + TypeScript
      </footer>
    </main>
  )
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <App />
      </StudentProvider>
    </ThemeProvider>
  )
}

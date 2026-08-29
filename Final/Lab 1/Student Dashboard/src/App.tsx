import './App.css'

type Course = { name: string; color: 'blue' | 'green' | 'orange' }
type Student = { name: string; avatar: string; major: string; gpa: string; courses: Course[] }

function StatBadge({ label, value }: { label: string; value: string }) {
  return <div className="stat-badge"><strong>{value}</strong><span>{label}</span></div>
}

function CourseTag({ courseName, color }: { courseName: string; color: Course['color'] }) {
  return <span className={`course-tag ${color}`}>{courseName}</span>
}

function StudentCard({ name, avatar, major, gpa, courses }: Student) {
  return (
    <article className="student-card">
      <div className="student-topline">
        <div className="avatar" aria-hidden="true">{avatar}</div>
        <div><h2>{name}</h2><p className="major">{major}</p></div>
        <span className="menu-dot" aria-label={`More options for ${name}`}>•••</span>
      </div>
      <div className="student-stats"><StatBadge label="Current GPA" value={gpa} /><StatBadge label="Courses" value={`${courses.length}`} /></div>
      <div className="courses"><span className="eyebrow">Enrolled courses</span><div className="course-list">
        {courses.map((course) => <CourseTag key={course.name} courseName={course.name} color={course.color} />)}
      </div></div>
    </article>
  )
}

function DashboardHeader() {
  return <header className="dashboard-header">
    <div className="brand-mark">SD</div>
    <div><p className="eyebrow">Student portal</p><h1>Student Dashboard</h1><p className="tagline">Keep track of your progress, courses, and campus life.</p></div>
    <div className="header-date"><span>Spring semester</span><strong>2025 / 2026</strong></div>
  </header>
}

const students: Student[] = [
  { name: 'Aarav Mehta', avatar: 'AM', major: 'Computer Science', gpa: '3.8', courses: [{ name: 'Web Technology', color: 'blue' }, { name: 'Data Structures', color: 'green' }, { name: 'UX Design', color: 'orange' }] },
  { name: 'Maya Patel', avatar: 'MP', major: 'Information Systems', gpa: '3.6', courses: [{ name: 'Web Technology', color: 'blue' }, { name: 'Database Systems', color: 'green' }, { name: 'Business Analytics', color: 'orange' }] },
  { name: 'Liam Carter', avatar: 'LC', major: 'Software Engineering', gpa: '3.9', courses: [{ name: 'Cloud Computing', color: 'blue' }, { name: 'Web Technology', color: 'green' }, { name: 'Algorithms', color: 'orange' }] },
  { name: 'Sofia Williams', avatar: 'SW', major: 'Digital Media', gpa: '3.7', courses: [{ name: 'UX Design', color: 'blue' }, { name: 'Visual Design', color: 'green' }, { name: 'Web Technology', color: 'orange' }] },
]

function App() {
  const totalCourses = students.reduce((total, student) => total + student.courses.length, 0)

  return (
    <main className="app-shell"><DashboardHeader /><section className="welcome-row"><div><p className="eyebrow">Overview</p><h2>Good morning, students.</h2><p>Here is a quick look at your academic community.</p></div><div className="overview-stats"><StatBadge label="Students" value={`${students.length}`} /><StatBadge label="Enrolments" value={`${totalCourses}`} /></div></section><section className="student-grid" aria-label="Student profiles">{students.map((student) => <StudentCard key={student.name} {...student} />)}</section><footer>Student Dashboard <span>•</span> Academic year 2025 / 2026</footer></main>
  )
}

export default App

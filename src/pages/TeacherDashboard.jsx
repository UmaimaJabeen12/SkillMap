import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TeacherDashboard() {
  const navigate = useNavigate()

  // Get all students data from localStorage
  const students = JSON.parse(localStorage.getItem('allStudents') || '[]')

  const subjectNames = ['Maths', 'Physics', 'Programming', 'DBMS', 'Networking']
  const subjectKeys = ['maths', 'physics', 'programming', 'dbms', 'networking']

  // Calculate class averages
  const classAverages = subjectKeys.map((key, i) => {
    const avg = students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + parseInt(s.marks[key] || 0), 0) / students.length)
      : 0
    return { subject: subjectNames[i], average: avg, benchmark: 75 }
  })

  // Find common weak areas
  const weakAreas = classAverages.filter(s => s.average < 75 && students.length > 0)

  return (
    <div style={{minHeight:'100vh', background:'#f0f2f5', padding:'30px'}}>
      <div style={{maxWidth:'900px', margin:'0 auto'}}>

        {/* Header */}
        <div style={{background:'linear-gradient(135deg,#11998e,#38ef7d)', borderRadius:'20px', padding:'30px', color:'white', marginBottom:'25px'}}>
          <h1>👩‍🏫 Teacher Dashboard</h1>
          <p>SkillMap Faculty Portal — Class Overview</p>
          <p style={{fontSize:'18px', marginTop:'10px'}}>Total Students Assessed: <strong>{students.length}</strong></p>
        </div>

        {/* Stats Cards */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginBottom:'25px'}}>
          <div style={{background:'white', borderRadius:'15px', padding:'20px', textAlign:'center', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:'40px', fontWeight:'bold', color:'#11998e'}}>{students.length}</div>
            <div style={{color:'#666'}}>Students Assessed</div>
          </div>
          <div style={{background:'white', borderRadius:'15px', padding:'20px', textAlign:'center', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:'40px', fontWeight:'bold', color:'#f59e0b'}}>{weakAreas.length}</div>
            <div style={{color:'#666'}}>Weak Subject Areas</div>
          </div>
          <div style={{background:'white', borderRadius:'15px', padding:'20px', textAlign:'center', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:'40px', fontWeight:'bold', color:'#667eea'}}>
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + parseInt(s.attendance || 0), 0) / students.length) : 0}%
            </div>
            <div style={{color:'#666'}}>Avg Attendance</div>
          </div>
        </div>

        {/* Class Average Chart */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>📊 Class Average vs Benchmark</h2>
          {students.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="average" fill="#11998e" name="Class Average" radius={[5,5,0,0]} />
                <Bar dataKey="benchmark" fill="#e2e8f0" name="Benchmark" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{color:'#999', textAlign:'center', padding:'40px'}}>No student data yet. Students need to complete assessments first.</p>
          )}
        </div>

        {/* Weak Areas Alert */}
        {weakAreas.length > 0 && (
          <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
            <h2 style={{color:'#ef4444', marginBottom:'15px'}}>⚠️ Class Weak Areas — Needs Attention</h2>
            {weakAreas.map((area, i) => (
              <div key={i} style={{background:'#fff5f5', borderLeft:'4px solid #ef4444', padding:'12px 15px', marginBottom:'10px', borderRadius:'0 8px 8px 0'}}>
                📚 <strong>{area.subject}</strong> — Class average is {area.average}% (below 75% benchmark)
              </div>
            ))}
          </div>
        )}

        {/* Student List */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>👥 Student List</h2>
          {students.length > 0 ? (
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f8f9fa'}}>
                  <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Name</th>
                  <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Roll No</th>
                  <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Attendance</th>
                  <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Avg Marks</th>
                  <th style={{padding:'12px', textAlign:'left', borderBottom:'2px solid #dee2e6'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => {
                  const avgMarks = Math.round(Object.values(student.marks).reduce((a, b) => a + parseInt(b || 0), 0) / 5)
                  const status = avgMarks >= 75 && parseInt(student.attendance) >= 75 ? '✅ Good' : '⚠️ Needs Help'
                  return (
                    <tr key={i} style={{borderBottom:'1px solid #dee2e6'}}>
                      <td style={{padding:'12px'}}>{student.name}</td>
                      <td style={{padding:'12px'}}>{student.roll}</td>
                      <td style={{padding:'12px', color: parseInt(student.attendance) >= 75 ? '#22c55e' : '#ef4444'}}>{student.attendance}%</td>
                      <td style={{padding:'12px'}}>{avgMarks}%</td>
                      <td style={{padding:'12px'}}>{status}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p style={{color:'#999', textAlign:'center', padding:'40px'}}>No students have completed assessments yet.</p>
          )}
        </div>

        <button onClick={() => { localStorage.removeItem('teacherLoggedIn'); navigate('/teacher') }}
          style={{width:'100%', padding:'15px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', cursor:'pointer', fontWeight:'bold'}}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
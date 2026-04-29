import { useNavigate } from 'react-router-dom'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function Report() {
  const navigate = useNavigate()
  const name = localStorage.getItem('studentName')
  const roll = localStorage.getItem('rollNumber')
  const marks = JSON.parse(localStorage.getItem('marks') || '{}')
  const attendance = localStorage.getItem('attendance')
  const skills = JSON.parse(localStorage.getItem('skills') || '{}')

  // Save student data for teacher
  useEffect(() => {
    const existingStudents = JSON.parse(localStorage.getItem('allStudents') || '[]')
    const studentData = { name, roll, marks, attendance, skills }
    const alreadyExists = existingStudents.find(s => s.roll === roll)
    if (!alreadyExists) {
      existingStudents.push(studentData)
      localStorage.setItem('allStudents', JSON.stringify(existingStudents))
    } else {
      const updated = existingStudents.map(s => s.roll === roll ? studentData : s)
      localStorage.setItem('allStudents', JSON.stringify(updated))
    }
  }, [])

  const subjectData = [
    { subject: 'Maths', score: parseInt(marks.maths || 0), benchmark: 75 },
    { subject: 'Physics', score: parseInt(marks.physics || 0), benchmark: 75 },
    { subject: 'Programming', score: parseInt(marks.programming || 0), benchmark: 75 },
    { subject: 'DBMS', score: parseInt(marks.dbms || 0), benchmark: 75 },
    { subject: 'Networking', score: parseInt(marks.networking || 0), benchmark: 75 },
  ]

  const skillData = [
    { skill: 'Problem Solving', value: (skills.problemSolving || 0) * 20 },
    { skill: 'Communication', value: (skills.communication || 0) * 20 },
    { skill: 'Teamwork', value: (skills.teamwork || 0) * 20 },
    { skill: 'Coding', value: (skills.coding || 0) * 20 },
    { skill: 'Analysis', value: (skills.analysis || 0) * 20 },
  ]

  const weakSubjects = subjectData.filter(s => s.score < 75)
  const weakSkills = skillData.filter(s => s.value < 60)
  const attendanceLow = parseInt(attendance) < 75

  const recommendations = []
  if (weakSubjects.length > 0) {
    weakSubjects.forEach(s => {
      recommendations.push(`📚 Focus more on ${s.subject} — your score (${s.score}) is below the 75% benchmark`)
    })
  }
  if (weakSkills.length > 0) {
    weakSkills.forEach(s => {
      recommendations.push(`💡 Improve your ${s.skill} skills through practice and projects`)
    })
  }
  if (attendanceLow) {
    recommendations.push(`📅 Your attendance (${attendance}%) is below 75% — try to attend more classes`)
  }
  if (recommendations.length === 0) {
    recommendations.push('🌟 Excellent! You are performing well in all areas. Keep it up!')
  }

  const overallScore = Math.round(
    (subjectData.reduce((a, b) => a + b.score, 0) / 5 +
    skillData.reduce((a, b) => a + b.value, 0) / 5 +
    parseInt(attendance || 0)) / 3
  )

  const getGrade = (score) => {
    if (score >= 85) return { grade: 'A', color: '#22c55e', label: 'Excellent' }
    if (score >= 70) return { grade: 'B', color: '#3b82f6', label: 'Good' }
    if (score >= 55) return { grade: 'C', color: '#f59e0b', label: 'Average' }
    return { grade: 'D', color: '#ef4444', label: 'Needs Improvement' }
  }

  const { grade, color, label } = getGrade(overallScore)
  const downloadPDF = () => {
  const input = document.getElementById('report-content')
  html2canvas(input, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`SkillMap_Report_${name}.pdf`)
  })
}

  return (
    <div style={{minHeight:'100vh', background:'#f0f2f5', padding:'30px'}}>
      <div id="report-content" style={{maxWidth:'800px', margin:'0 auto'}}>

        {/* Header */}
        <div style={{background:'linear-gradient(135deg,#667eea,#764ba2)', borderRadius:'20px', padding:'30px', color:'white', marginBottom:'25px', textAlign:'center'}}>
          <h1>📊 Skill Gap Analysis Report</h1>
          <p style={{fontSize:'18px'}}>Student: <strong>{name}</strong></p>
          <p>Roll Number: {roll}</p>
          <div style={{background:'rgba(255,255,255,0.2)', borderRadius:'15px', padding:'20px', marginTop:'15px'}}>
            <div style={{fontSize:'60px', fontWeight:'bold', color:'white'}}>{grade}</div>
            <div style={{fontSize:'24px'}}>{label}</div>
            <div style={{fontSize:'16px', marginTop:'5px'}}>Overall Score: {overallScore}%</div>
          </div>
        </div>

        {/* Subject Marks Chart */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>📚 Subject Performance vs Benchmark</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#667eea" name="Your Score" radius={[5,5,0,0]} />
              <Bar dataKey="benchmark" fill="#e2e8f0" name="Benchmark" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Radar Chart */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>⭐ Skill Competency Radar</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <Radar name="Skills" dataKey="value" stroke="#764ba2" fill="#764ba2" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'15px'}}>📅 Attendance</h2>
          <div style={{background:'#f0f2f5', borderRadius:'10px', height:'30px', overflow:'hidden'}}>
            <div style={{
              width:`${attendance}%`, height:'100%',
              background: parseInt(attendance) >= 75 ? '#22c55e' : '#ef4444',
              borderRadius:'10px', display:'flex', alignItems:'center',
              paddingLeft:'10px', color:'white', fontWeight:'bold'
            }}>
              {attendance}%
            </div>
          </div>
          <p style={{color: parseInt(attendance) >= 75 ? '#22c55e' : '#ef4444', marginTop:'10px', fontWeight:'bold'}}>
            {parseInt(attendance) >= 75 ? '✅ Good attendance!' : '⚠️ Attendance below 75% — needs improvement!'}
          </p>
        </div>

        {/* Peer Comparison */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>👥 Peer Comparison</h2>
          {(() => {
            const allStudents = JSON.parse(localStorage.getItem('allStudents') || '[]')
            if (allStudents.length <= 1) {
              return <p style={{color:'#999', textAlign:'center', padding:'20px'}}>Peer comparison available once more students complete assessments!</p>
            }
            const peerData = subjectData.map(s => {
              const classAvg = Math.round(allStudents.reduce((sum, st) => sum + parseInt(st.marks[s.subject.toLowerCase()] || 0), 0) / allStudents.length)
              return { subject: s.subject, yourScore: s.score, classAverage: classAvg }
            })
            return (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="yourScore" fill="#667eea" name="Your Score" radius={[5,5,0,0]} />
                  <Bar dataKey="classAverage" fill="#38ef7d" name="Class Average" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          })()}
        </div>

        {/* Recommendations */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'15px'}}>💡 AI Recommendations</h2>
          {recommendations.map((rec, i) => (
            <div key={i} style={{background:'#f8f4ff', borderLeft:'4px solid #764ba2', padding:'12px 15px', marginBottom:'10px', borderRadius:'0 8px 8px 0'}}>
              {rec}
            </div>
          ))}
        </div>

       {/* Buttons */}
<div style={{display:'flex', gap:'15px'}}>
  <button onClick={() => navigate('/input')}
    style={{flex:1, padding:'15px', background:'#667eea', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', cursor:'pointer', fontWeight:'bold'}}>
    ← Retake Assessment
  </button>
  <button onClick={() => navigate('/dashboard')}
    style={{flex:1, padding:'15px', background:'#764ba2', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', cursor:'pointer', fontWeight:'bold'}}>
    🏠 Dashboard
  </button>
  <button onClick={downloadPDF}
    style={{flex:1, padding:'15px', background:'#22c55e', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', cursor:'pointer', fontWeight:'bold'}}>
    📥 Download PDF
  </button>
</div>
</div>
    </div>
  )
}
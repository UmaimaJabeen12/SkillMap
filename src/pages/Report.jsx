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

{/* Badges */}
<div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
  <h2 style={{color:'#333', marginBottom:'20px'}}>🏆 Your Achievements</h2>
  <div style={{display:'flex', flexWrap:'wrap', gap:'15px'}}>
    
    {overallScore >= 85 && (
      <div style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>🏆</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Top Performer</div>
      </div>
    )}

    {parseInt(attendance) >= 90 && (
      <div style={{background:'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>📅</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Perfect Attendance</div>
      </div>
    )}

    {skills.coding >= 4 && (
      <div style={{background:'linear-gradient(135deg,#667eea,#764ba2)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>💻</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Coding Star</div>
      </div>
    )}

    {skills.problemSolving >= 4 && (
      <div style={{background:'linear-gradient(135deg,#11998e,#38ef7d)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>🧠</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Problem Solver</div>
      </div>
    )}

    {skills.teamwork >= 4 && (
      <div style={{background:'linear-gradient(135deg,#f093fb,#f5576c)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>🤝</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Team Player</div>
      </div>
    )}

    {parseInt(marks.programming) >= 85 && (
      <div style={{background:'linear-gradient(135deg,#4facfe,#00f2fe)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>🚀</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Dev Rockstar</div>
      </div>
    )}

    {weakSubjects.length === 0 && (
      <div style={{background:'linear-gradient(135deg,#43e97b,#38f9d7)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>⭐</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>All Rounder</div>
      </div>
    )}

    {skills.communication >= 4 && (
      <div style={{background:'linear-gradient(135deg,#fa709a,#fee140)', borderRadius:'15px', padding:'15px 20px', color:'white', textAlign:'center', minWidth:'120px'}}>
        <div style={{fontSize:'30px'}}>🗣️</div>
        <div style={{fontWeight:'bold', fontSize:'13px'}}>Communicator</div>
      </div>
    )}

  </div>
  {overallScore < 55 && weakSubjects.length > 2 && (
    <div style={{marginTop:'15px', padding:'12px', background:'#fff5f5', borderRadius:'10px', color:'#ef4444'}}>
      💪 Keep working hard — badges are waiting for you! Every expert was once a beginner!
    </div>
  )}
</div>

{/* Course Recommendations */}
<div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
  <h2 style={{color:'#333', marginBottom:'20px'}}>📚 Course Recommendations</h2>
  {weakSubjects.map((s, i) => (
    <div key={i} style={{marginBottom:'20px', padding:'15px', background:'#f8f9fa', borderRadius:'10px'}}>
      <h3 style={{color:'#667eea', marginBottom:'10px'}}>📖 {s.subject} Resources</h3>
      {s.subject === 'Maths' && (
        <div>
          <a href="https://www.khanacademy.org/math" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 Khan Academy — Engineering Maths</a>
          <a href="https://www.youtube.com/results?search_query=engineering+mathematics+lectures" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 YouTube — Engineering Mathematics Lectures</a>
          <a href="https://nptel.ac.in/courses/111/105/111105035/" target="_blank" style={{display:'block', color:'#764ba2', textDecoration:'none'}}>📘 NPTEL — Mathematics Course</a>
        </div>
      )}
      {s.subject === 'Physics' && (
        <div>
          <a href="https://www.khanacademy.org/science/physics" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 Khan Academy — Physics</a>
          <a href="https://www.youtube.com/results?search_query=engineering+physics+lectures" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 YouTube — Engineering Physics</a>
          <a href="https://nptel.ac.in/courses/115/106/115106098/" target="_blank" style={{display:'block', color:'#764ba2', textDecoration:'none'}}>📘 NPTEL — Physics Course</a>
        </div>
      )}
      {s.subject === 'Programming' && (
        <div>
          <a href="https://www.w3schools.com/c/" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 W3Schools — C Programming</a>
          <a href="https://www.youtube.com/results?search_query=c+programming+for+beginners" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 YouTube — C Programming Tutorials</a>
          <a href="https://www.hackerrank.com/domains/c" target="_blank" style={{display:'block', color:'#764ba2', textDecoration:'none'}}>💻 HackerRank — Practice Problems</a>
        </div>
      )}
      {s.subject === 'DBMS' && (
        <div>
          <a href="https://www.geeksforgeeks.org/dbms/" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>📘 GeeksForGeeks — DBMS Complete Guide</a>
          <a href="https://www.youtube.com/results?search_query=dbms+lectures+for+beginners" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 YouTube — DBMS Lectures</a>
          <a href="https://nptel.ac.in/courses/106/105/106105175/" target="_blank" style={{display:'block', color:'#764ba2', textDecoration:'none'}}>📘 NPTEL — Database Management</a>
        </div>
      )}
      {s.subject === 'Networking' && (
        <div>
          <a href="https://www.geeksforgeeks.org/computer-network-tutorials/" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>📘 GeeksForGeeks — Computer Networks</a>
          <a href="https://www.youtube.com/results?search_query=computer+networks+lectures" target="_blank" style={{display:'block', color:'#764ba2', marginBottom:'8px', textDecoration:'none'}}>🎥 YouTube — Networking Lectures</a>
          <a href="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/entry/ccna.html" target="_blank" style={{display:'block', color:'#764ba2', textDecoration:'none'}}>🏆 Cisco CCNA — Networking Certification</a>
        </div>
      )}
    </div>
  ))}
  {weakSubjects.length === 0 && (
    <p style={{color:'#22c55e', fontWeight:'bold'}}>🌟 Great job! No weak subjects. Keep maintaining your performance!</p>
  )}
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

{/* Study Plan */}
<div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
  <h2 style={{color:'#333', marginBottom:'20px'}}>🎯 Personalized Study Plan</h2>
  <p style={{color:'#666', marginBottom:'15px'}}>Based on your performance, here is your recommended daily study plan:</p>
  
  {weakSubjects.map((s, i) => (
    <div key={i} style={{display:'flex', alignItems:'center', padding:'12px 15px', marginBottom:'10px', background:'#f0f4ff', borderRadius:'10px', borderLeft:'4px solid #667eea'}}>
      <span style={{fontSize:'24px', marginRight:'15px'}}>
        {s.subject === 'Maths' ? '📐' : s.subject === 'Physics' ? '⚡' : s.subject === 'Programming' ? '💻' : s.subject === 'DBMS' ? '🗄️' : '🌐'}
      </span>
      <div>
        <div style={{fontWeight:'bold', color:'#333'}}>{s.subject}</div>
        <div style={{color:'#666', fontSize:'14px'}}>
          Study {s.score < 50 ? '2 hours' : '1 hour'} daily — 
          {s.subject === 'Programming' ? ' Practice coding problems on HackerRank' :
           s.subject === 'Maths' ? ' Solve 10 problems from previous papers' :
           s.subject === 'DBMS' ? ' Revise normalization and SQL queries' :
           s.subject === 'Physics' ? ' Review formulas and solve numericals' :
           ' Study network protocols and OSI model'}
        </div>
      </div>
    </div>
  ))}

  {weakSkills.map((s, i) => (
    <div key={i} style={{display:'flex', alignItems:'center', padding:'12px 15px', marginBottom:'10px', background:'#f5f0ff', borderRadius:'10px', borderLeft:'4px solid #764ba2'}}>
      <span style={{fontSize:'24px', marginRight:'15px'}}>⭐</span>
      <div>
        <div style={{fontWeight:'bold', color:'#333'}}>{s.skill} Skills</div>
        <div style={{color:'#666', fontSize:'14px'}}>
          {s.skill === 'Problem Solving' ? 'Solve 3 logical puzzles daily on LeetCode' :
           s.skill === 'Communication' ? 'Practice speaking for 20 minutes daily' :
           s.skill === 'Teamwork' ? 'Participate in group projects and discussions' :
           s.skill === 'Coding' ? 'Code for at least 1 hour daily on any platform' :
           'Analyze 1 case study or dataset daily'}
        </div>
      </div>
    </div>
  ))}

  {attendanceLow && (
    <div style={{display:'flex', alignItems:'center', padding:'12px 15px', marginBottom:'10px', background:'#fff5f5', borderRadius:'10px', borderLeft:'4px solid #ef4444'}}>
      <span style={{fontSize:'24px', marginRight:'15px'}}>📅</span>
      <div>
        <div style={{fontWeight:'bold', color:'#333'}}>Attendance</div>
        <div style={{color:'#666', fontSize:'14px'}}>Attend ALL classes this week — missing even one more could be critical!</div>
      </div>
    </div>
  )}

  {weakSubjects.length === 0 && weakSkills.length === 0 && !attendanceLow && (
    <div style={{padding:'20px', textAlign:'center', color:'#22c55e', fontWeight:'bold'}}>
      🌟 You are on track! Maintain your current study schedule and keep improving!
    </div>
  )}

  <div style={{marginTop:'20px', padding:'15px', background:'#fffbeb', borderRadius:'10px', borderLeft:'4px solid #f59e0b'}}>
    <strong>⏰ Daily Schedule Tip:</strong>
    <p style={{color:'#666', margin:'5px 0 0 0', fontSize:'14px'}}>
      Morning: Revise weak subjects (2 hrs) → Afternoon: Practice problems (1 hr) → Evening: Watch video lectures (1 hr)
    </p>
  </div>
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
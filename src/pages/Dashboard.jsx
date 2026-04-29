import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('studentName')
  const roll = localStorage.getItem('rollNumber')
  const [alerts, setAlerts] = useState([])
  const [showAlerts, setShowAlerts] = useState(true)

  useEffect(() => {
    const marks = JSON.parse(localStorage.getItem('marks') || '{}')
    const attendance = localStorage.getItem('attendance')
    const skills = JSON.parse(localStorage.getItem('skills') || '{}')
    const newAlerts = []

    if (!attendance || Object.keys(marks).length === 0) {
      setAlerts([])
      return
    }

    if (parseInt(attendance) < 75) {
      newAlerts.push({ type: 'danger', message: '🚨 Your attendance is below 75%! You may be detained!' })
    }
    if (parseInt(attendance) >= 75 && parseInt(attendance) < 85) {
      newAlerts.push({ type: 'warning', message: '⚠️ Your attendance is dropping! Try to attend more classes.' })
    }
    if (marks.maths && parseInt(marks.maths) < 50) {
      newAlerts.push({ type: 'danger', message: '🚨 Critical: Your Maths score is very low! Immediate attention needed.' })
    }
    if (marks.programming && parseInt(marks.programming) < 50) {
      newAlerts.push({ type: 'danger', message: '🚨 Critical: Your Programming score needs urgent improvement!' })
    }
    if (marks.dbms && parseInt(marks.dbms) < 50) {
      newAlerts.push({ type: 'danger', message: '🚨 Critical: Your DBMS score is very low!' })
    }
    if (skills.coding && parseInt(skills.coding) < 3) {
      newAlerts.push({ type: 'warning', message: '⚠️ Your coding skills need improvement. Practice daily!' })
    }
    if (skills.problemSolving && parseInt(skills.problemSolving) < 3) {
      newAlerts.push({ type: 'warning', message: '⚠️ Work on your Problem Solving skills — very important for placements!' })
    }
    if (newAlerts.length === 0) {
      newAlerts.push({ type: 'success', message: '🌟 Great job! You are performing well. Keep it up!' })
    }
    setAlerts(newAlerts)
  }, [])

  return (
    <div style={{minHeight:'100vh', background:'#f0f2f5', padding:'30px'}}>
      <div style={{maxWidth:'800px', margin:'0 auto'}}>

        {/* Header */}
        <div style={{background:'linear-gradient(135deg,#667eea,#764ba2)', borderRadius:'20px', padding:'30px', color:'white', marginBottom:'25px'}}>
          <h1>🎓 SkillMap Dashboard</h1>
          <p>Welcome back, <strong>{name}</strong>!</p>
          <p>Roll Number: {roll}</p>
        </div>

        {/* Alerts Section */}
        {showAlerts && alerts.length > 0 && (
          <div style={{marginBottom:'25px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
              <h2 style={{color:'#333', margin:0}}>🔔 Alerts & Notifications</h2>
              <button onClick={() => setShowAlerts(false)}
                style={{background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:'18px'}}>✕</button>
            </div>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                padding:'15px 20px',
                marginBottom:'10px',
                borderRadius:'10px',
                borderLeft:'5px solid',
                borderColor: alert.type === 'danger' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#22c55e',
                background: alert.type === 'danger' ? '#fff5f5' : alert.type === 'warning' ? '#fffbeb' : '#f0fdf4',
                color: alert.type === 'danger' ? '#dc2626' : alert.type === 'warning' ? '#d97706' : '#16a34a',
                fontWeight:'500'
              }}>
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* Action Cards */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'25px'}}>
          <div style={{background:'white', borderRadius:'15px', padding:'25px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
            <h2 style={{color:'#667eea'}}>📝 Enter Skills</h2>
            <p style={{color:'#666'}}>Input your marks, attendance and skill ratings for AI analysis</p>
            <button onClick={() => navigate('/input')}
              style={{marginTop:'15px', padding:'10px 20px', background:'#667eea', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
              Start Assessment →
            </button>
          </div>

          <div style={{background:'white', borderRadius:'15px', padding:'25px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
            <h2 style={{color:'#764ba2'}}>📊 View Report</h2>
            <p style={{color:'#666'}}>See your skill gap analysis and personalized recommendations</p>
            <button onClick={() => navigate('/report')}
              style={{marginTop:'15px', padding:'10px 20px', background:'#764ba2', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
              View Report →
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333'}}>ℹ️ About SkillMap</h2>
          <p style={{color:'#666', lineHeight:'1.8'}}>
            SkillMap is an AI-powered academic skill gap analysis system that evaluates your
            performance across subjects, identifies weak areas, and provides personalized
            recommendations to bridge the gap between academic knowledge and industry expectations.
          </p>
        </div>

      </div>
    </div>
  )
}
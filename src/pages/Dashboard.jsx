import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('studentName')
  const roll = localStorage.getItem('rollNumber')

  return (
    <div style={{minHeight:'100vh', background:'#f0f2f5', padding:'30px'}}>
      <div style={{maxWidth:'800px', margin:'0 auto'}}>
        <div style={{background:'linear-gradient(135deg,#667eea,#764ba2)', borderRadius:'20px', padding:'30px', color:'white', marginBottom:'25px'}}>
          <h1>🎓 SkillMap Dashboard</h1>
          <p>Welcome, <strong>{name}</strong>!</p>
          <p>Roll Number: {roll}</p>
        </div>

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
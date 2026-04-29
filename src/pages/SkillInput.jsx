import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SkillInput() {
  const navigate = useNavigate()
  const [marks, setMarks] = useState({
    maths: '', physics: '', programming: '', dbms: '', networking: ''
  })
  const [attendance, setAttendance] = useState('')
  const [skills, setSkills] = useState({
    problemSolving: 3, communication: 3, teamwork: 3, coding: 3, analysis: 3
  })

  const handleSubmit = () => {
    if (!attendance || Object.values(marks).some(m => m === '')) {
      alert('Please fill in all fields!')
      return
    }
    localStorage.setItem('marks', JSON.stringify(marks))
    localStorage.setItem('attendance', attendance)
    localStorage.setItem('skills', JSON.stringify(skills))
    navigate('/report')
  }

  const subjectLabels = {
    maths: '📐 Mathematics', physics: '⚡ Physics',
    programming: '💻 Programming', dbms: '🗄️ DBMS', networking: '🌐 Networking'
  }

  const skillLabels = {
    problemSolving: '🧠 Problem Solving', communication: '🗣️ Communication',
    teamwork: '🤝 Teamwork', coding: '💻 Coding', analysis: '📊 Analysis'
  }

  return (
    <div style={{minHeight:'100vh', background:'#f0f2f5', padding:'30px'}}>
      <div style={{maxWidth:'700px', margin:'0 auto'}}>
        <h1 style={{color:'#667eea', textAlign:'center', marginBottom:'30px'}}>📝 Skill Assessment</h1>

        {/* Marks Section */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>📚 Subject Marks (out of 100)</h2>
          {Object.keys(marks).map(subject => (
            <div key={subject} style={{marginBottom:'15px'}}>
              <label style={{display:'block', marginBottom:'5px', color:'#555', fontWeight:'bold'}}>
                {subjectLabels[subject]}
              </label>
              <input
                type="number" min="0" max="100"
                placeholder="Enter marks (0-100)"
                value={marks[subject]}
                onChange={e => setMarks({...marks, [subject]: e.target.value})}
                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}
              />
            </div>
          ))}
        </div>

        {/* Attendance Section */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>📅 Attendance Percentage</h2>
          <input
            type="number" min="0" max="100"
            placeholder="Enter attendance % (0-100)"
            value={attendance}
            onChange={e => setAttendance(e.target.value)}
            style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}
          />
        </div>

        {/* Skills Rating Section */}
        <div style={{background:'white', borderRadius:'15px', padding:'25px', marginBottom:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>⭐ Self Skill Rating (1-5)</h2>
          {Object.keys(skills).map(skill => (
            <div key={skill} style={{marginBottom:'15px'}}>
              <label style={{display:'block', marginBottom:'5px', color:'#555', fontWeight:'bold'}}>
                {skillLabels[skill]}: <span style={{color:'#667eea'}}>{skills[skill]}/5</span>
              </label>
              <input
                type="range" min="1" max="5"
                value={skills[skill]}
                onChange={e => setSkills({...skills, [skill]: parseInt(e.target.value)})}
                style={{width:'100%'}}
              />
            </div>
          ))}
        </div>

        <button onClick={handleSubmit}
          style={{width:'100%', padding:'15px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', border:'none', borderRadius:'10px', fontSize:'18px', cursor:'pointer', fontWeight:'bold'}}>
          🔍 Analyze My Skills →
        </button>
      </div>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')

  const handleLogin = () => {
    if (name && roll) {
      localStorage.setItem('studentName', name)
      localStorage.setItem('rollNumber', roll)
      navigate('/dashboard')
    } else {
      alert('Please enter your name and roll number!')
    }
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', width:'350px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <h1 style={{color:'#667eea', marginBottom:'8px'}}>🎓 SkillMap</h1>
        <p style={{color:'#666', marginBottom:'30px'}}>AI-Based Skill Gap Analysis</p>
        <input
          placeholder="Enter your full name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}
        />
        <input
          placeholder="Enter your roll number"
          value={roll}
          onChange={e => setRoll(e.target.value)}
          style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}
        />
        <button
          onClick={handleLogin}
          style={{width:'100%', padding:'12px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', fontWeight:'bold'}}>
          Login →
        </button>
        <button
  onClick={() => navigate('/teacher')}
  style={{width:'100%', padding:'12px', background:'linear-gradient(135deg,#11998e,#38ef7d)', color:'white', border:'none', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontWeight:'bold', marginTop:'10px'}}>
  👩‍🏫 Teacher Login
</button>
      </div>
    </div>
  )
}
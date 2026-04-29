import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TeacherLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (username === 'teacher' && password === 'skillmap123') {
      localStorage.setItem('teacherLoggedIn', 'true')
      navigate('/teacher-dashboard')
    } else {
      setError('Invalid username or password!')
    }
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg,#11998e,#38ef7d)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', width:'350px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <h1 style={{color:'#11998e', marginBottom:'8px'}}>👩‍🏫 Teacher Login</h1>
        <p style={{color:'#666', marginBottom:'30px'}}>SkillMap Faculty Portal</p>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{width:'100%', padding:'12px', marginBottom:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}
        />

        {error && <p style={{color:'red', marginBottom:'10px', fontSize:'13px'}}>{error}</p>}

        <button
          onClick={handleLogin}
          style={{width:'100%', padding:'12px', background:'linear-gradient(135deg,#11998e,#38ef7d)', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', fontWeight:'bold', marginBottom:'15px'}}>
          Login →
        </button>

        <p style={{color:'#999', fontSize:'12px'}}>
          Username: <strong>teacher</strong> | Password: <strong>skillmap123</strong>
        </p>

        <button
          onClick={() => navigate('/')}
          style={{marginTop:'10px', background:'none', border:'none', color:'#11998e', cursor:'pointer', fontSize:'14px'}}>
          ← Back to Student Login
        </button>
      </div>
    </div>
  )
}
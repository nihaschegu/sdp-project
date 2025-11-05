import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { load, DB_USERS_KEY, findUserByEmail, seedIfEmpty } from '../helpers';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('patient');
  const navigate = useNavigate();

  useEffect(()=>{ seedIfEmpty(); },[]);

  function handleLogin(e){
    e.preventDefault();
    const users = load(DB_USERS_KEY);
    const user = users.find(u=>u.email===email && u.password===password && u.role===role);
    if(!user){ alert('Invalid credentials for selected role'); return; }
    sessionStorage.setItem('medf_current', JSON.stringify(user));
    navigate('/dashboard');
  }

  return (
    <div className="card form">
      <h3 className="center">Sign in</h3>
      <form onSubmit={handleLogin} className="grid">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
        <button className="btn" type="submit">Login</button>
        <div className="center small">Don't have an account? <Link to="/register" className="link">Register</Link></div>
      </form>
    </div>
  );
}

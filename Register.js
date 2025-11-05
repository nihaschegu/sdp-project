import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { load, save, DB_USERS_KEY, uid } from '../helpers';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('patient');
  const navigate = useNavigate();

  function handleRegister(e){
    e.preventDefault();
    if(!name||!email||!password){ alert('Please fill all fields'); return; }
    const users = load(DB_USERS_KEY);
    if(users.find(u=>u.email===email)){ alert('User exists with this email'); return; }
    users.push({id:uid(), name, email, password, role});
    save(DB_USERS_KEY, users);
    alert('Registered. Please login.');
    navigate('/login');
  }

  return (
    <div className="card form">
      <h3 className="center">Create account</h3>
      <form onSubmit={handleRegister} className="grid">
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
        <button className="btn" type="submit">Register</button>
        <div className="center small">Already have an account? <Link to="/login" className="link">Sign in</Link></div>
      </form>
    </div>
  );
}

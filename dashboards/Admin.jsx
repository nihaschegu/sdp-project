import React, { useState, useEffect } from 'react';
import { load, save, DB_USERS_KEY, DB_APPTS_KEY } from '../../helpers';

export default function AdminDashboard(){
  const [users,setUsers]=useState([]);
  const [appts,setAppts]=useState([]);

  useEffect(()=>{ fetchData(); },[]);

  function fetchData(){ setUsers(load(DB_USERS_KEY)); setAppts(load(DB_APPTS_KEY)); }

  function delUser(id){
    if(!confirm('Delete user?')) return;
    let us = load(DB_USERS_KEY).filter(u=>u.id!==id); save(DB_USERS_KEY, us);
    let ap = load(DB_APPTS_KEY).filter(a=>a.patientId!==id && a.doctorId!==id); save(DB_APPTS_KEY, ap);
    fetchData();
  }

  function delAppt(id){
    if(!confirm('Delete appointment?')) return;
    let ap = load(DB_APPTS_KEY).filter(a=>a.id!==id); save(DB_APPTS_KEY, ap); fetchData();
  }

  return (
    <div className="card">
      <h3>Admin</h3>
      <h4>Users</h4>
      <table style={{width:'100%'}}><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead><tbody>
        {users.map(u=> <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td><button className="btn" onClick={()=>delUser(u.id)}>Delete</button></td></tr>)}
      </tbody></table>

      <h4 style={{marginTop:12}}>Appointments</h4>
      <table style={{width:'100%'}}><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {appts.map(a=>{ const p = load(DB_USERS_KEY).find(u=>u.id===a.patientId); const d = load(DB_USERS_KEY).find(u=>u.id===a.doctorId); return <tr key={a.id}><td>{p?p.name:'(deleted)'}</td><td>{d?d.name:'(deleted)'}</td><td>{new Date(a.datetime).toLocaleString()}</td><td>{a.status}</td><td><button className="btn" onClick={()=>delAppt(a.id)}>Delete</button></td></tr> })}
      </tbody></table>
    </div>
  );
}

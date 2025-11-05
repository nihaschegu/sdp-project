import React, { useEffect, useState } from 'react';
import { load, save, DB_USERS_KEY, DB_APPTS_KEY, uid } from '../../helpers';

export default function PatientDashboard({user}){
  const [doctors,setDoctors]=useState([]);
  const [appt,setAppt]=useState({doctorId:'', datetime:'', reason:''});
  const [appts,setAppts]=useState([]);

  useEffect(()=>{ const docs = load(DB_USERS_KEY).filter(u=>u.role==='doctor'); setDoctors(docs); fetchAppts(); },[]);

  function fetchAppts(){ const all = load(DB_APPTS_KEY).filter(a=>a.patientId===user.id); setAppts(all); }

  function book(){
    if(!appt.doctorId||!appt.datetime||!appt.reason){ alert('Fill fields'); return; }
    if(!confirm('Simulate payment of ₹500?')) return;
    const arr = load(DB_APPTS_KEY);
    const a = {id:uid(), patientId:user.id, doctorId:appt.doctorId, datetime:appt.datetime, reason:appt.reason, status:'pending', paid:true, createdAt:Date.now()};
    arr.push(a); save(DB_APPTS_KEY, arr); alert('Booked'); setAppt({doctorId:'',datetime:'',reason:''}); fetchAppts();
  }

  return (
    <div className="card">
      <h3>Patient — {user.name}</h3>
      <div className="row">
        <div style={{flex:1}}>
          <h4>Book Appointment</h4>
          <select className="input" value={appt.doctorId} onChange={e=>setAppt({...appt, doctorId:e.target.value})}>
            <option value="">Choose doctor</option>
            {doctors.map(d=> <option key={d.id} value={d.id}>{d.name} ({d.email})</option>)}
          </select>
          <input className="input" type="datetime-local" value={appt.datetime} onChange={e=>setAppt({...appt, datetime:e.target.value})} />
          <textarea className="input" rows="3" placeholder="Reason" value={appt.reason} onChange={e=>setAppt({...appt, reason:e.target.value})} />
          <button className="btn" onClick={book}>Pay & Book</button>
        </div>
        <div style={{flex:1}}>
          <h4>My Appointments</h4>
          {appts.length===0 ? <p className="small">No appointments</p> : (
            <table style={{width:'100%'}}>
              <thead><tr><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {appts.map(a=>{
                  const d = load(DB_USERS_KEY).find(x=>x.id===a.doctorId);
                  return <tr key={a.id}><td>{d?d.name:'(deleted)'}</td><td>{new Date(a.datetime).toLocaleString()}</td><td>{a.status}</td></tr>
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { load, save, DB_APPTS_KEY, DB_USERS_KEY, uid } from '../../helpers';

export default function DoctorDashboard({user}){
  const [pending,setPending]=useState([]);
  const [history,setHistory]=useState([]);

  useEffect(()=>{ fetchLists(); },[]);

  function fetchLists(){
    const all = load(DB_APPTS_KEY);
    setPending(all.filter(a=>a.doctorId===user.id && a.status==='pending'));
    setHistory(all.filter(a=>a.doctorId===user.id && (a.status==='approved'||a.status==='completed')));
  }

  function approve(id){
    const arr = load(DB_APPTS_KEY); const a = arr.find(x=>x.id===id); if(!a) return;
    a.status='approved'; a.videoLink='https://meet.example.com/'+uid(); save(DB_APPTS_KEY, arr); fetchLists(); alert('Approved and link created');
  }

  function writePres(id){
    const text = prompt('Enter prescription text:');
    if(!text) return;
    const pres = load('medf_presc_v2'); pres.push({id:uid(), apptId:id, text, createdAt:Date.now(), dispensed:false}); localStorage.setItem('medf_presc_v2', JSON.stringify(pres));
    const arr = load(DB_APPTS_KEY); const a = arr.find(x=>x.id===id); if(a){ a.prescriptionId = pres[pres.length-1].id; save(DB_APPTS_KEY, arr); }
    fetchLists(); alert('Prescription saved');
  }

  function complete(id){
    const arr = load(DB_APPTS_KEY); const a = arr.find(x=>x.id===id); if(!a) return; a.status='completed'; save(DB_APPTS_KEY, arr); fetchLists(); alert('Marked completed');
  }

  return (
    <div className="card">
      <h3>Doctor — {user.name}</h3>
      <div className="row">
        <div style={{flex:1}}>
          <h4>Pending</h4>
          {pending.length===0 ? <p className="small">No pending</p> : pending.map(a=>{
            const p = load(DB_USERS_KEY).find(u=>u.id===a.patientId);
            return <div key={a.id} className="card" style={{marginBottom:8}}><strong>{p? p.name:'(patient)'} — {new Date(a.datetime).toLocaleString()}</strong><p className="small">{a.reason}</p><button className="btn" onClick={()=>approve(a.id)}>Approve & Send Link</button></div>
          })}
        </div>
        <div style={{flex:1}}>
          <h4>Approved / History</h4>
          {history.length===0 ? <p className="small">No history</p> : history.map(a=>{
            const p = load(DB_USERS_KEY).find(u=>u.id===a.patientId);
            return <div key={a.id} className="card" style={{marginBottom:8}}><strong>{p? p.name:'(patient)'} — {new Date(a.datetime).toLocaleString()}</strong><p className="small">{a.reason}</p><button className="btn" onClick={()=>writePres(a.id)}>Write Prescription</button><button className="btn" style={{marginLeft:8}} onClick={()=>complete(a.id)}>Mark Completed</button></div>
          })}
        </div>
      </div>
    </div>
  );
}

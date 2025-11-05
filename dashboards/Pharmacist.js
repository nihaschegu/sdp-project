import React, { useEffect, useState } from 'react';

export default function PharmacistDashboard(){
  const [prescs,setPrescs]=useState([]);

  useEffect(()=>{ const p = JSON.parse(localStorage.getItem('medf_presc_v2')||'[]'); setPrescs(p); },[]);

  function toggle(id){
    const p = JSON.parse(localStorage.getItem('medf_presc_v2')||'[]');
    const item = p.find(x=>x.id===id); if(!item) return;
    item.dispensed = !item.dispensed; localStorage.setItem('medf_presc_v2', JSON.stringify(p)); setPrescs(p);
  }

  return (
    <div className="card">
      <h3>Pharmacist</h3>
      {prescs.length===0 ? <p className="small">No prescriptions</p> : prescs.map(p=> <div key={p.id} className="card" style={{marginBottom:8}}><div><strong>Rx</strong><p className="small">{p.text}</p></div><button className="btn" onClick={()=>toggle(p.id)}>{p.dispensed? 'Dispensed':'Mark Dispensed'}</button></div>)}
    </div>
  );
}

import React from 'react';
import PatientDashboard from './dashboards/Patient.jsx';
import DoctorDashboard from './dashboards/Doctor.jsx';
import AdminDashboard from './dashboards/Admin.jsx';
import PharmacistDashboard from './dashboards/Pharmacist.jsx';

export default function Dashboard(){
  const cur = JSON.parse(sessionStorage.getItem('medf_current')||'null');
  if(!cur) return <div className="card"><p>Please login first.</p></div>;
  if(cur.role==='patient') return <PatientDashboard user={cur} />;
  if(cur.role==='doctor') return <DoctorDashboard user={cur} />;
  if(cur.role==='admin') return <AdminDashboard user={cur} />;
  if(cur.role==='pharmacist') return <PharmacistDashboard user={cur} />;
  return <div className="card">Unknown role</div>
}

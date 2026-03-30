import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyJobs, fetchMyApplications, fetchJobApplications, deleteJob, updateAppStatus } from '../utils/api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

// ─── Employer Dashboard ────────────────────────────────────────────────────────
const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadMyJobs(); }, []);

  const loadMyJobs = async () => {
    try {
      const { data } = await fetchMyJobs();
      setJobs(data);
    } catch (err) { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    try {
      const { data } = await fetchJobApplications(job._id);
      setApplications(data);
    } catch (err) { toast.error('Failed to load applicants'); }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteJob(jobId);
      toast.success('Job deleted');
      loadMyJobs();
      if (selectedJob?._id === jobId) { setSelectedJob(null); setApplications([]); }
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateAppStatus(appId, status);
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      toast.success('Status updated');
    } catch (err) { toast.error('Failed to update status'); }
  };

  const statusColor = { Pending: 'badge-yellow', Reviewed: 'badge-blue', Shortlisted: 'badge-green', Rejected: 'badge-red', Hired: 'badge-green' };

  if (loading) return <Spinner />;

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Employer Dashboard</h1>
          <p className="page-subtitle">Manage your job postings and applicants</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/post-job')}>+ Post New Job</button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card"><div className="number">{jobs.length}</div><div className="label">Jobs Posted</div></div>
        <div className="stat-card"><div className="number">{jobs.filter(j => j.isActive).length}</div><div className="label">Active</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Jobs Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
            <h3 style={{ fontWeight: 700 }}>Your Job Postings</h3>
          </div>
          {jobs.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div><h3>No jobs posted yet</h3><p>Post your first job to start hiring!</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Title</th><th>Type</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} style={{ background: selectedJob?._id === job._id ? 'var(--primary-light)' : '' }}>
                      <td style={{ fontWeight: 600 }}>{job.title}</td>
                      <td><span className="badge badge-gray">{job.jobType}</span></td>
                      <td><span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Closed'}</span></td>
                      <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }} onClick={() => handleViewApplicants(job)}>
                          👥 Applicants
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }} onClick={() => handleDelete(job._id)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Applicants Panel */}
        {selectedJob && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700 }}>Applicants — {selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            {applications.length === 0 ? (
              <div className="empty-state"><div className="icon">📭</div><h3>No applications yet</h3></div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Applicant</th><th>Status</th><th>Update</th></tr></thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{app.applicant?.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{app.applicant?.email}</div>
                        </td>
                        <td><span className={`badge ${statusColor[app.status]}`}>{app.status}</span></td>
                        <td>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            style={{ padding: '0.3rem 0.5rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'inherit', cursor: 'pointer' }}
                          >
                            {['Pending','Reviewed','Shortlisted','Rejected','Hired'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Job Seeker Dashboard ──────────────────────────────────────────────────────
const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = { Pending: 'badge-yellow', Reviewed: 'badge-blue', Shortlisted: 'badge-green', Rejected: 'badge-red', Hired: 'badge-green' };

  if (loading) return <Spinner />;

  return (
    <div className="container page">
      <h1 className="page-title">My Dashboard</h1>
      <p className="page-subtitle">Track your job applications</p>

      <div className="dashboard-grid">
        <div className="stat-card"><div className="number">{applications.length}</div><div className="label">Total Applied</div></div>
        <div className="stat-card"><div className="number">{applications.filter(a => a.status === 'Shortlisted').length}</div><div className="label">Shortlisted</div></div>
        <div className="stat-card"><div className="number">{applications.filter(a => a.status === 'Hired').length}</div><div className="label">Hired 🎉</div></div>
        <div className="stat-card"><div className="number">{applications.filter(a => a.status === 'Pending').length}</div><div className="label">Pending</div></div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700 }}>Recent Applications</h3>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/jobs')}>Browse More Jobs</button>
        </div>
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No applications yet</h3>
            <p>Browse jobs and start applying!</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/jobs')}>Browse Jobs</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Job Title</th><th>Company</th><th>Type</th><th>Status</th><th>Applied On</th></tr></thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${app.job?._id}`)}>
                    <td style={{ fontWeight: 600 }}>{app.job?.title}</td>
                    <td>{app.job?.company}</td>
                    <td><span className="badge badge-gray">{app.job?.jobType}</span></td>
                    <td><span className={`badge ${statusColor[app.status]}`}>{app.status}</span></td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Dashboard Router ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === 'employer' ? <EmployerDashboard /> : <SeekerDashboard />;
};

export default Dashboard;

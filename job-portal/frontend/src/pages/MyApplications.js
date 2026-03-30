import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyApplications } from '../utils/api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    Pending: 'badge-yellow',
    Reviewed: 'badge-blue',
    Shortlisted: 'badge-green',
    Rejected: 'badge-red',
    Hired: 'badge-green'
  };

  if (loading) return <Spinner />;

  return (
    <div className="container page">
      <h1 className="page-title">My Applications</h1>
      <p className="page-subtitle">Track all your job applications in one place</p>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here!</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => (
            <div key={app._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}
              onClick={() => navigate(`/jobs/${app.job?._id}`)}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{app.job?.title}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>{app.job?.company}</div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  📍 {app.job?.location} &nbsp;|&nbsp; 💼 {app.job?.jobType}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${statusColor[app.status]}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.9rem' }}>
                  {app.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.4rem' }}>
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

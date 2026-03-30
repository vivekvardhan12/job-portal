import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, applyToJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const { data } = await fetchJobById(id);
      setJob(data);
    } catch (err) {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await applyToJob(id, { coverLetter });
      toast.success('Application submitted! 🎉');
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner />;
  if (!job) return null;

  return (
    <div>
      {/* Header */}
      <div className="job-detail-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontFamily: 'Sora, sans-serif', marginBottom: '0.4rem' }}>{job.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>{job.company}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#94a3b8' }}>📍 {job.location}</span>
                <span style={{ color: '#94a3b8' }}>💰 {job.salary}</span>
                <span style={{ color: '#94a3b8' }}>💼 {job.experience}</span>
              </div>
            </div>
            <span className={`badge ${job.jobType === 'Full-time' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {job.jobType}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="job-detail-body">
        <div className="container">
          <div className="job-detail-grid">
            {/* Left Column */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="section-title">Job Description</h3>
                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>
              </div>

              {job.skills?.length > 0 && (
                <div className="card">
                  <h3 className="section-title">Required Skills</h3>
                  <div className="skills-list">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="badge badge-blue" style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              {/* Apply Card */}
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                {user?.role === 'jobseeker' ? (
                  <>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginBottom: '0.75rem' }}
                      onClick={() => setShowModal(true)}
                    >
                      Apply Now 🚀
                    </button>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textAlign: 'center' }}>
                      You can add a cover letter when applying
                    </p>
                  </>
                ) : !user ? (
                  <>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>Login as a Job Seeker to apply</p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
                      Login to Apply
                    </button>
                  </>
                ) : (
                  <div className="alert alert-success">You are logged in as an Employer.</div>
                )}
              </div>

              {/* Job Overview */}
              <div className="card">
                <h3 className="section-title">Job Overview</h3>
                <table style={{ width: '100%' }}>
                  <tbody>
                    {[
                      ['📅 Posted', new Date(job.createdAt).toLocaleDateString()],
                      ['⏰ Type', job.jobType],
                      ['📍 Location', job.location],
                      ['💰 Salary', job.salary],
                      ['💼 Experience', job.experience],
                      job.deadline && ['📆 Deadline', new Date(job.deadline).toLocaleDateString()],
                    ].filter(Boolean).map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--gray-600)', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>{k}</td>
                        <td style={{ fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '0.3rem', fontFamily: 'Sora, sans-serif' }}>Apply for {job.title}</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{job.company}</p>

            <div className="form-group">
              <label>Cover Letter (Optional)</label>
              <textarea
                rows={5}
                placeholder="Tell the employer why you're the right fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleApply} disabled={applying}>
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;

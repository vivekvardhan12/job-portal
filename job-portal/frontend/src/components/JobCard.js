import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const typeColor = {
    'Full-time': 'badge-green',
    'Part-time': 'badge-yellow',
    'Internship': 'badge-blue',
    'Contract': 'badge-gray',
    'Remote': 'badge-blue',
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    return `${diff} days ago`;
  };

  return (
    <div className="card job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="job-card-header">
        <div>
          <div className="job-title">{job.title}</div>
          <div className="company-name">{job.company}</div>
        </div>
        <span className={`badge ${typeColor[job.jobType] || 'badge-gray'}`}>
          {job.jobType}
        </span>
      </div>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>💰 {job.salary}</span>
        <span>💼 {job.experience}</span>
      </div>

      {job.skills?.length > 0 && (
        <div className="skills-list" style={{ marginBottom: '0.75rem' }}>
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="badge badge-gray">{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="badge badge-gray">+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
        Posted {timeAgo(job.createdAt)}
      </div>
    </div>
  );
};

export default JobCard;

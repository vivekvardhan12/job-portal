import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../utils/api';
import { toast } from 'react-toastify';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', salary: '',
    jobType: 'Full-time', experience: 'Fresher', skills: [], deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData({ ...formData, skills: [...formData.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob(formData);
      toast.success('Job posted successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <h1 className="page-title">Post a New Job</h1>
      <p className="page-subtitle">Fill in the details to attract the right candidates</p>

      <div style={{ maxWidth: '720px' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Job Title *</label>
                <input name="title" placeholder="e.g., Senior React Developer" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Job Type *</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                  {['Full-time','Part-time','Internship','Contract','Remote'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Experience Required</label>
                <select name="experience" value={formData.experience} onChange={handleChange}>
                  {['Fresher','0-1 years','1-3 years','3-5 years','5+ years'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input name="location" placeholder="e.g., Hyderabad / Remote" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input name="salary" placeholder="e.g., ₹5-8 LPA or Not disclosed" value={formData.salary} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Application Deadline</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Job Description *</label>
                <textarea
                  name="description"
                  rows={6}
                  placeholder="Describe the role, responsibilities, what you're looking for..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label>Required Skills</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill and press Enter or click Add"
                />
                <button type="button" className="btn btn-outline" onClick={addSkill}>Add</button>
              </div>
              {formData.skills.length > 0 && (
                <div className="skills-list" style={{ marginTop: '0.75rem' }}>
                  {formData.skills.map((skill, i) => (
                    <span key={i} className="badge badge-blue" style={{ cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => removeSkill(skill)}>
                      {skill} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={loading}>
                {loading ? 'Posting...' : '🚀 Post Job'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;

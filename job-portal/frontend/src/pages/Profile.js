import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '', skills: [], resume: '', company: '', companyDescription: ''
  });

  useEffect(() => {
    fetchProfile()
      .then(({ data }) => {
        setFormData({
          name: data.name || '',
          skills: data.skills || [],
          resume: data.resume || '',
          company: data.company || '',
          companyDescription: data.companyDescription || ''
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

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
    setSaving(true);
    try {
      const { data } = await updateProfile(formData);
      login({ ...user, name: data.name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container page">
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Keep your profile up to date</p>

      <div style={{ maxWidth: '680px' }}>
        {/* Role badge */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span className={`badge ${user?.role === 'employer' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
            {user?.role === 'employer' ? '🏢 Employer Account' : '👤 Job Seeker Account'}
          </span>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email (cannot change)</label>
              <input value={user?.email || ''} disabled style={{ background: 'var(--gray-100)', cursor: 'not-allowed' }} />
            </div>

            {user?.role === 'jobseeker' ? (
              <>
                <div className="form-group">
                  <label>Resume Link (Google Drive / LinkedIn / Portfolio URL)</label>
                  <input name="resume" value={formData.resume} onChange={handleChange} placeholder="https://your-resume-link.com" />
                </div>
                <div className="form-group">
                  <label>Skills</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill and press Enter"
                    />
                    <button type="button" className="btn btn-outline" onClick={addSkill}>Add</button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="skills-list" style={{ marginTop: '0.75rem' }}>
                      {formData.skills.map((skill, i) => (
                        <span key={i} className="badge badge-blue" style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)}>
                          {skill} ✕
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Company Name</label>
                  <input name="company" value={formData.company} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Company Description</label>
                  <textarea name="companyDescription" rows={4} value={formData.companyDescription} onChange={handleChange} placeholder="Tell job seekers about your company..." />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

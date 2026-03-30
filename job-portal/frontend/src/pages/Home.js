import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../utils/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data } = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  const featuredJobs = jobs.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your <span>Dream Job</span><br />Land Your Future</h1>
          <p>Thousands of opportunities from top companies — all in one place.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="container">
          <div className="stat-item">
            <div className="stat-number">{jobs.length}+</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Candidates</div>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="container page">
        <h2 className="page-title">Latest Job Openings</h2>
        <p className="page-subtitle">Fresh opportunities added every day</p>

        {loading ? (
          <Spinner />
        ) : featuredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No jobs posted yet</h3>
            <p>Check back soon or be the first to post a job!</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
            {jobs.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={() => navigate('/jobs')}>
                  View All {jobs.length} Jobs →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div style={{ background: 'var(--primary-light)', borderTop: '1px solid var(--gray-200)', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Sora, sans-serif', marginBottom: '0.75rem' }}>
            Are You an Employer?
          </h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
            Post jobs and find the best talent for your company.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Get Started Free →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

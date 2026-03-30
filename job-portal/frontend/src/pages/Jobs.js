import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs } from '../utils/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearch(q);
    loadJobs(q, '', '');
  }, [searchParams]);

  const loadJobs = async (s = search, t = jobType, l = location) => {
    setLoading(true);
    try {
      const params = {};
      if (s) params.search = s;
      if (t) params.jobType = t;
      if (l) params.location = l;
      const { data } = await fetchJobs(params);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    loadJobs();
  };

  const clearFilters = () => {
    setSearch(''); setJobType(''); setLocation('');
    loadJobs('', '', '');
  };

  return (
    <div className="container page">
      <h1 className="page-title">Browse Jobs</h1>
      <p className="page-subtitle">Find the perfect opportunity for you</p>

      {/* Search & Filter */}
      <form onSubmit={handleFilter}>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍 Search job title, skill, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', border: '1.5px solid var(--gray-200)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', minWidth: '200px' }}
          />
          <input
            type="text"
            placeholder="📍 Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '160px', padding: '0.6rem 1rem', border: '1.5px solid var(--gray-200)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none' }}
          />
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          <button type="submit" className="btn btn-primary">Filter</button>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>Clear</button>
        </div>
      </form>

      {loading ? (
        <Spinner />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try different keywords or clear the filters.</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            Showing <strong>{jobs.length}</strong> job{jobs.length !== 1 ? 's' : ''}
          </p>
          <div className="jobs-grid">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Jobs;

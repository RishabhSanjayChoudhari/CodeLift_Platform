import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Navbar from '../components/common/Navbar';
import SEO from '../components/common/SEO';
import { FaSearch, FaStar, FaUserGraduate, FaFilter, FaBookOpen, FaTag, FaGraduationCap } from 'react-icons/fa';

export default function CourseCatalog() {
  const { courses, categories, users } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all, free, paid
  const [selectedCourseType, setSelectedCourseType] = useState('all'); // all, cohort, elective
  const [sortBy, setSortBy] = useState('popular'); // popular, rating, price-low, price-high, newest

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    if (!c.isPublished || c.isApproved === false) return false;

    // Course type filter (Cohort vs Elective)
    if (selectedCourseType !== 'all') {
      const type = c.courseType || (c.isCohort ? 'cohort' : 'elective');
      if (type !== selectedCourseType) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && c.categoryId !== selectedCategory) return false;

    // Price filter
    if (selectedType === 'free' && (!c.isFree && c.price > 0)) return false;
    if (selectedType === 'paid' && (c.isFree || c.price === 0)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = (c.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0); // popular default
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', minHeight: '100vh' }}>
      <SEO
        title="Public Course Marketplace"
        description="Browse high-impact paid & free online courses in Full Stack Web, Data Analytics, AI, Python, and Software Engineering."
      />
      <Navbar />

      {/* Hero Header */}
      <section className="py-4 text-white" style={{ background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)' }}>
        <div className="container max-w-7xl">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="badge font-bold text-uppercase px-3 py-2 rounded-pill mb-3 border border-white border-opacity-25" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}>
                Public Learning Marketplace
              </span>
              <h1 className="fw-extrabold display-5 mb-3" style={{ letterSpacing: '-1px' }}>
                Master High-Demand Software Skills
              </h1>
              <p className="lead text-light opacity-90 mb-4">
                Structured curriculum, hands-on projects, industry certifications, and manual fee verification.
              </p>

              {/* Search Bar */}
              <div className="input-group input-group-lg shadow-lg rounded-pill overflow-hidden p-1 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <span className="input-group-text bg-transparent border-0 ms-2 text-muted">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none bg-transparent"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="Search courses by keyword, React, Python, Data, SQL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm">Search</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Course Grid */}
      <main className="container max-w-7xl py-5">
        <div className="row g-4 mb-4 align-items-center">
          {/* Categories Pills */}
          <div className="col-lg-9">
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <button
                className={`btn btn-sm rounded-pill px-3 fw-bold ${selectedCategory === 'all' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${selectedCategory === cat.id ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Type Dropdowns */}
          <div className="col-lg-4 d-flex gap-2 justify-content-lg-end flex-wrap">
            <select className="form-select form-select-sm rounded-pill border-secondary" style={{ width: 'auto' }} value={selectedCourseType} onChange={(e) => setSelectedCourseType(e.target.value)}>
              <option value="all">All Course Types</option>
              <option value="cohort">Cohort Curricula</option>
              <option value="elective">Elective Courses</option>
            </select>
            <select className="form-select form-select-sm rounded-pill border-secondary" style={{ width: 'auto' }} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>
            <select className="form-select form-select-sm rounded-pill border-secondary" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-secondary fw-semibold">
            Showing <strong style={{ color: 'var(--text-primary)' }}>{sortedCourses.length}</strong> courses available
          </div>
        </div>

        {/* Course Cards Grid */}
        {sortedCourses.length === 0 ? (
          <div className="text-center py-5 rounded-4 shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <FaBookOpen className="text-muted fs-1 mb-3 opacity-50" />
            <h5 className="fw-bold" style={{ color: 'var(--text-primary)' }}>No courses found</h5>
            <p className="text-muted">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="row g-4">
            {sortedCourses.map((c) => (
              <div key={c.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow">
                  {/* Thumbnail & Badge */}
                  <div className="position-relative">
                    <img
                      src={c.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'}
                      alt={c.title}
                      className="card-img-top"
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <span
                        className="badge rounded-pill px-2.5 py-1.5 fw-semibold shadow-sm"
                        style={{
                          background: c.courseType === 'cohort' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(21, 128, 61, 0.85)',
                          color: '#ffffff',
                          backdropFilter: 'blur(4px)',
                          fontSize: '0.72rem'
                        }}
                      >
                        {c.courseType === 'cohort' ? '🏛️ Cohort' : '⚡ Elective'}
                      </span>
                    </div>
                    <span
                      className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 font-bold shadow-sm ${
                        c.isFree || c.price === 0 ? 'bg-success' : 'bg-primary'
                      }`}
                    >
                      {c.isFree || c.price === 0 ? 'FREE' : `₹${c.price}`}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge rounded-pill px-3 py-1 font-semibold" style={{ background: 'var(--card-bg-alt, rgba(34, 197, 94, 0.12))', color: 'var(--accent-color, #10b981)', border: '1px solid var(--border-color)' }}>
                          {c.categoryId?.replace('cat-', '').toUpperCase()}
                        </span>
                        <div className="d-flex align-items-center gap-1 text-warning fw-bold small">
                          <FaStar /> {c.rating || 5.0} ({c.numReviews || 0})
                        </div>
                      </div>

                      <h5 className="card-title fw-bold mb-2">
                        <Link to={`/courses/${c.slug || c.id}`} className="text-decoration-none" style={{ color: 'var(--text-primary)' }}>
                          {c.title}
                        </Link>
                      </h5>
                      <p className="card-text text-secondary small line-clamp-2 mb-3">{c.description}</p>
                    </div>

                    <div>
                      <hr className="my-3 opacity-25" />
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 32, height: 32, fontSize: '0.85rem' }}
                          >
                            <FaGraduationCap size={14} />
                          </div>
                          <span className="small font-semibold text-secondary">CodeLift Faculty</span>
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <FaUserGraduate /> {c.studentsEnrolled || 0}
                        </div>
                      </div>

                      <Link to={`/courses/${c.slug || c.id}`} className="btn btn-outline-success w-100 rounded-pill fw-bold mt-3">
                        View Course & Modules
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

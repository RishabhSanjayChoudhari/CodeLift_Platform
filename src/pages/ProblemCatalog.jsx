import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEED_PROBLEMS } from '../data/problemsSeed';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import SEO from '../components/common/SEO';
import { FaCode, FaSearch, FaTrophy, FaCheckCircle, FaFire, FaTerminal } from 'react-icons/fa';

export default function ProblemCatalog() {
  const { problemAttempts } = useData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Solved problems set for currentUser
  const solvedProblemIds = new Set(
    problemAttempts
      .filter((pa) => pa.studentId === currentUser?.id && pa.passed)
      .map((pa) => pa.problemId)
  );

  const categories = ['All', 'Python', 'Data Structures', 'Algorithms', 'Web Dev', 'SQL', 'Flask'];

  const filteredProblems = SEED_PROBLEMS.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return 'bg-success-subtle text-success border-success-subtle';
    if (diff === 'Medium') return 'bg-warning-subtle text-warning border-warning-subtle';
    return 'bg-danger-subtle text-danger border-danger-subtle';
  };

  // Leaderboard Calculation
  const leaderboardMap = {};
  problemAttempts.forEach((pa) => {
    if (pa.passed) {
      const sid = pa.studentId || 'Anonymous';
      leaderboardMap[sid] = (leaderboardMap[sid] || 0) + (pa.score || 50);
    }
  });

  const leaderboardList = Object.entries(leaderboardMap)
    .map(([studentId, totalXp]) => ({ studentId, totalXp }))
    .sort((a, b) => b.totalXp - a.totalXp);

  return (
    <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', minHeight: '100vh' }}>
      <SEO
        title="50+ Coding & Problem Solving Challenges"
        description="Master Python, Data Structures, Algorithms, SQL, and Flask with 50+ interactive coding problems and test runners."
      />
      <Navbar />

      {/* Hero Header */}
      <section className="py-4 bg-dark text-white">
        <div className="container max-w-7xl">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-success text-white font-bold text-uppercase px-3 py-2 rounded-pill mb-3">
                50+ Pre-loaded Coding Challenges
              </span>
              <h1 className="fw-extrabold display-5 mb-3">Problem Solving Arena</h1>
              <p className="lead text-light opacity-90 mb-4">
                Sharpen your problem-solving skills across Python, Data Structures, Algorithms, Web Development, SQL queries, and Flask APIs.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-light rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                >
                  <FaTrophy className="text-warning" /> {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-7xl py-5">
        {/* Leaderboard Modal / Drawer */}
        {showLeaderboard && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-warning">
              <FaTrophy /> Top XP Leaderboard
            </h5>
            {leaderboardList.length === 0 ? (
              <p className="text-muted small">No solved problems recorded yet. Be the first to reach the leaderboard!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Coder ID</th>
                      <th className="text-end">Total XP Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardList.slice(0, 10).map((item, idx) => (
                      <tr key={item.studentId}>
                        <td className="fw-bold">
                          {idx === 0 ? '1st Place' : idx === 1 ? '2nd Place' : idx === 2 ? '3rd Place' : `#${idx + 1}`}
                        </td>
                        <td className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{item.studentId}</td>
                        <td className="text-end fw-bold text-success">+{item.totalXp} XP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-lg-4">
              <div className="input-group">
                <span className="input-group-text border-end-0 text-muted" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search problem title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="col-lg-6">
              <div className="d-flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                      selectedCategory === cat ? 'btn-success' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="col-lg-2">
              <select
                className="form-select form-select-sm rounded-pill"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="All">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Status</th>
                  <th>Challenge Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>XP Reward</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((prob) => {
                  const isSolved = solvedProblemIds.has(prob.id);
                  return (
                    <tr key={prob.id}>
                      <td className="ps-4">
                        {isSolved ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                            <FaCheckCircle className="me-1" /> Solved
                          </span>
                        ) : (
                          <span className="badge border rounded-pill px-3 py-1" style={{ background: 'var(--card-bg-alt)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                            Unsolved
                          </span>
                        )}
                      </td>
                      <td>
                        <Link to={`/problems/${prob.id}`} className="fw-bold text-decoration-none" style={{ color: 'var(--text-primary)' }}>
                          {prob.title}
                        </Link>
                      </td>
                      <td>
                        <span className="badge border" style={{ background: 'var(--card-bg-alt)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>{prob.category}</span>
                      </td>
                      <td>
                        <span className={`badge border rounded-pill px-3 ${getDifficultyBadge(prob.difficulty)}`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="fw-bold text-success">+{prob.xp} XP</td>
                      <td className="text-end pe-4">
                        <Link to={`/problems/${prob.id}`} className="btn btn-sm btn-outline-success rounded-pill fw-bold px-3">
                          <FaTerminal className="me-1" /> Solve Challenge
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

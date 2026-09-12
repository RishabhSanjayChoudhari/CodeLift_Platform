import React from 'react';
import { useData } from '../../contexts/DataContext';
import { FaMoneyBillWave, FaChartLine, FaShoppingBag, FaBookOpen } from 'react-icons/fa';

export default function RevenueReports() {
  const { payments, enrollments, courses } = useData();

  const totalVerifiedRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const paidEnrollments = enrollments.filter((e) => e.status === 'PAID').length;
  const publishedCourses = courses.filter((c) => c.isPublished !== false).length;
  const avgPerEnrollment = paidEnrollments ? Math.round(totalVerifiedRevenue / paidEnrollments) : 0;

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <FaChartLine className="text-success" /> Sales & Revenue Analytics Reports
      </h4>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="p-3 bg-success-subtle rounded-4 text-success border border-success-subtle">
            <div className="small font-semibold">Total Verified Revenue</div>
            <div className="fw-extrabold fs-4 mt-1">₹{totalVerifiedRevenue}</div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-primary-subtle rounded-4 text-primary border border-primary-subtle">
            <div className="small font-semibold">Paid Enrollments</div>
            <div className="fw-extrabold fs-4 mt-1">{paidEnrollments}</div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-info-subtle rounded-4 text-info border border-info-subtle">
            <div className="small font-semibold">Active Published Courses</div>
            <div className="fw-extrabold fs-4 mt-1">{publishedCourses}</div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-warning-subtle rounded-4 text-warning border border-warning-subtle">
            <div className="small font-semibold">Avg / Enrollment</div>
            <div className="fw-extrabold fs-4 mt-1">₹{avgPerEnrollment}</div>
          </div>
        </div>
      </div>

      {/* Top Courses Sales Breakdown */}
      <h6 className="fw-bold mb-3">Top Selling Courses Breakdown</h6>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Course Title</th>
              <th>Price</th>
              <th>Enrolled</th>
              <th>Total Gross Sales</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="fw-bold" style={{ color: 'var(--text-primary)' }}>{c.title}</td>
                <td>{c.isFree ? 'FREE' : `₹${c.price}`}</td>
                <td>{c.studentsEnrolled || 0}</td>
                <td className="fw-bold text-success">₹{(c.price || 0) * (c.studentsEnrolled || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className = '', style = {} }) {
  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, onClick, className = '', style = {}, type = 'button', disabled = false }) {
  return (
    <motion.button
      type={type}
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedProgress({ value, max = 100, label, height = 8, color }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="mb-2">
      {label && (
        <div className="d-flex justify-content-between mb-1">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--bs-primary)' }}>{pct}%</span>
        </div>
      )}
      <div style={{ height, background: 'var(--border-color)', borderRadius: height / 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: color || 'var(--bs-primary)',
            borderRadius: height / 2,
          }}
        />
      </div>
    </div>
  );
}

export function SkeletonLoader({ count = 1, height = 80 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton mb-3"
          style={{ height, borderRadius: 12 }}
        />
      ))}
    </div>
  );
}

export function GlassCard({ children, className = '', style = {} }) {
  return (
    <div className={`glass-card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function GradientText({ children, className = '' }) {
  return (
    <span className={`gradient-text ${className}`}>{children}</span>
  );
}

export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, suffix = '', decimals = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Number(value).toLocaleString('en-IN')}
      {suffix}
    </motion.span>
  );
}

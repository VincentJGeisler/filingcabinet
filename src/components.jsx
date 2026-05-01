export const Badge = ({ status }) => (
  <span className={`badge badge-${status}`}>[{status}]</span>
)

export const Marginalia = ({ children }) => (
  <span className="marginalia">✎ {children}</span>
)

export const Panel = ({ children, className = '' }) => (
  <div className={`panel p-4 ${className}`}>{children}</div>
)

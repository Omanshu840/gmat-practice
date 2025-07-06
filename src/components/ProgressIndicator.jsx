const ProgressIndicator = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="d-flex align-items-center mb-2">
      <small className="text-muted me-2">{completed}/{total} completed</small>
      <div className="progress-bar-container flex-grow-1">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
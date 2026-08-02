// 📁 shared/components/ProjectCard.jsx
export default function ProjectCard({ title, status, description, onRun }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`status ${status}`}>
        {status === 'completed' ? 'تکمیل شده' : 'در حال توسعه'}
      </div>
      <button 
        onClick={onRun}
        className="run-btn"
        disabled={status !== 'completed'}
      >
        🚀 تأیید و اجرای پروژه
      </button>
    </div>
  );
}

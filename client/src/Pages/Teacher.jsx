import { useNavigate } from "react-router-dom";
import "../Styles/Teacher.css"; // ✅ You'll create this file

const Teacher = () => {
  const navigate = useNavigate();

  const createPoll = () => navigate("/createPoll");
  const pastPolls = () => navigate("/pastPolls");

  return (
    <div className="teacher-container">
      <div className="teacher-badge">👩‍🏫 Teacher Panel</div>
      <h1 className="teacher-heading">What would you like to do?</h1>

      <div className="teacher-options">
        <div className="teacher-card" onClick={createPoll}>
          <h3>Create a New Poll</h3>
          <p>Start a new live poll for your students.</p>
        </div>
        <div className="teacher-card" onClick={pastPolls}>
          <h3>View Past Polls</h3>
          <p>Check results from your previous sessions.</p>
        </div>
      </div>
    </div>
  );
};

export default Teacher;

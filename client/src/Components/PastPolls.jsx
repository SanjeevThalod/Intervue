import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/PastPolls.css";

const PastPolls = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_APP_API;

  useEffect(() => {
    fetch(`${api}/api/polls/history`)
      .then(res => res.json())
      .then(data => setPolls(data))
      .catch(err => console.error("Error fetching polls:", err));
  }, []);

  const handleViewResult = (id) => {
    navigate(`/poll-result/${id}`);
  };

  return (
    <div className="past-polls-container">
      <h2>📜 Past Polls</h2>

      {polls.length === 0 ? (
        <p>No polls found.</p>
      ) : (
        <div className="polls-list">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
            const date = new Date(poll.createdAt).toLocaleString();

            return (
              <div className="poll-card" key={poll._id}>
                <h4>{poll.question}</h4>
                <p>Total Votes: <strong>{totalVotes}</strong></p>
                <p>Created At: {date}</p>
                <button onClick={() => handleViewResult(poll._id)}>View Result</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PastPolls;

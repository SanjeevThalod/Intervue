import { useState } from "react";
import "../Styles/StudentWelcome.css";

const StudentEnterName = ({setName}) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      alert("Please enter your name");
      return;
    }
    setName(trimmed);
  };

  return (
    <div className="student-container">
      <div className="student-badge">✨ Intervue Poll</div>
      <h1 className="student-heading">
        Let’s <span className="bold">Get Started</span>
      </h1>
      <p className="student-subtitle">
        If you’re a student, you’ll be able to <strong>submit your answers</strong>,
        participate in live polls, and see how your responses compare with your classmates
      </p>

      <div className="student-form">
        <label className="form-label">Enter your Name</label>
        <input
          type="text"
          defaultValue="Rahul Bajaj"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="name-input"
        />
        <button className="continue-btn" onClick={handleSubmit}>Continue</button>
      </div>
    </div>
  );
};

export default StudentEnterName;

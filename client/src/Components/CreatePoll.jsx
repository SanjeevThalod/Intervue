import { useEffect, useState } from "react";
import socket from "../utils/socket";
import {useNavigate} from "react-router-dom"
import "../Styles/CreatePoll.css";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);

  const handleOptionChange = (index, value) => {
    const copy = [...options];
    copy[index].text = value;
    setOptions(copy);
  };

  const handleCorrectChange = (index) => {
    const copy = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setOptions(copy);
  };

  const handleAddOption = () => {
    if (options.length >= 6) return alert("Max 6 options allowed");
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleSubmit = () => {
    if (!question.trim()) return alert("Please enter a question");
    const validOptions = options.filter(opt => opt.text.trim() !== "");
    if (validOptions.length < 2) return alert("At least 2 valid options required");

    const pollData = {
      role: "teacher",
      question: question.trim(),
      options: validOptions,
      duration
    };

    socket.emit("new_question", pollData);
    alert("Poll Created");
    // Reset
    setQuestion("");
    setOptions([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
    setDuration(60);
  };

  useEffect(() => {
    socket.on("poll_created", (poll) => {
      navigate(`/poll-result/${poll._id}`);
    });

    return () => {
      socket.off("poll_created");
    };
  }, []);

  return (
    <div className="poll-container">
      <div className="badge">✨ Intervue Poll</div>
      <h1>Let’s <span className="bold">Get Started</span></h1>
      <p className="subtitle">
        you’ll have the ability to create and manage polls, ask questions, and
        monitor your students' responses in real-time.
      </p>

      <div className="section">
        <label className="section-title">Enter your question</label>
        <div className="question-row">
          <textarea
            className="question-box"
            placeholder="Type your question..."
            maxLength={100}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
          <select
            className="timer-dropdown"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          >
            <option value={60}>60 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={90}>90 seconds</option>
          </select>
        </div>
        <div className="char-count">{question.length}/100</div>
      </div>

      <div className="section">
        <div className="option-header">
          <label className="section-title">Edit Options</label>
          <label className="section-title">Is it Correct?</label>
        </div>

        {options.map((opt, i) => (
          <div className="option-row" key={i}>
            <div className="option-left">
              <span className="index-circle">{i + 1}</span>
              <input
                className="option-input"
                value={opt.text}
                placeholder={`Option ${i + 1}`}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
            </div>
            <div className="option-right">
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctOption"
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectChange(i)}
                />
                <span className="custom-radio purple"></span> Correct Answer
              </label>
            </div>

          </div>
        ))}

        <button className="add-option" onClick={handleAddOption}>
          + Add More option
        </button>
      </div>

      <div className="footer">
        <button className="ask-button" onClick={handleSubmit}>
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;

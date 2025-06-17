import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import "../Styles/StudentPoll.css"; // make sure this path is correct

const StudentPoll = () => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);
  const [name, setName] = useState(null);

  useEffect(() => {
  }, []);
  
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  
  useEffect(() => {
    const studentName = sessionStorage.getItem("studentName");
    if (studentName) {
      setName(studentName);
      const role = sessionStorage.getItem("role");
      socket.emit("join_poll", { name: studentName, role: role || "student" });
    }

    socket.on("new_question", (poll) => {
      setQuestion(poll);
      setSelected("");
      setHasSubmitted(false);
      setResults(null);
      setTimeLeft(poll.duration);
      
      // Start countdown
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      socket.emit("join_poll", { name: studentName, role });
    });

    socket.on("result_for_student", ({ results }) => {
      setResults(results);
    });

    socket.on("participant_list", (list) => {
      setParticipants(list);
    });

    socket.on("chat_message", ({ name, message, timestamp }) => {
      setMessages((prev) => [...prev, { name, message, timestamp }]);
    });

    socket.on("kicked", () => {
      sessionStorage.setItem("kicked", "true");
      window.location.href = "/kicked";
    });

    return () => {
      socket.off("new_question");
      socket.off("result_for_student");
      socket.off("participant_list");
      socket.off("chat_message");
      socket.off("kicked");
    };
  }, []);
  console.log(messages);
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    socket.emit("chat_message", {
      name,
      message: messageInput.trim()
    });

    setMessageInput("");
  };


  const handleSubmit = () => {
    if (!selected) return alert("Please select an option");
    socket.emit("submit_answer", { name, answer: selected });
    setHasSubmitted(true);
  };

  return (
    <div className="student-poll-container">
      <h2>Hello, {name ? name : "champion"} 👋</h2>

      {!question && <p>Waiting for the teacher to start a poll...</p>}

      {question && !results && (
        <>
          <div className="timer-line">
            <h3>Question 1</h3>
            <span>⏱</span>
            <span className="red">00:{timeLeft.toString().padStart(2, "0")}</span>
          </div>

          <div className="question-wrapper">
            <div className="question-header">{question.question}</div>

            <div className="options-list">
              {question.options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`option-button ${selected === opt.text ? "selected" : ""
                    }`}
                  onClick={() => setSelected(opt.text)}
                  disabled={hasSubmitted}
                >
                  <span className="option-index">{idx + 1}</span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={hasSubmitted}
          >
            Submit
          </button>
        </>
      )}

      {hasSubmitted && !results && (
        <p style={{ marginTop: "20px" }}>Waiting for poll to end...</p>
      )}

      {results && (
        <>
          <div className="timer-line">
            <h3>Poll Ended</h3>
            <span>⏱</span>
            <span className="red">00:00</span>
          </div>

          <div className="question-wrapper">
            <div className="question-header">{question?.question}</div>

            <div className="options-list">
              {results.map((opt, idx) => {
                const isSelected = selected === opt.text;
                const total = results.reduce((sum, o) => sum + o.count, 0);
                const percent = total ? Math.round((opt.count / total) * 100) : 0;

                return (
                  <div
                    key={idx}
                    className={`option-button disabled ${isSelected ? "selected" : ""}`}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>
                        <span className="option-index">{idx + 1}</span>
                        {opt.option ? opt.option : opt.text}
                      </span>
                      <span>{opt.count} vote{opt.count !== 1 ? "s" : ""} — {percent}%</span>
                    </div>
                    <div className="result-bar">
                      <div
                        className="result-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <div className="chat-toggle-button" onClick={() => setShowDialog(!showDialog)}>
        💬
      </div>

      {showDialog && (
        <div className="floating-dialog">
          <div className="dialog-tabs">
            <span
              className={`tab ${activeTab === "chat" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </span>
            <span
              className={`tab ${activeTab === "participants" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("participants")}
            >
              Participants
            </span>
          </div>

          {activeTab === "participants" ? (
            <div className="dialog-table">
              <div className="dialog-header">
                <span>Name</span>
              </div>
              {participants.map((name, idx) => (
                <div key={idx} className="dialog-row">
                  {name}
                </div>
              ))}
            </div>
          ) : (
            <div className="chat-section">
              <div className="chat-messages">
                {messages.map((msg, idx) => {
                  const isOwnMessage = msg.name === name || (!msg.name && !name); // match anonymous sender if you're the teacher
                  return (
                    <div
                      key={idx}
                      className={`chat-message-bubble ${isOwnMessage ? "own" : "other"}`}
                    >
                      <span className="chat-name">{msg.name || "Teacher"}</span>
                      <div className="chat-bubble">{msg.message}</div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default StudentPoll;

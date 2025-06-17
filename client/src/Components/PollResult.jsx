import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";
import "../Styles/PollResult.css";

const PollResult = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [liveResults, setLiveResults] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState("participants");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKickOut = (name)=>{
    socket.emit("kick_out",name);
  }
  useEffect(() => {
    // Initial fetch
    fetch(`http://localhost:5000/api/polls/${id}`)
      .then((res) => res.json())
      .then((data) => setPoll(data));

    socket.on("poll_results", ({ pollId, results }) => {
      if (pollId === id) {
        setLiveResults(results);
      }
    });

    socket.on("participant_list", (studentList) => {
      setParticipants(studentList);
    });

    socket.on("chat_message", ({ name, message, timestamp }) => {
      setMessages((prev) => [...prev, { name, message, timestamp }]);
    });

    return () => {
      socket.off("poll_results");
      socket.off("participant_list");
      socket.off("chat_message");
    };
  }, [id]);

  const sendMessage = () => {
    const name =
      sessionStorage.getItem("teacherName") ||
      sessionStorage.getItem("studentName");

    if (!messageInput.trim()) return;

    socket.emit("chat_message", {
      name,
      message: messageInput.trim(),
    });

    setMessageInput("");
  };

  if (!poll) return <p>Loading poll result...</p>;

  const totalVotes = liveResults
    ? liveResults.reduce((sum, opt) => sum + opt.count, 0)
    : poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const optionsToRender = liveResults
    ? liveResults.map((r, idx) => ({
      ...r,
      percent: totalVotes ? Math.round((r.count / totalVotes) * 100) : 0,
      index: idx + 1,
    }))
    : poll.options.map((opt, idx) => ({
      text: opt.text,
      count: opt.votes,
      percent: totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0,
      index: idx + 1,
    }));

  return (
    <div className="poll-result-container">
      <h2>Live Poll Result</h2>

      <div className="result-card">
        <div className="result-header">{poll.question}</div>

        <div className="result-options">
          {optionsToRender.map((opt, idx) => (
            <div className="result-option" key={idx}>
              <div className="option-top">
                <span>
                  <span className="option-index">{opt.index}</span>
                  {opt.option ? opt.option : opt.text}
                </span>
                <span>
                  {opt.count} vote{opt.count !== 1 ? "s" : ""} — {opt.percent}%
                </span>
              </div>

              <div className="result-bar">
                <div
                  className="result-fill"
                  style={{ width: `${opt.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Button */}
        <div
          className="chat-toggle-button"
          onClick={() => setShowDialog(!showDialog)}
        >
          💬
        </div>

        {/* Floating Dialog */}
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
                className={`tab ${activeTab === "participants" ? "active" : "inactive"
                  }`}
                onClick={() => setActiveTab("participants")}
              >
                Participants
              </span>
            </div>

            {activeTab === "participants" ? (
              <div className="dialog-table">
                <div className="dialog-header">
                  <span>Name</span>
                  <span>Action</span>
                </div>

                {participants.map((name, idx) => (
                  <div key={idx} className="dialog-row">
                    <span>{name}</span>
                    <button className="kick-btn" onClick={handleKickOut(name)}>Kick out</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="chat-section">
                <div className="chat-messages">
                  {messages.map((msg, idx) => {
                    const teacherName =
                      sessionStorage.getItem("teacherName") ||
                      sessionStorage.getItem("studentName");

                    const isOwnMessage = msg.name === teacherName || (!msg.name && teacherName);
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
    </div>
  );
};

export default PollResult;

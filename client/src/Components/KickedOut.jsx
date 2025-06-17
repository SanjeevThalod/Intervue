import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KickedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const kicked = sessionStorage.getItem("kicked");
    if (!kicked) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "80px", fontFamily: "sans-serif" }}>
      <h1>🚫 You’ve been removed from the poll</h1>
      <p style={{ color: "#666", marginTop: "10px" }}>
        Looks like the teacher has removed you from the polling system. Please try again after sometimes
      </p>
    </div>
  );
};

export default KickedPage;

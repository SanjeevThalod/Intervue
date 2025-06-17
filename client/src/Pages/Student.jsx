import React, { useEffect, useState } from "react";
import StudentEnterName from "../Components/StudentEnterName";
import StudentPoll from "../Components/StudentPoll";

const Student = () => {
  const [name, setName] = useState(sessionStorage.getItem("studentName") || "");

  useEffect(() => {
    if (name) {
      sessionStorage.setItem("studentName", name); // in case it was just entered
    }
  }, [name]);

  return name ? (
    <StudentPoll name={name} />
  ) : (
    <StudentEnterName setName={setName} />
  );
};

export default Student;

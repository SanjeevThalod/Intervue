import { useEffect } from "react"
import {useNavigate} from "react-router-dom";
import "../Styles/home.css"

const Home = () => {
  const navigate = useNavigate();

  const handleTeacher =  ()=>{
    sessionStorage.setItem("role","Teacher");
    navigate("/teacher");
  }
  const handleStudent = ()=>{
    sessionStorage.setItem("role","Student");
    navigate("/student");
  }
  useEffect(()=>{
    const r = sessionStorage.getItem("role");
    console.log(r);
    if(r !== null){
      if(r === 'Teacher'){
        navigate("/teacher")
      }else{
        navigate("/student");
      }
    }
  },[]);
  return (
    <div className='home'>
      <p className='icon'>✨ Intervue Poll</p>
      <h1 className='home-heading'>Welcome to the <span>Live Polling System</span></h1>
      <p className='gray'>Please select the role that best describe you to begin using the live polling system</p>

      <div className='home-choices'>
        <div className='home-student' onClick={handleStudent}>
          <b>I'm a Student</b>
          <p>Participiate in Polling and view Results</p>
        </div>
        <div className='home-teacher' onClick={handleTeacher}>
          <b>I'm a Teacher</b>
          <p>Submit answers ans view live poll result in real-time</p>
        </div>
      </div>
      <button className="home-cont">Continue</button>
    </div>
  )
}

export default Home

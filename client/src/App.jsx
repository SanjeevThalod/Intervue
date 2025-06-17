import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CreatePoll from './Components/CreatePoll'
import Home from './Pages/Home'
import Teacher from './Pages/Teacher';
import PollResult from './Components/PollResult';
import Student from './Pages/Student';
import PastPolls from './Components/PastPolls';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/teacher' element={<Teacher/>}/>
        <Route path='/student' element={<Student/>}/>
        <Route path='/createPoll' element={<CreatePoll/>}/>
        <Route path='/pastPolls' element={<PastPolls/>} />
        <Route path='/poll-result/:id' element={<PollResult/>}/>
      </Routes>
    </Router>
  )
}

export default App

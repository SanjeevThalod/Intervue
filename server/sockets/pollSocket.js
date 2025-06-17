import Poll from '../Models/Poll.js';

export default function pollSocket(io) {
  let activePoll = null;
  let participants = new Map();
  let kickedStudents = new Set();

  io.on('connection', (socket) => {
    console.log("Client connected:", socket.id);

    socket.on('new_question', async (data) => {
      const { role, ...pollData } = data;

      if (role !== 'teacher') {
        socket.emit('error_message', 'Only teacher can create polls');
        return;
      }

      const poll = new Poll(pollData);
      await poll.save();
      activePoll = poll;

      // Notify all students about the new question
      io.emit('new_question', poll);

      // Send poll ID back to the teacher for redirect
      socket.emit('poll_created', poll);

      // Schedule poll closure and final result broadcast
      setTimeout(async () => {
        if (activePoll?._id?.toString() !== poll._id.toString()) return;

        poll.isActive = false;
        await poll.save();

        const finalResults = poll.options.map(opt => ({
          option: opt.text,
          count: opt.votes
        }));

        io.emit('result_for_student', {
          pollId: poll._id,
          results: finalResults
        })
        activePoll = null;
      }, poll.duration * 1000);
    });

    // A. Handle joining poll
    socket.on("join_poll", ({ name, role }) => {
      if (kickedStudents.has(name)) {
        socket.emit("kicked");
        return;
      }

      participants.set(socket.id, { name, role });

      const list = Array.from(participants.values())
        .filter(p => p.role === 'student')
        .map(p => p.name);

      io.emit("participant_list", list);
    });

    socket.on("kick_out", (studentName) => {
      for (const [id, user] of participants.entries()) {
        if (user.name === studentName && user.role === "student") {
          kickedStudents.add(studentName);           
          io.to(id).emit("kicked");                 
          participants.delete(id);                  
          break;
        }
      }

      const updatedList = Array.from(participants.values())
        .filter(p => p.role === 'student')
        .map(p => p.name);

      io.emit("participant_list", updatedList);
    });




    // B. Handle chat message
    socket.on("chat_message", ({ name, message }) => {
      io.emit("chat_message", { name, message, timestamp: new Date() });
      console.log(name + message);
    });


    socket.on('submit_answer', async ({ name, answer }) => {
      if (!activePoll || !activePoll.isActive) return;

      const option = activePoll.options.find(o => o.text === answer);
      if (option) {
        option.votes += 1;
        await activePoll.save();

        // Emit live updates
        const liveResults = activePoll.options.map(opt => ({
          option: opt.text,
          count: opt.votes
        }));

        io.emit('poll_results', {
          pollId: activePoll._id,
          results: liveResults
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      participants.delete(socket.id);

      const studentList = Array.from(participants.values())
        .filter(p => p.role === "student")
        .map(p => p.name);

      io.emit("participant_list", studentList); // 🔁 emit to all
    });

  });
}

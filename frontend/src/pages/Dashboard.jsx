import Navbar from '../components/Navbar';
import ChatBox from '../components/ChatBox';
import VoiceRecorder from '../components/VoiceRecorder';
import Journal from '../components/Journal';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChatBox />
        <VoiceRecorder />
        <Journal /> 
      </div>
    </div>
  );
}
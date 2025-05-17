import { useState } from 'react';
import axios from 'axios';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await axios.post('/api/chat', { prompt: input }); // Flask backend
    setResponse(res.data.reply);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Chat with AI</h2>
      <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full border p-2 mb-2" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      {response && <div className="mt-2 p-2 bg-gray-100 rounded">{response}</div>}
    </div>
  );
}

import { useState } from 'react';

export default function Journal({ defaultText = '' }) {
  const [entry, setEntry] = useState(defaultText);

  const handleSave = () => {
    console.log('Saved journal entry:', entry);
    // Save to Firebase or backend
  };

  return (
    <div className="mt-10 bg-white shadow rounded p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Journal</h2>
      <textarea
        className="w-full h-40 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your thoughts here..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Entry
      </button>
    </div>
  );
}

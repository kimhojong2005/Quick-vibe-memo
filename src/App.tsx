import { useState, useEffect } from 'react';
import MemoCard from './components/MemoCard';
import type { Memo } from './types';


function App() {
  // Lazily initialize state from LocalStorage
  const [memos, setMemos] = useState<Memo[]>(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      return JSON.parse(savedMemos).map((memo: Memo) => ({
        ...memo,
        createdAt: new Date(memo.createdAt),
      }));
    } else {
      return [];
    }
  });

  // State for the new memo input text
  const [newMemoText, setNewMemoText] = useState('');

  // Effect to save memos to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoText.trim() === '') return;

    const newMemo: Memo = {
      id: crypto.randomUUID(),
      text: newMemoText,
      createdAt: new Date(),
    };

    setMemos([newMemo, ...memos]);
    setNewMemoText('');
  };

  const handleDeleteMemo = (id: string) => {
    setMemos(memos.filter(memo => memo.id !== id));
  };

  const handleUpdateMemo = (id: string, newText: string) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, text: newText } : memo
    ));
  };

  const handleClearAll = () => {
    setMemos([]);
  };


  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 font-sans">
      <header className="text-center my-8">
        <h1 className="text-5xl font-extrabold tracking-tight">Quick Vibe Memo</h1>
        <p className="text-gray-400 mt-2">A minimalist memo pad for your vibes.</p>
      </header>
      <main className="max-w-3xl mx-auto">
        {/* Memo input form */}
        <form onSubmit={handleAddMemo} className="mb-8">
          <textarea
            value={newMemoText}
            onChange={(e) => setNewMemoText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            rows={4}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Add Vibe
          </button>
        </form>

        {/* Clear all button and Memo list */}
        {memos.length > 0 && (
          <div className="mb-4 text-right">
            <button 
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              Clear All Memos
            </button>
          </div>
        )}

        {memos.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>No memos yet. Add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memos.map((memo) => (
              <MemoCard 
                key={memo.id} 
                memo={memo} 
                onDelete={handleDeleteMemo}
                onUpdate={handleUpdateMemo}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
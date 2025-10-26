import { useState, useEffect, useMemo } from 'react';
import MemoCard from './components/MemoCard';
import type { Memo } from './types';
import { AnimatePresence } from 'framer-motion';


function App() {
  // Lazily initialize state from LocalStorage
  const [memos, setMemos] = useState<Memo[]>(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      return JSON.parse(savedMemos).map((memo: Memo) => ({
        ...memo,
        createdAt: new Date(memo.createdAt),
        font: memo.font || 'font-sans', // Ensure old memos get a default font
      }));
    } else {
      return [];
    }
  });

  // State for the new memo input text
  const [newMemoText, setNewMemoText] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentFont, setCurrentFont] = useState('font-sans');

  const availableFonts = [
    { name: 'Sans', class: 'font-sans' },
    { name: 'Serif', class: 'font-serif' },
    { name: 'Mono', class: 'font-mono' },
  ];


  // Effect to save memos to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  const sortedMemos = useMemo(() => {
    return [...memos].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });
  }, [memos, sortOrder]);

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoText.trim() === '') return;

    const newMemo: Memo = {
      id: crypto.randomUUID(),
      text: newMemoText,
      createdAt: new Date(),
      font: currentFont, // Use the currently selected font
    };

    setMemos([newMemo, ...memos]);
    setNewMemoText('');
  };

  const handleDeleteMemo = (id: string) => {
    setMemos(memos.filter(memo => memo.id !== id));
  };

  const handleUpdateMemo = (id: string, newText: string, newFont: string) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, text: newText, font: newFont } : memo
    ));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all memos? This action cannot be undone.')) {
      setMemos([]);
    }
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
            className={`w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${currentFont}`}
            rows={4}
          />

          <div className="flex justify-center gap-3 mt-4">
            {availableFonts.map(font => (
              <button
                type="button" // Prevents form submission
                key={font.class}
                onClick={() => setCurrentFont(font.class)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${currentFont === font.class ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${font.class}`}
              >
                {font.name}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Add Vibe
          </button>
        </form>

        {/* Controls: Clear all and Sort */}
        {memos.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setSortOrder('newest')}
                className={`text-sm font-semibold px-3 py-1 rounded-md transition-colors ${sortOrder === 'newest' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Newest First
              </button>
              <button 
                onClick={() => setSortOrder('oldest')}
                className={`text-sm font-semibold px-3 py-1 rounded-md transition-colors ${sortOrder === 'oldest' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Oldest First
              </button>
            </div>
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
            <AnimatePresence>
              {sortedMemos.map((memo) => (
                <MemoCard 
                  key={memo.id} 
                  memo={memo} 
                  onDelete={handleDeleteMemo}
                  onUpdate={handleUpdateMemo}
                  availableFonts={availableFonts}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
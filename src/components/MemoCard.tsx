import { useState } from 'react';

// The Memo type can be imported from App.tsx in a later refactor.
type Memo = {
  id: string;
  text: string;
  createdAt: Date;
};

type MemoCardProps = {
  memo: Memo;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
};

function MemoCard({ memo, onDelete, onUpdate }: MemoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(memo.text);

  const handleSave = () => {
    // If text is empty after edit, delete the memo
    if (editedText.trim() === '') {
      onDelete(memo.id);
      return;
    }
    onUpdate(memo.id, editedText);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 shadow-lg flex flex-col h-full">
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition flex-grow"
          rows={5}
        />
        <div className="mt-2 flex justify-end gap-2">
           <button 
            onClick={() => setIsEditing(false)}
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="text-xs font-semibold text-green-500 hover:text-green-400 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg transition-transform hover:scale-[1.02] duration-300 ease-in-out flex flex-col justify-between h-full">
      <p className="text-gray-200 whitespace-pre-wrap mb-4 flex-grow">{memo.text}</p>
      <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {memo.createdAt.toLocaleString()}
        </span>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(memo.id)}
            className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoCard;

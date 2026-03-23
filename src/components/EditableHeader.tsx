import { Edit2, Check } from 'lucide-react';
import { useState } from 'react';

export const EditableHeader = ({
  name,
  onRename,
}: {
  name: string;
  onRename: (n: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    onRename(tempName);
  };

  return (
    <div className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-800">
      <div
        className="group relative h-full flex items-center min-h-11" // Fixed min-height to prevent row jumping
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <div className="flex items-center w-full h-full px-4 bg-slate-800">
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
              // Match text-xs and font-bold from the header row
              className="w-full text-xs font-bold text-white px-2 py-4 rounded border border-none outline-none -ml-2"
            />
            <Check size={14} className="ml-2 text-emerald-400 shrink-0" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-between px-4 hover:bg-slate-800/80 transition-colors">
            <span className="truncate py-1">{name}</span>
            <Edit2
              size={12}
              className="opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity ml-2 shrink-0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

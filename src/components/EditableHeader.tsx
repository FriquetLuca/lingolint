import { Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

interface EditableHeaderProps {
  name: string;
  onRename: (n: string) => void;
  onRemove: (fileName: string) => void;
}

export default function EditableHeader({
  name,
  onRename,
  onRemove,
}: EditableHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    onRename(tempName);
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-800 border-b border-r border-slate-700">
      <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-800">
        <div
          className="group relative h-full flex items-center min-h-11" // Fixed min-height to prevent row jumping
          onClick={() => !isEditing && setIsEditing(true)}
        >
          {isEditing ? (
            <div className="rounded-xl flex items-center w-full h-full px-4">
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                className="w-full text-xs font-bold px-2 border-b border-b-slate-200 outline-none -ml-2"
              />
              <Check size={14} className="ml-2 text-emerald-400 shrink-0" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-between px-4 transition-colors">
              <span className="truncate py-1">{name}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:text-blue-400 text-slate-500"
                >
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity ml-2 shrink-0"
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete ${name}?`)) onRemove(name);
                  }}
                  className="p-1 hover:text-red-400 text-slate-500"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

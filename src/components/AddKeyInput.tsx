import { Plus } from 'lucide-react';
import { useState, type SubmitEventHandler } from 'react';

interface AddKeyInputProps {
  onAdd: (key: string) => void;
  existingKeys: string[];
  placeholder?: string | undefined;
  buttonTitle?: string | undefined;
}

export default function AddKeyInput({
  onAdd,
  existingKeys,
  placeholder,
  buttonTitle,
}: AddKeyInputProps) {
  const [val, setVal] = useState('');

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (val && !existingKeys.includes(val)) {
      onAdd(val);
      setVal('');
    } else if (existingKeys.includes(val)) {
      alert('Key already exists!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 focus-within:border-blue-500 transition-all"
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none px-2 text-sm text-slate-200 w-48 placeholder:text-slate-600"
      />
      <button
        type="submit"
        className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white transition-colors"
        title={buttonTitle}
      >
        <Plus size={14} />
      </button>
    </form>
  );
}

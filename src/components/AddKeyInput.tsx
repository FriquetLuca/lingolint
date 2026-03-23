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
  const [error, setError] = useState<string | null>(null);
  const [val, setVal] = useState('');

  const validate = (val: string) => {
    if (existingKeys.includes(val)) return 'Key already exists';
    if (existingKeys.some((k) => val.startsWith(k + '.')))
      return 'Parent is a string';
    if (existingKeys.some((k) => k.startsWith(val + '.')))
      return 'Key is a parent of existing data';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setVal(v);
    setError(validate(v));
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (val.length > 0) {
      if (!error) {
        onAdd(val);
        setVal('');
      } else {
        alert(error);
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 focus-within:border-blue-500 transition-all"
    >
      <input
        value={val}
        onChange={handleChange}
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

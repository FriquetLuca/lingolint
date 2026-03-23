import { Plus } from 'lucide-react';
import { useState, type SubmitEventHandler } from 'react';
import type { ModalConfig } from './Modal';

interface AddKeyInputProps {
  onAdd: (key: string) => void;
  existingKeys: string[];
  placeholder?: string | undefined;
  buttonTitle?: string | undefined;
  setModalConfig: (config: ModalConfig) => void;
}

export default function AddKeyInput({
  onAdd,
  existingKeys,
  placeholder,
  buttonTitle,
  setModalConfig,
}: AddKeyInputProps) {
  const [error, setError] = useState<{
    key: string;
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    data?: {} | undefined;
  } | null>(null);
  const [val, setVal] = useState('');

  const validate = (val: string) => {
    if (existingKeys.includes(val))
      return {
        key: 'key_exist',
        data: {
          existingKey: val,
        },
      };
    if (existingKeys.some((k) => val.startsWith(k + '.')))
      return {
        key: 'string_parent',
        data: {
          existingKey: val,
          parentKey: existingKeys.find((k) => val.startsWith(k + '.')),
        },
      };
    if (existingKeys.some((k) => k.startsWith(val + '.')))
      return {
        key: 'is_parent',
        data: {
          existingKey: val,
        },
      };
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
        setModalConfig({
          type: 'error',
          title: 'add_key_input.error',
          message: `add_key_input.${error.key}`,
          datas: error.data,
        });
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

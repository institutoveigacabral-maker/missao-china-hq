import { useState } from 'react';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked = false, onCheckedChange, className = '' }: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
        ${isChecked ? 'bg-accent-600' : 'bg-gray-300'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
          transition-transform duration-200 ease-in-out
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

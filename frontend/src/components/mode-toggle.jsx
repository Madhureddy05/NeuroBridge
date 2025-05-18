import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ModeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleMode = () => setIsDark(prev => !prev);

  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded border hover:bg-accent transition"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

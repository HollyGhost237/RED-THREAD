import { useContext } from 'react';

export default function ThemeToggle() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    return (
        <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
        {darkMode ? '☀️' : '🌙'}
        </button>
    );
}
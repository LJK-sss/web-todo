import { useTheme } from '../theme';

/** 主题切换按钮：第一个消费 Context 的组件 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-pressed={dark}
      title={dark ? '切到浅色' : '切到深色'}
    >
      {dark ? '浅色模式' : '深色模式'}
    </button>
  );
}

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

/** 主题也存在 localStorage，但和 todos 用不同的 key */
export const THEME_KEY = 'todo.theme';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
}

/** 存的值只剩 'light' / 'dark' 两种可能，其它一律当浅色 */
export function readTheme(raw: string | null): Theme {
  return raw === 'dark' ? 'dark' : 'light';
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 惰性初始化：只在挂载时读一次存储，不随渲染变化
  const [theme, setTheme] = useState<Theme>(() =>
    readTheme(localStorage.getItem(THEME_KEY)),
  );

  // 单 Effect：主题一变，同时更新 <html data-theme> 和存储
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // value 用 useMemo 包住，主题没变时引用不变，消费者不会白重渲染
  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      setTheme: (next: Theme) => setTheme(next),
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** 组件里统一走这个 Hook，拿到 null 直接报错，比运行时莫名其妙好查 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error('useTheme 必须放在 ThemeProvider 里面使用');
  return ctx;
}

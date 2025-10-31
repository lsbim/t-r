// src/hooks/useTheme.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 기본은 'light', useEffect에서 실제 초기화
    return 'light';
  });

  const applyTheme = useCallback((t: Theme) => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', t);
    } catch {
      // localStorage 접근 불가 시 무시
    }
  }, []);

  // 마운트 시 로컬스토리지나 시스템 설정으로 동기화
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
        applyTheme(stored);
        return;
      }
    } catch {
      // localStorage 접근 실패 무시
    }

    // 저장값이 없으면 시스템 우선
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const initial = prefersDark ? 'dark' : 'light';
    // setThemeState(initial);
    // applyTheme(initial);
  }, [applyTheme]);

  // 명시적 설정 함수 (Theme 받아서 상태 + 실제 적용)
  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      applyTheme(t);
    },
    [applyTheme]
  );

  // toggle -> setThemeState의 functional updater를 사용해서 타입 에러 회피
  const toggleTheme = useCallback(() => {
    setThemeState((prev: Theme) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

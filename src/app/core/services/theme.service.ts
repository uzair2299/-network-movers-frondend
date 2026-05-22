import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'black';

const themeClassMap: Record<ThemeMode, string> = {
  light: 'theme-light',
  dark: 'theme-dark',
  black: 'theme-black'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'app-theme-mode';
  private readonly currentThemeSubject = new BehaviorSubject<ThemeMode>('light');
  theme$ = this.currentThemeSubject.asObservable();

  constructor() {
    const savedTheme = this.loadSavedTheme();
    this.applyTheme(savedTheme);
  }

  setTheme(theme: ThemeMode): void {
    console.debug('[ThemeService] setTheme:', theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  toggleTheme(): void {
    const themes: ThemeMode[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(this.currentThemeSubject.value);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.setTheme(nextTheme);
  }

  private applyTheme(theme: ThemeMode): void {
    const htmlElement = document.documentElement;
    console.debug('[ThemeService] applying theme class:', themeClassMap[theme]);
    Object.values(themeClassMap).forEach(themeClass => htmlElement.classList.remove(themeClass));
    htmlElement.classList.add(themeClassMap[theme]);
    // Force a style recalculation in some environments by toggling a data attribute
    try {
      htmlElement.dataset['themeAppliedAt'] = String(Date.now());
    } catch (e) {
      // ignore
    }
    this.currentThemeSubject.next(theme);
  }

  private loadSavedTheme(): ThemeMode {
    const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
    return stored === 'dark' ? stored : 'light';
  }

  private saveTheme(theme: ThemeMode): void {
    localStorage.setItem(this.storageKey, theme);
  }
}

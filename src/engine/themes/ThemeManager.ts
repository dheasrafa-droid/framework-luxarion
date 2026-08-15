/**
 * @file ThemeManager.ts
 * @description Coordinates theme transitions, dynamic palette morphing, and WebGL state updates.
 * Part of Luxarion Engine - Single Responsibility: Theme Management & Dispatching.
 */

import { EventDispatcher } from '../core/EventDispatcher';
import { THEME_PRESETS, LuxarionTheme } from './ThemePresets';
import { Color } from '../math/Color';

export class ThemeManager extends EventDispatcher {
  private _currentThemeId: string = 'obsidian';
  private _activeTheme: LuxarionTheme = THEME_PRESETS.obsidian;

  constructor(initialThemeId: string = 'obsidian') {
    super();
    this.setTheme(initialThemeId);
  }

  public get currentTheme(): LuxarionTheme {
    return this._activeTheme;
  }

  public get themeId(): string {
    return this._currentThemeId;
  }

  public setTheme(themeId: string): boolean {
    const theme = THEME_PRESETS[themeId];
    if (!theme) {
      console.warn(`Luxarion: Theme '${themeId}' not found.`);
      return false;
    }

    this._currentThemeId = themeId;
    this._activeTheme = theme;

    this.dispatchEvent({
      type: 'themeChanged',
      themeId,
      theme,
      backgroundColor: new Color().setHex(theme.background),
      accentColor: new Color().setHex(theme.accent)
    });

    return true;
  }

  public getAllThemes(): LuxarionTheme[] {
    return Object.values(THEME_PRESETS);
  }
}

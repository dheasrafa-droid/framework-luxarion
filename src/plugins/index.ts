/**
 * @file index.ts
 * @description Plugin architecture and extension interfaces for Luxarion Engine.
 */

import { App } from '../engine/core/App';

export interface LuxarionPlugin {
  name: string;
  version?: string;
  install: (app: App) => void;
  uninstall?: (app: App) => void;
}

export class PluginManager {
  private _plugins: Map<string, LuxarionPlugin> = new Map();

  public use(app: App, plugin: LuxarionPlugin): this {
    if (this._plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered.`);
      return this;
    }
    this._plugins.set(plugin.name, plugin);
    plugin.install(app);
    return this;
  }

  public remove(app: App, pluginName: string): boolean {
    const plugin = this._plugins.get(pluginName);
    if (!plugin) return false;
    if (plugin.uninstall) {
      plugin.uninstall(app);
    }
    return this._plugins.delete(pluginName);
  }

  public has(pluginName: string): boolean {
    return this._plugins.has(pluginName);
  }

  public list(): string[] {
    return Array.from(this._plugins.keys());
  }
}

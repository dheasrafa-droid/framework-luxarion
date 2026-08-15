/**
 * @file EventDispatcher.ts
 * @description Type-safe publish/subscribe event dispatcher for engine communication.
 * Part of Luxarion Engine - Single Responsibility: Core PubSub Event Dispatching.
 */

export type EventCallback = (event: any) => void;

export class EventDispatcher {
  private _listeners: Map<string, Set<EventCallback>> = new Map();

  public addEventListener(type: string, listener: EventCallback): this {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, new Set());
    }
    this._listeners.get(type)!.add(listener);
    return this;
  }

  public hasEventListener(type: string, listener: EventCallback): boolean {
    const set = this._listeners.get(type);
    return set ? set.has(listener) : false;
  }

  public removeEventListener(type: string, listener: EventCallback): this {
    const set = this._listeners.get(type);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        this._listeners.delete(type);
      }
    }
    return this;
  }

  public dispatchEvent(event: { type: string; [key: string]: any }): void {
    const listeners = this._listeners.get(event.type);
    if (listeners) {
      // Create a snapshot to prevent concurrent modification issues
      const snapshot = Array.from(listeners);
      for (let i = 0; i < snapshot.length; i++) {
        snapshot[i].call(this, event);
      }
    }
  }

  public removeAllListeners(type?: string): this {
    if (type) {
      this._listeners.delete(type);
    } else {
      this._listeners.clear;
    }
    return this;
  }
}

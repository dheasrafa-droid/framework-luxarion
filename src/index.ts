/**
 * ============================================================================
 * LUXARION ENGINE - MASTER LIBRARY ENTRY POINT
 * ============================================================================
 * Zero-dependency, lightweight, high-performance 2D & 3D WebGL Graphics Engine.
 * 
 * Supports both ES Modules (import) and UMD Browser globals (window.Luxarion via CDN).
 * 
 * @module Luxarion
 * @license Apache-2.0
 */

export * from './engine/Luxarion';

// Default global namespace export for UMD browser scripts
import * as Luxarion from './engine/Luxarion';
export default Luxarion;

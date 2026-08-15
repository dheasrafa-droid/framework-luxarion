/**
 * @file LightManager.ts
 * @description Light Aggregator & Uniform Buffer builder for forward rendering with multi-light support (Directional, Point, Spot, Hemisphere).
 * Part of Luxarion Engine - Lighting Subsystem.
 */

import { Light } from './Light';
import { AmbientLight } from './AmbientLight';
import { DirectionalLight } from './DirectionalLight';
import { PointLight } from './PointLight';
import { SpotLight } from './SpotLight';
import { HemisphereLight } from './HemisphereLight';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';

export interface LightingData {
  ambient: Color;
  hemiSky: Color;
  hemiGround: Color;
  hemiDirection: number[];
  hasHemi: boolean;

  dirColor: Color;
  dirDirection: number[];
  hasDir: boolean;

  pointLights: {
    color: Color;
    position: number[];
    distance: number;
  }[];

  spotLights: {
    color: Color;
    position: number[];
    direction: number[];
    distance: number;
    coneCos: number;
    penumbraCos: number;
  }[];
}

export class LightManager {
  public static collect(lights: Light[]): LightingData {
    const data: LightingData = {
      ambient: new Color(0.05, 0.05, 0.05),
      hemiSky: new Color(0, 0, 0),
      hemiGround: new Color(0, 0, 0),
      hemiDirection: [0, 1, 0],
      hasHemi: false,

      dirColor: new Color(0, 0, 0),
      dirDirection: [0, -1, 0],
      hasDir: false,

      pointLights: [],
      spotLights: []
    };

    for (let i = 0; i < lights.length; i++) {
      const l = lights[i];
      if (!l.visible) continue;

      if (l instanceof AmbientLight) {
        data.ambient.r += l.color.r * l.intensity;
        data.ambient.g += l.color.g * l.intensity;
        data.ambient.b += l.color.b * l.intensity;
      } else if (l instanceof HemisphereLight) {
        data.hasHemi = true;
        data.hemiSky.copy(l.skyColor).multiplyScalar(l.intensity);
        data.hemiGround.copy(l.groundColor).multiplyScalar(l.intensity);
        data.hemiDirection = l.direction.toArray();

        // Also blend a portion into fallback ambient
        data.ambient.r += (data.hemiSky.r * 0.5 + data.hemiGround.r * 0.3);
        data.ambient.g += (data.hemiSky.g * 0.5 + data.hemiGround.g * 0.3);
        data.ambient.b += (data.hemiSky.b * 0.5 + data.hemiGround.b * 0.3);
      } else if (l instanceof DirectionalLight) {
        data.hasDir = true;
        data.dirColor.copy(l.color).multiplyScalar(l.intensity);
        data.dirDirection = l.updateDirection().toArray();
      } else if (l instanceof PointLight) {
        data.pointLights.push({
          color: l.color.clone().multiplyScalar(l.intensity),
          position: l.position.toArray(),
          distance: l.distance
        });
      } else if (l instanceof SpotLight) {
        const dir = l.updateDirection();
        const coneCos = Math.cos(l.angle);
        const penumbraCos = Math.cos(l.angle * (1.0 - l.penumbra));

        data.spotLights.push({
          color: l.color.clone().multiplyScalar(l.intensity),
          position: l.position.toArray(),
          direction: dir.toArray(),
          distance: l.distance,
          coneCos,
          penumbraCos
        });
      }
    }

    return data;
  }
}

/**
 * @file ShaderSource.ts
 * @description Native GLSL 1.00 / 3.00 shader sources for Basic, Phong, Hologram, Wireframe, and Post-processing shaders.
 * Part of Luxarion Engine - Single Responsibility: GLSL Shader Definitions.
 */

export class ShaderSource {
  // Basic Unlit Shader
  public static readonly BASIC_VERTEX = `
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 color;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;
    varying vec3 vColor;

    void main() {
      vUv = uv;
      vColor = color;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `;

  public static readonly BASIC_FRAGMENT = `
    precision mediump float;

    uniform vec4 diffuseColor;
    uniform float opacity;
    uniform float useVertexColor;

    varying vec2 vUv;
    varying vec3 vColor;

    void main() {
      vec4 col = diffuseColor;
      if (useVertexColor > 0.5) {
        col.rgb *= vColor;
      }
      col.a *= opacity;
      gl_FragColor = col;
    }
  `;

  // Blinn-Phong Shading
  public static readonly PHONG_VERTEX = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  public static readonly PHONG_FRAGMENT = `
    precision mediump float;

    uniform vec3 ambientLightColor;
    uniform vec3 dirLightColor;
    uniform vec3 dirLightDirection;
    uniform vec3 pointLightColor;
    uniform vec3 pointLightPosition;
    uniform float pointLightDistance;

    uniform vec4 diffuseColor;
    uniform vec3 specularColor;
    uniform float shininess;
    uniform vec3 cameraPosition;
    uniform float opacity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(cameraPosition - vWorldPosition);

      // Ambient
      vec3 ambient = ambientLightColor * diffuseColor.rgb;

      // Directional Light
      vec3 L_dir = normalize(-dirLightDirection);
      float diff_dir = max(dot(N, L_dir), 0.0);
      vec3 diffuse_dir = dirLightColor * diff_dir * diffuseColor.rgb;

      vec3 H_dir = normalize(L_dir + V);
      float spec_dir = pow(max(dot(N, H_dir), 0.0), shininess);
      vec3 specular_dir = dirLightColor * spec_dir * specularColor;

      // Point Light
      vec3 L_pt = pointLightPosition - vWorldPosition;
      float dist_pt = length(L_pt);
      L_pt = normalize(L_pt);
      float attenuation = clamp(1.0 - dist_pt / max(pointLightDistance, 0.001), 0.0, 1.0);
      attenuation = attenuation * attenuation;

      float diff_pt = max(dot(N, L_pt), 0.0);
      vec3 diffuse_pt = pointLightColor * diff_pt * diffuseColor.rgb * attenuation;

      vec3 H_pt = normalize(L_pt + V);
      float spec_pt = pow(max(dot(N, H_pt), 0.0), shininess);
      vec3 specular_pt = pointLightColor * spec_pt * specularColor * attenuation;

      // Final Blended Light
      vec3 finalColor = ambient + diffuse_dir + specular_dir + diffuse_pt + specular_pt;
      gl_FragColor = vec4(finalColor, diffuseColor.a * opacity);
    }
  `;

  // Sci-Fi Hologram Shader with Fresnel Rim, Scanlines, and Glitch
  public static readonly HOLOGRAM_VERTEX = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    uniform float uTime;
    uniform float uGlitchIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      // Procedural slight pulse glitch
      if (uGlitchIntensity > 0.0) {
        float noise = sin(pos.y * 10.0 + uTime * 6.0) * 0.02 * uGlitchIntensity;
        pos.x += noise;
      }

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  public static readonly HOLOGRAM_FRAGMENT = `
    precision mediump float;

    uniform vec3 uColor;
    uniform vec3 cameraPosition;
    uniform float uTime;
    uniform float uScanlineDensity;
    uniform float uFresnelPower;
    uniform float opacity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(cameraPosition - vWorldPosition);

      // Fresnel Rim Effect (Luminous outer boundary glow)
      float NdotV = abs(dot(V, N));
      float fresnel = clamp(1.0 - NdotV, 0.0, 1.0);
      float fresnelFactor = pow(fresnel, max(uFresnelPower, 0.2));

      // Dynamic animated scanlines
      float scanDensity = max(uScanlineDensity, 5.0);
      float scanline = sin(vWorldPosition.y * scanDensity - uTime * 5.0) * 0.5 + 0.5;
      float scanlineTerm = pow(scanline, 1.4) * 0.35;

      // Internal lattice grid
      float grid = (sin(vUv.x * 24.0) * sin(vUv.y * 24.0)) * 0.2 + 0.8;

      // High-radiance volumetric glow
      vec3 glowColor = uColor * (0.85 + fresnelFactor * 1.6 + scanlineTerm);
      glowColor += vec3(0.3, 0.5, 0.7) * fresnelFactor;

      float alpha = (0.3 + fresnelFactor * 0.7 + scanlineTerm * 0.3) * grid * opacity;

      gl_FragColor = vec4(glowColor, clamp(alpha, 0.0, 1.0));
    }
  `;

  // Wireframe Matrix Shader
  public static readonly WIREFRAME_VERTEX = `
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `;

  public static readonly WIREFRAME_FRAGMENT = `
    precision mediump float;
    uniform vec4 uLineColor;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      gl_FragColor = uLineColor;
    }
  `;

  // Particle Point Shader
  public static readonly PARTICLE_VERTEX = `
    attribute vec3 position;
    attribute vec4 color;
    attribute float size;

    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    varying vec4 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = viewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  public static readonly PARTICLE_FRAGMENT = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;
      float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vColor.a;
      gl_FragColor = vec4(vColor.rgb, alpha);
    }
  `;
}

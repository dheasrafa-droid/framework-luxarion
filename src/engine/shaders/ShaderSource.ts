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

  // Normal Vector Visualization Shader
  public static readonly NORMAL_VERTEX = `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vNormal;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `;

  public static readonly NORMAL_FRAGMENT = `
    precision mediump float;
    varying vec3 vNormal;
    uniform float opacity;

    void main() {
      vec3 normColor = vNormal * 0.5 + 0.5;
      gl_FragColor = vec4(normColor, opacity);
    }
  `;

  // Quantum Wave Luminescence Shader
  public static readonly QUANTUM_VERTEX = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    uniform float uTime;
    uniform float uPhase;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      // Quantum surface interference wave
      float wave = sin(pos.x * 4.0 + uTime * 3.0 + uPhase) * cos(pos.y * 4.0 + uTime * 2.0) * 0.08;
      pos += normal * wave;
      vPosition = pos;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    }
  `;

  public static readonly QUANTUM_FRAGMENT = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uTime;
    uniform float opacity;

    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
      float pattern = sin(vPosition.y * 10.0 + uTime * 2.0) * 0.5 + 0.5;
      vec3 col = mix(uColorA, uColorB, pattern + fresnel * 0.6);
      col += vec3(fresnel * 0.8);
      gl_FragColor = vec4(col, opacity);
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

  // Textured Phong Shader with Normal Mapping & UV Tiling
  public static readonly TEXTURED_PHONG_VERTEX = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    uniform vec2 uUvScale;
    uniform vec2 uUvOffset;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv * uUvScale + uUvOffset;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  public static readonly TEXTURED_PHONG_FRAGMENT = `
    precision mediump float;

    uniform vec3 ambientLightColor;
    uniform vec3 hemiSkyColor;
    uniform vec3 hemiGroundColor;
    uniform float hasHemi;

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

    uniform sampler2D uMap;
    uniform float uHasMap;
    uniform sampler2D uNormalMap;
    uniform float uHasNormalMap;
    uniform float uNormalScale;

    uniform sampler2D uEmissiveMap;
    uniform float uHasEmissiveMap;
    uniform vec3 uEmissiveColor;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec3 N = normalize(vNormal);

      // Perturb normal with Normal Map if present
      if (uHasNormalMap > 0.5) {
        vec3 mapN = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
        mapN.xy *= uNormalScale;
        N = normalize(N + mapN);
      }

      vec3 V = normalize(cameraPosition - vWorldPosition);

      // Base diffuse color
      vec4 baseColor = diffuseColor;
      if (uHasMap > 0.5) {
        vec4 texCol = texture2D(uMap, vUv);
        baseColor *= texCol;
      }

      // Ambient & Hemisphere Lighting
      vec3 ambient = ambientLightColor * baseColor.rgb;
      if (hasHemi > 0.5) {
        float hemiTerm = dot(N, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
        vec3 hemiLight = mix(hemiGroundColor, hemiSkyColor, hemiTerm);
        ambient = hemiLight * baseColor.rgb;
      }

      // Directional Light
      vec3 L_dir = normalize(-dirLightDirection);
      float diff_dir = max(dot(N, L_dir), 0.0);
      vec3 diffuse_dir = dirLightColor * diff_dir * baseColor.rgb;

      vec3 H_dir = normalize(L_dir + V);
      float spec_dir = pow(max(dot(N, H_dir), 0.0), max(shininess, 1.0));
      vec3 specular_dir = dirLightColor * spec_dir * specularColor;

      // Point Light
      vec3 L_pt = pointLightPosition - vWorldPosition;
      float dist_pt = length(L_pt);
      L_pt = normalize(L_pt);
      float attenuation = clamp(1.0 - dist_pt / max(pointLightDistance, 0.001), 0.0, 1.0);
      attenuation = attenuation * attenuation;

      float diff_pt = max(dot(N, L_pt), 0.0);
      vec3 diffuse_pt = pointLightColor * diff_pt * baseColor.rgb * attenuation;

      vec3 H_pt = normalize(L_pt + V);
      float spec_pt = pow(max(dot(N, H_pt), 0.0), max(shininess, 1.0));
      vec3 specular_pt = pointLightColor * spec_pt * specularColor * attenuation;

      // Emissive
      vec3 emissive = uEmissiveColor;
      if (uHasEmissiveMap > 0.5) {
        emissive *= texture2D(uEmissiveMap, vUv).rgb;
      }

      vec3 finalColor = ambient + diffuse_dir + specular_dir + diffuse_pt + specular_pt + emissive;
      gl_FragColor = vec4(finalColor, baseColor.a * opacity);
    }
  `;

  // Textured Basic Unlit Shader
  public static readonly TEXTURED_BASIC_VERTEX = `
    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    uniform vec2 uUvScale;
    uniform vec2 uUvOffset;

    varying vec2 vUv;

    void main() {
      vUv = uv * uUvScale + uUvOffset;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `;

  public static readonly TEXTURED_BASIC_FRAGMENT = `
    precision mediump float;

    uniform vec4 diffuseColor;
    uniform float opacity;
    uniform sampler2D uMap;
    uniform float uHasMap;

    varying vec2 vUv;

    void main() {
      vec4 col = diffuseColor;
      if (uHasMap > 0.5) {
        col *= texture2D(uMap, vUv);
      }
      col.a *= opacity;
      gl_FragColor = col;
    }
  `;

  // Triplanar Dev-Grid Level Design Shader (Seamless World UV Mapping & Ambient Occlusion)
  public static readonly DEV_TRIPLANAR_VERTEX = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vObjectPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vObjectPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  public static readonly DEV_TRIPLANAR_FRAGMENT = `
    precision mediump float;

    uniform vec3 ambientLightColor;
    uniform vec3 hemiSkyColor;
    uniform vec3 hemiGroundColor;
    uniform float hasHemi;

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

    uniform vec2 uUvScale;
    uniform vec2 uUvOffset;
    uniform float uTriplanarMode;
    uniform float uGridScale;

    uniform sampler2D uMap;
    uniform float uHasMap;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vObjectPosition;
    varying vec2 vUv;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(cameraPosition - vWorldPosition);

      vec4 texColor = vec4(1.0);

      if (uHasMap > 0.5) {
        if (uTriplanarMode > 0.5) {
          // World Space Triplanar Mapping: 1.0 Tile = uGridScale meters (default 1.0 or 2.0)
          float scale = max(uGridScale, 0.1);
          vec2 uvX = vWorldPosition.zy / scale;
          vec2 uvY = vWorldPosition.xz / scale;
          vec2 uvZ = vWorldPosition.xy / scale;

          vec3 blend = abs(N);
          blend = pow(blend, vec3(5.0));
          blend /= (blend.x + blend.y + blend.z);

          vec4 colX = texture2D(uMap, uvX);
          vec4 colY = texture2D(uMap, uvY);
          vec4 colZ = texture2D(uMap, uvZ);

          texColor = colX * blend.x + colY * blend.y + colZ * blend.z;
        } else {
          texColor = texture2D(uMap, vUv * uUvScale + uUvOffset);
        }
      }

      vec4 baseColor = diffuseColor * texColor;

      // Realistic Sky/Ground Hemisphere Ambient
      vec3 ambient = ambientLightColor * baseColor.rgb;
      if (hasHemi > 0.5) {
        float hemiTerm = dot(N, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
        vec3 hemiLight = mix(hemiGroundColor, hemiSkyColor, hemiTerm);
        ambient = hemiLight * baseColor.rgb;
      }

      // Directional Sun Light
      vec3 L_dir = normalize(-dirLightDirection);
      float diff_dir = max(dot(N, L_dir), 0.0);
      vec3 diffuse_dir = dirLightColor * diff_dir * baseColor.rgb;

      vec3 H_dir = normalize(L_dir + V);
      float spec_dir = pow(max(dot(N, H_dir), 0.0), max(shininess, 2.0));
      vec3 specular_dir = dirLightColor * spec_dir * specularColor * 0.35;

      // Point Light with Quadratic Soft Attenuation
      vec3 L_pt = pointLightPosition - vWorldPosition;
      float dist_pt = length(L_pt);
      L_pt = normalize(L_pt);
      float attenuation = clamp(1.0 - dist_pt / max(pointLightDistance, 0.001), 0.0, 1.0);
      attenuation = attenuation * attenuation;

      float diff_pt = max(dot(N, L_pt), 0.0);
      vec3 diffuse_pt = pointLightColor * diff_pt * baseColor.rgb * attenuation;

      vec3 finalColor = ambient + diffuse_dir + specular_dir + diffuse_pt;
      gl_FragColor = vec4(finalColor, baseColor.a * opacity);
    }
  `;
}

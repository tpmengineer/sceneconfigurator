import * as THREE from 'three';

// Aluminium shader: identical lighting model to Stainless, with lighter default tones
const ALUMINIUM_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec3 viewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vViewDir = normalize(-viewPosition);
    gl_Position = projectionMatrix * vec4(viewPosition, 1.0);
  }
`;

const ALUMINIUM_FRAGMENT = `
  precision highp float;

  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform vec3 uFresnelColor;
  uniform float uRoughness;
  uniform float uFresnelPower;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);

    float dotNV = clamp(dot(n, v), 0.0, 1.0);
    float fresnel = pow(1.0 - dotNV, uFresnelPower);

    float vertical = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 pseudoEnv = mix(uBottomColor, uTopColor, vertical);
    vec3 base = mix(uBaseColor, uAccentColor, smoothstep(0.25, 0.75, vertical));

    float glossStrength = mix(32.0, 14.0, clamp(uRoughness, 0.0, 1.0));
    float gloss = pow(dotNV, glossStrength) * 0.22;

    float centerLine = exp(-pow(n.x * 6.0, 2.0)) * 0.18;
    float edgeSheen = pow(abs(n.z), 8.0) * 0.06;

    vec3 color = base;
    color = mix(color, pseudoEnv, 0.15);
    color += fresnel * uFresnelColor * 0.14;
    color += gloss * vec3(0.85);
    color += centerLine + edgeSheen;

    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Lighter defaults versus stainless steel
const DEFAULT_UNIFORMS = {
  uBaseColor: new THREE.Color('#c9cfd6'),
  uAccentColor: new THREE.Color('#e1e6eb'),
  uTopColor: new THREE.Color('#f5f7f9'),
  uBottomColor: new THREE.Color('#9ea5ae'),
  uFresnelColor: new THREE.Color('#eff3f6'),
  uRoughness: 0.34,
  uFresnelPower: 3.1,
};

function cloneUniformValue(value) {
  if (value instanceof THREE.Color) {
    return value.clone();
  }
  return value;
}

export function createAluminiumMaterial() {
  const uniforms = {};
  for (const key of Object.keys(DEFAULT_UNIFORMS)) {
    uniforms[key] = { value: cloneUniformValue(DEFAULT_UNIFORMS[key]) };
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: ALUMINIUM_VERTEX,
    fragmentShader: ALUMINIUM_FRAGMENT,
    side: THREE.DoubleSide,
    transparent: false,
  });

  material.name = 'AluminiumShader';
  return material;
}

export function applyAluminiumPreset(material, colorHex) {
  if (!material) return;

  // Tint base from provided color or default; keep overall lightness higher
  const baseColor = new THREE.Color(colorHex || '#c9cfd6');
  material.uniforms.uBaseColor.value.copy(baseColor);
  // Slightly lighter accent from base
  material.uniforms.uAccentColor.value
    .copy(baseColor)
    .lerp(new THREE.Color('#ffffff'), 0.15);
  // Keep other uniforms as defined; allow external callers to override if desired
  material.needsUpdate = true;
}

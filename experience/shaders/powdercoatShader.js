import * as THREE from 'three';

const POWDERCOAT_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec3 viewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vViewDir = normalize(-viewPosition);
    gl_Position = projectionMatrix * vec4(viewPosition, 1.0);
  }
`;

const POWDERCOAT_FRAGMENT = `
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;

  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform vec3 uFresnelColor;
  uniform float uRoughness;
  uniform float uFresnelPower;
  uniform float uNoiseStrength;
  uniform float uNoiseScale;
  uniform vec3 uLightDirection;
  uniform vec3 uShadowTint;
  uniform float uShadowStrength;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    float nx = mix(a, b, f.x);
    float ny = mix(c, d, f.x);
    return mix(nx, ny, f.y);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);

    float dotNV = clamp(dot(n, v), 0.0, 1.0);
    float fresnel = pow(1.0 - dotNV, uFresnelPower);

    float grain = (noise(vUv * uNoiseScale) - 0.5) * 2.0;
    vec3 base = uBaseColor + grain * uNoiseStrength;

    float vertical = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 pseudoEnv = mix(uBottomColor, uTopColor, vertical);
    vec3 accent = mix(base, uAccentColor, smoothstep(0.2, 0.8, vertical));

    float glossStrength = mix(6.0, 1.5, clamp(uRoughness, 0.0, 1.0));
    float gloss = pow(dotNV, glossStrength) * 0.025;

    float centerLine = exp(-pow(n.x * 6.0, 2.0)) * 0.03;
    float edgeSheen = pow(abs(n.z), 8.0) * 0.02;

    vec3 color = accent;
    color = mix(color, pseudoEnv, 0.05);
    color += fresnel * uFresnelColor * 0.03;
    color += gloss * vec3(0.12);
    color += centerLine + edgeSheen;

    vec3 lightDir = normalize(uLightDirection);
    float lambert = clamp(dot(n, lightDir), 0.0, 1.0);
    float shadowFactor = pow(1.0 - lambert, 1.4) * uShadowStrength;
    color = mix(color, uShadowTint, shadowFactor);

    color = max(color, 0.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const DEFAULT_UNIFORMS = {
  uBaseColor: new THREE.Color('#1a1b1d'),
  uAccentColor: new THREE.Color('#212327'),
  uTopColor: new THREE.Color('#24272b'),
  uBottomColor: new THREE.Color('#0c0d0f'),
  uFresnelColor: new THREE.Color('#22252a'),
  uRoughness: 0.92,
  uFresnelPower: 4.8,
  uNoiseStrength: 0.0035,
  uNoiseScale: 540.0,
  uLightDirection: new THREE.Vector3(0.22, 0.28, 1.0).normalize(),
  uShadowTint: new THREE.Color('#15171b'),
  uShadowStrength: 0.6,
};

function cloneUniformValue(value) {
  if (value instanceof THREE.Color || value instanceof THREE.Vector3) {
    return value.clone();
  }
  return value;
}

export function createPowdercoatMaterial() {
  const uniforms = {};
  for (const key of Object.keys(DEFAULT_UNIFORMS)) {
    uniforms[key] = { value: cloneUniformValue(DEFAULT_UNIFORMS[key]) };
  }

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: POWDERCOAT_VERTEX,
    fragmentShader: POWDERCOAT_FRAGMENT,
    side: THREE.DoubleSide,
    transparent: false,
  });
}

export function getPowdercoatPreset(name, colorHex) {
  const lowerName = (name ?? '').toLowerCase();
  const isPowdercoat = lowerName.includes('powdercoat');
  const isPowdercoatWhite = isPowdercoat && lowerName.includes('white');

  if (!isPowdercoat) {
    return null;
  }

  const baseColor = new THREE.Color(colorHex || '#1a1b1d');
  if (isPowdercoatWhite) {
    baseColor.multiplyScalar(0.94);
  }

  return {
    baseColor,
    accentColor: isPowdercoatWhite ? new THREE.Color('#e3e6eb') : new THREE.Color('#292c31'),
    topColor: isPowdercoatWhite ? new THREE.Color('#d8dce2') : new THREE.Color('#24272b'),
    bottomColor: isPowdercoatWhite ? new THREE.Color('#babec5') : new THREE.Color('#0c0d0f'),
    fresnelColor: isPowdercoatWhite ? new THREE.Color('#d0d4d9') : new THREE.Color('#22252a'),
    roughness: isPowdercoatWhite ? 0.94 : 0.92,
    fresnelPower: isPowdercoatWhite ? 3.0 : 4.8,
    noiseStrength: isPowdercoatWhite ? 0.002 : 0.0035,
    noiseScale: isPowdercoatWhite ? 500.0 : 540.0,
    lightDirection: new THREE.Vector3(0.22, 0.28, 1.0).normalize(),
    shadowTint: isPowdercoatWhite
      ? new THREE.Color('#b3b7bd')
      : baseColor.clone().multiplyScalar(0.55),
    shadowStrength: isPowdercoatWhite ? 0.82 : 0.68,
  };
}

export function applyPowdercoatPreset(material, preset) {
  if (!material || !preset) return;

  material.uniforms.uBaseColor.value.copy(preset.baseColor);
  material.uniforms.uAccentColor.value.copy(preset.accentColor);
  material.uniforms.uTopColor.value.copy(preset.topColor);
  material.uniforms.uBottomColor.value.copy(preset.bottomColor);
  material.uniforms.uFresnelColor.value.copy(preset.fresnelColor);
  material.uniforms.uRoughness.value = preset.roughness;
  material.uniforms.uFresnelPower.value = preset.fresnelPower;
  material.uniforms.uNoiseStrength.value = preset.noiseStrength;
  material.uniforms.uNoiseScale.value = preset.noiseScale;
  material.uniforms.uLightDirection.value.copy(preset.lightDirection).normalize();
  material.uniforms.uShadowTint.value.copy(preset.shadowTint);
  material.uniforms.uShadowStrength.value = preset.shadowStrength;
  material.needsUpdate = true;
}

export function isPowdercoatSelection(name) {
  return (name ?? '').toLowerCase().includes('powdercoat');
}

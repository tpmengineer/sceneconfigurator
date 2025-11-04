import * as THREE from 'three';

const METAL_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec3 viewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vViewDir = normalize(-viewPosition);
    gl_Position = projectionMatrix * vec4(viewPosition, 1.0);
  }
`;

const METAL_FRAGMENT = `
  precision highp float;

  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform vec3 uFresnelColor;
  uniform float uRoughness;
  uniform float uFresnelPower;
  uniform float uOrientationStrength;

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

  float glossStrength = mix(24.0, 10.0, clamp(uRoughness, 0.0, 1.0));
  float gloss = pow(dotNV, glossStrength) * 0.12;

  float centerLine = exp(-pow(n.x * 6.0, 2.0)) * 0.08;
  float edgeSheen = pow(abs(n.z), 8.0) * 0.05;

  vec3 color = base;
  color = mix(color, pseudoEnv, 0.2);

  float orientation = pow(1.0 - dotNV, 1.8);
  vec3 orientationTint = mix(base, uTopColor, orientation);
  color = mix(color, orientationTint, clamp(uOrientationStrength, 0.0, 1.0));

  color += fresnel * uFresnelColor * 0.12;
  color += gloss * vec3(0.65);
  color += centerLine + edgeSheen;

    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const DEFAULT_UNIFORMS = {
  uBaseColor: new THREE.Color('#3b4047'),
  uAccentColor: new THREE.Color('#585d66'),
  uTopColor: new THREE.Color('#8f96a0'),
  uBottomColor: new THREE.Color('#15181d'),
  uFresnelColor: new THREE.Color('#b3bac3'),
  uRoughness: 0.58,
  uOrientationStrength: 0.35,
  uFresnelPower: 2.6,
};

function cloneUniformValue(value) {
  if (value instanceof THREE.Color) {
    return value.clone();
  }
  return value;
}

export function createMetalMaterial() {
  const uniforms = {};
  for (const key of Object.keys(DEFAULT_UNIFORMS)) {
    uniforms[key] = { value: cloneUniformValue(DEFAULT_UNIFORMS[key]) };
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: METAL_VERTEX,
    fragmentShader: METAL_FRAGMENT,
    side: THREE.DoubleSide,
    transparent: false,
  });

  material.name = 'MetalShader';
  return material;
}

export function applyMetalPreset(material, colorHex) {
  if (!material) return;

  const baseColor = new THREE.Color(colorHex || '#3b4047');
  material.uniforms.uBaseColor.value.copy(baseColor);
  material.uniforms.uAccentColor.value
    .copy(baseColor)
    .lerp(new THREE.Color('#7e8082'), 0.7);
  material.needsUpdate = true;
}

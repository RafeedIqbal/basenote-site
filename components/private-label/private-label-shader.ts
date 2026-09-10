// Cloud noise adapted from the supplied animated-webgl-background.html.
// Only the cloud field is rendered: no stars, streaks, or looping time reset.
export const fragmentSource = `#version 300 es
precision highp float;
out vec4 color;
uniform vec2 resolution;
uniform float time;

float random(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 fraction = fract(p);
  vec2 blend = fraction * fraction * (3.0 - 2.0 * fraction);
  return mix(
    mix(random(cell), random(cell + vec2(1, 0)), blend.x),
    mix(random(cell + vec2(0, 1)), random(cell + 1.0), blend.x),
    blend.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 1.0;
  mat2 fold = mat2(1.0, -0.5, 0.2, 1.2);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0 * fold;
    amplitude *= 0.5;
  }
  return value;
}

float clouds(vec2 p) {
  float density = 1.0;
  float value = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    float fold = density * fbm(
      i * 10.0 + p.x * 0.2 + 0.2 * (1.0 + i) * p.y + density + i * i + p
    );
    value = mix(value, density, fold);
    density = fold;
    p *= 2.0 / (i + 1.0);
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
  // Advect the entire field together: increasing sample X moves clouds left.
  vec2 field = uv * vec2(1.65, -0.95) + vec2(time * 0.055, 0.42);
  float density = max(clouds(field), 0.0);
  float body = smoothstep(0.15, 1.45, density);
  vec3 canyonRed = vec3(0.580, 0.247, 0.176);
  vec3 desertVarnish = vec3(0.545, 0.227, 0.165);
  vec3 mojaveOchre = vec3(0.627, 0.271, 0.208);
  vec3 pigment = mix(desertVarnish, canyonRed, body);
  pigment = mix(pigment, mojaveOchre, smoothstep(0.85, 1.8, density) * 0.65);
  // Lift the soft folds while retaining deep shadows and fine wispy detail.
  vec3 cloudColor = pigment * pow(min(density, 2.4), 0.92) * 0.88;
  color = vec4(cloudColor, 1.0);
}`;

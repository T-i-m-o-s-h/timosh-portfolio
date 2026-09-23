/** Shared fullscreen vertex shader. Draws one oversized triangle. */
export const QUAD_VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/**
 * Domain-warped fBm nebula. Two warp passes give the smoke its folded,
 * non-repeating look; the final dither removes 8-bit banding in the dark areas.
 */
export const NEBULA_FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.018;

  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
  float f = fbm(p * 1.5 + 2.4 * q + vec2(1.7, 9.2) + 0.15 * t);

  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  float halo = smoothstep(0.6, 0.0, distance(p, m));

  vec3 base = vec3(0.019, 0.022, 0.038);
  vec3 violet = vec3(0.34, 0.21, 0.80);
  vec3 teal = vec3(0.00, 0.64, 0.58);

  // One warp pass leaves less fine structure, so tighten these ramps to put
  // the contrast back. Remapping costs nothing; extra octaves would.
  float body = smoothstep(0.30, 0.78, f);
  float core = pow(smoothstep(0.46, 0.92, f), 2.0);

  vec3 col = base;
  col += violet * body * 0.30;
  col += teal * core * 0.20;
  col += violet * halo * 0.10;
  col += teal * halo * core * 0.22;

  col *= smoothstep(1.15, 0.28, length(uv - 0.5));

  // Content sits on the left, so keep that side darker and let the nebula
  // build toward the right where nothing has to stay readable.
  col *= mix(0.62, 1.0, smoothstep(0.10, 0.85, uv.x));

  col *= 1.0 - u_scroll * 0.35;

  float dither = (hash(gl_FragCoord.xy + u_time) - 0.5) / 255.0;
  gl_FragColor = vec4(col + dither, 1.0);
}`;

/**
 * Particles live entirely on the GPU: each vertex carries its own seed and
 * derives position from time, so nothing is uploaded after initialisation.
 */
export const PARTICLE_VERT = `
attribute vec4 a_seed;

uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_dpr;

varying float v_alpha;
varying float v_depth;

void main() {
  float depth = a_seed.w;
  float phase = a_seed.z * 6.28318;
  float aspect = u_res.x / u_res.y;

  vec2 p = a_seed.xy;
  float t = u_time * (0.05 + depth * 0.10);

  p.x += sin(t + phase) * 0.055;
  p.y += cos(t * 0.82 + phase) * 0.042;
  p.y = fract(p.y + u_time * 0.006 * (0.35 + depth));

  vec2 d = vec2((p.x - u_mouse.x) * aspect, p.y - u_mouse.y);
  float dist = length(d);
  float force = smoothstep(0.30, 0.0, dist);
  vec2 push = normalize(d + vec2(0.0001)) * force * 0.085;
  p += vec2(push.x / aspect, push.y);

  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = (0.7 + depth * 2.6) * u_dpr * (1.0 + force * 1.8);

  v_alpha = (0.16 + depth * 0.46) * (1.0 + force * 0.9);
  v_depth = depth;
}`;

export const PARTICLE_FRAG = `
precision mediump float;

varying float v_alpha;
varying float v_depth;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.8);
  vec3 col = mix(vec3(0.55, 0.45, 1.0), vec3(0.25, 0.95, 0.88), v_depth);
  gl_FragColor = vec4(col, a * v_alpha);
}`;

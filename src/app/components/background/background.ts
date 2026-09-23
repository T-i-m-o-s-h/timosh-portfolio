import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MotionService } from '../../core/motion';
import { PointerService } from '../../core/pointer.service';
import { ScrollService } from '../../core/scroll.service';
import { NEBULA_FRAG, PARTICLE_FRAG, PARTICLE_VERT, QUAD_VERT } from './nebula.glsl';

/**
 * The nebula is low-frequency and the particles are soft glows, so neither
 * gains anything from a retina backing store, but both cost fill rate for it.
 * Rendering at CSS pixels and letting the compositor upscale is roughly three
 * times cheaper on a 2x display and visually indistinguishable.
 */
const MAX_DPR = 1;

interface Pass {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

@Component({
  selector: 'app-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas #canvas class="bg-canvas" [class.is-ready]="ready()" aria-hidden="true"></canvas>
    @if (failed()) {
      <div class="bg-fallback" aria-hidden="true"></div>
    }
    <div class="bg-grain" aria-hidden="true"></div>
  `,
  styleUrl: './background.scss',
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly pointer = inject(PointerService);
  private readonly scroll = inject(ScrollService);
  private readonly motion = inject(MotionService);

  readonly ready = signal(false);
  readonly failed = signal(false);

  private gl: WebGLRenderingContext | null = null;
  private nebula?: Pass;
  private particles?: Pass;
  private quadBuffer: WebGLBuffer | null = null;
  private seedBuffer: WebGLBuffer | null = null;
  private particleCount = 0;
  private frame = 0;
  private startedAt = 0;
  private dpr = 1;

  /** Eased pointer position in 0..1 space, y flipped for GL. */
  private mx = 0.5;
  private my = 0.5;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.init());
  }

  private init(): void {
    const canvas = this.canvasRef().nativeElement;
    const gl =
      (canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      this.failed.set(true);
      return;
    }

    this.gl = gl;

    try {
      this.nebula = this.buildPass(gl, QUAD_VERT, NEBULA_FRAG, [
        'u_res',
        'u_time',
        'u_mouse',
        'u_scroll',
      ]);
      this.particles = this.buildPass(gl, PARTICLE_VERT, PARTICLE_FRAG, [
        'u_res',
        'u_time',
        'u_mouse',
        'u_dpr',
      ]);
    } catch {
      this.failed.set(true);
      this.gl = null;
      return;
    }

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    this.resize();
    this.seedParticles();

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);

    this.startedAt = performance.now();
    this.ready.set(true);

    const win = this.doc.defaultView!;
    win.addEventListener('resize', this.onResize, { passive: true });
    this.doc.addEventListener('visibilitychange', this.onVisibility);

    if (this.motion.reduced()) {
      // One static frame still gives depth without any movement.
      this.render(0);
    } else {
      this.loop();
    }
  }

  private buildPass(
    gl: WebGLRenderingContext,
    vertSrc: string,
    fragSrc: string,
    names: readonly string[],
  ): Pass {
    const program = gl.createProgram();
    if (!program) throw new Error('program');

    gl.attachShader(program, this.compile(gl, gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(program, this.compile(gl, gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'link failed');
    }

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    for (const name of names) uniforms[name] = gl.getUniformLocation(program, name);
    return { program, uniforms };
  }

  private compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('shader');
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? 'compile failed');
    }
    return shader;
  }

  /** Each particle gets a fixed seed; the shader derives every frame from it. */
  private seedParticles(): void {
    const gl = this.gl;
    if (!gl) return;

    const canvas = this.canvasRef().nativeElement;
    const area = canvas.width * canvas.height;
    this.particleCount = Math.max(260, Math.min(1500, Math.round(area / 2600)));

    const seeds = new Float32Array(this.particleCount * 4);
    for (let i = 0; i < this.particleCount; i++) {
      seeds[i * 4 + 0] = Math.random();
      seeds[i * 4 + 1] = Math.random();
      seeds[i * 4 + 2] = Math.random();
      // Bias depth low so most particles sit far back and only a few read sharp.
      seeds[i * 4 + 3] = Math.pow(Math.random(), 1.7);
    }

    this.seedBuffer ??= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
  }

  private readonly onResize = () => {
    this.resize();
    this.seedParticles();
    if (this.motion.reduced()) this.render(performance.now() - this.startedAt);
  };

  private readonly onVisibility = () => {
    if (this.doc.hidden) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    } else if (!this.frame && !this.motion.reduced()) {
      this.loop();
    }
  };

  private resize(): void {
    const gl = this.gl;
    if (!gl) return;

    const canvas = this.canvasRef().nativeElement;
    const win = this.doc.defaultView!;
    this.dpr = Math.min(win.devicePixelRatio || 1, MAX_DPR);

    const w = Math.round(win.innerWidth * this.dpr);
    const h = Math.round(win.innerHeight * this.dpr);
    if (canvas.width === w && canvas.height === h) return;

    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  private loop = (): void => {
    this.render(performance.now() - this.startedAt);
    this.frame = requestAnimationFrame(this.loop);
  };

  private render(elapsedMs: number): void {
    const gl = this.gl;
    const nebula = this.nebula;
    const particles = this.particles;
    if (!gl || !nebula || !particles) return;

    const canvas = this.canvasRef().nativeElement;
    const win = this.doc.defaultView!;
    const time = elapsedMs / 1000;

    // Chase the pointer instead of snapping, so the halo reads as inertia.
    const tx = this.pointer.x() / win.innerWidth;
    const ty = 1 - this.pointer.y() / win.innerHeight;
    this.mx += (tx - this.mx) * 0.045;
    this.my += (ty - this.my) * 0.045;

    gl.clearColor(0.019, 0.022, 0.038, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // --- pass 1: nebula, opaque ---
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.useProgram(nebula.program);
    gl.uniform2f(nebula.uniforms['u_res'], canvas.width, canvas.height);
    gl.uniform1f(nebula.uniforms['u_time'], time);
    gl.uniform2f(nebula.uniforms['u_mouse'], this.mx, this.my);
    gl.uniform1f(nebula.uniforms['u_scroll'], this.scroll.progress());

    const quadLoc = gl.getAttribLocation(nebula.program, 'a_pos');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(quadLoc);
    gl.vertexAttribPointer(quadLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // --- pass 2: particles, additive over the nebula ---
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(particles.program);
    gl.uniform2f(particles.uniforms['u_res'], canvas.width, canvas.height);
    gl.uniform1f(particles.uniforms['u_time'], time);
    gl.uniform2f(particles.uniforms['u_mouse'], this.mx, this.my);
    gl.uniform1f(particles.uniforms['u_dpr'], this.dpr);

    const seedLoc = gl.getAttribLocation(particles.program, 'a_seed');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.seedBuffer);
    gl.enableVertexAttribArray(seedLoc);
    gl.vertexAttribPointer(seedLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, this.particleCount);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.doc.defaultView?.removeEventListener('resize', this.onResize);
    this.doc.removeEventListener('visibilitychange', this.onVisibility);
  }
}

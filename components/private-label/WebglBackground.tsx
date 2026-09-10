"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { fragmentSource } from "./private-label-shader";
import styles from "./PrivateLabel.module.css";

const vertexSource = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

export default function WebglBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const releaseTimer = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (releaseTimer.current !== null)
      window.clearTimeout(releaseTimer.current);
    const element = canvas.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let elapsedSeconds = 0;
    let dispose = () => {};
    function configure() {
      dispose();
      setReady(false);
      if (preference.matches || !element) return;
      const gl = element.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
      });
      if (!gl || gl.isContextLost()) return;
      const shaders: WebGLShader[] = [];
      let program: WebGLProgram | null = null;
      let buffer: WebGLBuffer | null = null;
      let frame = 0;
      let previousFrame: number | null = null;
      let visible = false;
      let dead = false;
      let visibilityTrigger: ScrollTrigger | undefined;
      let resize: ResizeObserver | undefined;
      function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
        previousFrame = null;
      }
      function cleanup() {
        if (dead) return;
        dead = true;
        stop();
        visibilityTrigger?.kill();
        resize?.disconnect();
        document.removeEventListener("visibilitychange", updateRunning);
        element?.removeEventListener("webglcontextlost", contextLost);
        if (buffer) gl?.deleteBuffer(buffer);
        if (program) gl?.deleteProgram(program);
        shaders.forEach((shader) => gl?.deleteShader(shader));
      }
      function contextLost(event: Event) {
        event.preventDefault();
        setReady(false);
        cleanup();
      }
      function updateRunning() {
        stop();
        if (!dead && visible && !document.hidden)
          frame = requestAnimationFrame(render);
      }
      let resolution: WebGLUniformLocation | null = null;
      let time: WebGLUniformLocation | null = null;
      function draw() {
        if (!gl || !element || dead) return;
        gl.uniform2f(resolution, element.width, element.height);
        gl.uniform1f(time, elapsedSeconds);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      function render(ms: number) {
        if (!gl || !element || dead) return;
        if (previousFrame !== null)
          elapsedSeconds += Math.min((ms - previousFrame) * 0.001, 0.1);
        previousFrame = ms;
        draw();
        if (visible && !document.hidden) frame = requestAnimationFrame(render);
      }
      try {
        function compile(type: number, source: string) {
          const shader = gl!.createShader(type);
          if (!shader) throw new Error("shader");
          shaders.push(shader);
          gl!.shaderSource(shader, source);
          gl!.compileShader(shader);
          if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS))
            throw new Error("compile");
          return shader;
        }
        program = gl.createProgram();
        if (!program) throw new Error("program");
        gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw new Error("link");
        gl.useProgram(program);
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
          gl.STATIC_DRAW,
        );
        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        resolution = gl.getUniformLocation(program, "resolution");
        time = gl.getUniformLocation(program, "time");
        const fit = () => {
          const bounds = element.getBoundingClientRect();
          // The canvas covers both the CTA and footer; cap its total GPU work.
          const scale = Math.min(
            window.devicePixelRatio,
            1.5,
            Math.sqrt(1_600_000 / Math.max(1, bounds.width * bounds.height)),
          );
          element.width = Math.max(1, Math.round(bounds.width * scale));
          element.height = Math.max(1, Math.round(bounds.height * scale));
          gl.viewport(0, 0, element.width, element.height);
          // Resizing clears the drawing buffer, even while animation is paused.
          draw();
        };
        fit();
        resize = new ResizeObserver(fit);
        resize.observe(element);
        visibilityTrigger = ScrollTrigger.create({
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            updateRunning();
          },
          onRefresh: (self) => {
            visible = self.isActive;
            updateRunning();
          },
        });
        visible = visibilityTrigger.isActive;
        stop();
        // Populate the canvas once, including when initially outside the viewport.
        // Subsequent frames run only while this section is visible.
        render(performance.now());
        document.addEventListener("visibilitychange", updateRunning);
        element.addEventListener("webglcontextlost", contextLost);
        setReady(true);
        dispose = cleanup;
      } catch {
        cleanup();
      }
    }
    configure();
    preference.addEventListener("change", configure);
    element.addEventListener("webglcontextrestored", configure);
    return () => {
      preference.removeEventListener("change", configure);
      element.removeEventListener("webglcontextrestored", configure);
      dispose();
      // Defer context release so StrictMode can immediately set up the same canvas again.
      releaseTimer.current = window.setTimeout(
        () =>
          element
            .getContext("webgl2")
            ?.getExtension("WEBGL_lose_context")
            ?.loseContext(),
        0,
      );
    };
  }, []);
  return (
    <canvas
      ref={canvas}
      className={styles.webgl}
      data-ready={ready}
      aria-hidden="true"
    />
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { LIQUID_BACKGROUND } from '@/constants';

/**
 * WebGL 기반 유체 배경 애니메이션 컴포넌트
 */
const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animationFrameId = 0;
    let time = 0;
    
    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouseEffect = (u_mouse - 0.5) * 0.3;
        
        float n1 = snoise(vec2(st.x * 1.5 + u_time * 0.05 + mouseEffect.x, st.y * 1.5 - u_time * 0.02));
        float n2 = snoise(vec2(st.x * 3.0 - u_time * 0.02, st.y * 3.0 + u_time * 0.05 + mouseEffect.y));
        float n3 = snoise(vec2(st.x * 6.0 + mouseEffect.x, st.y * 6.0 + mouseEffect.y));

        float fluid = n1 * 0.5 + n2 * 0.3 + n3 * 0.1;
        
        vec3 deepBlack = vec3(0.02, 0.02, 0.02);
        vec3 midnightBlue = vec3(0.05, 0.05, 0.1);
        vec3 mercury = vec3(0.4, 0.45, 0.5);

        vec3 color = mix(deepBlack, midnightBlue, smoothstep(-0.5, 0.2, fluid));
        color = mix(color, mercury, smoothstep(0.4, 1.0, fluid));

        float grain = fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
        color += grain * 0.03;

        float vignette = distance(st, vec2(0.5 * (u_resolution.x/u_resolution.y), 0.5));
        color *= 1.0 - vignette * 0.6;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - e.clientY / window.innerHeight; 
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const renderStaticFrame = () => {
      gl.uniform1f(timeLocation, 0);
      gl.uniform2f(mouseLocation, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const render = (timestamp: number) => {
      time = timestamp * LIQUID_BACKGROUND.TIME_MULTIPLIER;

      mouse.x += (mouse.targetX - mouse.x) * LIQUID_BACKGROUND.MOUSE_LERP;
      mouse.y += (mouse.targetY - mouse.y) * LIQUID_BACKGROUND.MOUSE_LERP;

      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const startAnimation = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(render);
    };

    const stopAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      renderStaticFrame();
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    if (mediaQuery.matches) {
      renderStaticFrame();
    } else {
      render(0);
    }

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    // Pause the rAF loop while the tab is backgrounded so we don't burn GPU.
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (!mediaQuery.matches) {
        startAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      // Release WebGL resources so Strict Mode double-mount / HMR doesn't leak.
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default LiquidBackground;

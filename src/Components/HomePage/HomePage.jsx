import React, { useEffect, useRef } from "react";
import { vertexShader, fragmentShader } from "./Shaders.jsx";
import iccLogo from "../../../public/icc-logo.png";
import iccLogo1 from "../../../public/icc-logo1.png"
import { div } from "three/tsl";

const HomePage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const config = {
      logoPath: iccLogo1,          
      logoSize: 800,
      logoColor: "#C3AB5F",
      canvasBg: "#141615",
      distortionRadius: 1500,
      forceStrength: 0.0035,
      maxDisplacement: 100,
      returnForce: 1,
    };

    // ------- STATE -------
    let canvas, gl, program;
    let particles = [];
    let positionArray, colorArray;
    let positionBuffer, colorBuffer;
    let mouse = { x: 0, y: 0 };
    let animationCount = 0;
    let raf = 0;

    // ------- HELPERS -------
    function hexToRgb(hex) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m
        ? {
            r: parseInt(m[1], 16) / 255,
            g: parseInt(m[2], 16) / 255,
            b: parseInt(m[3], 16) / 255,
          }
        : { r: 5, g: 5, b: 2 };
    }

    // ------- SETUP -------
    function setupCanvas() {
      canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function setupWebGL() {
      gl = canvas.getContext("webgl", {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: true,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      });
      if (!gl) {
        console.error("WebGL not supported");
        return;
      }
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function setupShaders() {
      const vs = compileShader(gl.VERTEX_SHADER, vertexShader);
      const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShader);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }
    }

    // ------- IMAGE → PARTICLES -------
    function loadLogo() {
      const image = new Image();
      image.onload = function () {
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");
        tempCanvas.width = config.logoSize;
        tempCanvas.height = config.logoSize;

        // center+scale the logo a bit
        const scale = 0.9;
        const size = config.logoSize * scale;
        const offset = (config.logoSize - size) / 2;
        ctx.clearRect(0, 0, config.logoSize, config.logoSize);
        ctx.drawImage(image, offset, offset, size, size);

        const imageData = ctx.getImageData(0, 0, config.logoSize, config.logoSize);
        createParticles(imageData.data);
      };
      image.src = config.logoPath; // 🔴 this is what makes particles follow the image pixels
    }

    function createParticles(pixels) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const positions = [];
      const colors = [];

      const logoTint = hexToRgb(config.logoColor);

      for (let i = 0; i < config.logoSize; i++) {
        for (let j = 0; j < config.logoSize; j++) {
          const pixelIndex = (i * config.logoSize + j) * 4;
          const alpha = pixels[pixelIndex + 3];

          if (alpha > 10) {
            const particleX = centerX + (j - config.logoSize / 2) * 1.0;
            const particleY = centerY + (i - config.logoSize / 2) * 1.0;

            positions.push(particleX, particleY);

            const originalR = pixels[pixelIndex] / 255;
            const originalG = pixels[pixelIndex + 1] / 255;
            const originalB = pixels[pixelIndex + 2] / 255;
            const originalA = pixels[pixelIndex + 3] / 255;

            colors.push(
              originalR * logoTint.r,
              originalG * logoTint.g,
              originalB * logoTint.b,
              originalA
            );

            particles.push({
              originalX: particleX,
              originalY: particleY,
              velocityX: 0,
              velocityY: 0,
            });
          }
        }
      }

      positionArray = new Float32Array(positions);
      colorArray = new Float32Array(colors);
      createBuffers();
      animate(); // start loop once we have data
    }

    function createBuffers() {
      // positions
      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.DYNAMIC_DRAW);

      // colors
      colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW);
    }

    // ------- LOOP -------
    function updatePhysics() {
      if (animationCount < 0) return;

      animationCount--;
      const radiusSquared = config.distortionRadius * config.distortionRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const currentX = positionArray[i * 2];
        const currentY = positionArray[i * 2 + 1];

        const dx = mouse.x - currentX;
        const dy = mouse.y - currentY;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < radiusSquared && dist2 > 0) {
          const force = -radiusSquared / dist2;
          const angle = Math.atan2(dy, dx);

          const dOrigin = Math.hypot(currentX - p.originalX, currentY - p.originalY);
          const forceMul = Math.max(0.1, 1 - dOrigin / (config.maxDisplacement * 2));

          p.velocityX += force * Math.cos(angle) * config.forceStrength * forceMul;
          p.velocityY += force * Math.sin(angle) * config.forceStrength * forceMul;

          // damping
          p.velocityX *= 0.82;
          p.velocityY *= 0.82;

          // spring back towards original
          const targetX =
            currentX + p.velocityX + (p.originalX - currentX) * config.returnForce / 2;
          const targetY =
            currentY + p.velocityY + (p.originalY - currentY) * config.returnForce / 2;

          const offX = targetX - p.originalX;
          const offY = targetY - p.originalY;
          const d1 = Math.hypot(offX, offY);

          if (d1 > config.maxDisplacement) {
            const excess = d1 - config.maxDisplacement;
            const scale = config.maxDisplacement / d1;
            const dampedScale = scale + (1 - scale) * Math.exp(-excess * 0.02);
            positionArray[i * 2] = p.originalX + offX * dampedScale;
            positionArray[i * 2 + 1] = p.originalY + offY * dampedScale;
            p.velocityX *= 0.7;
            p.velocityY *= 0.7;
          } else {
            positionArray[i * 2] = targetX;
            positionArray[i * 2 + 1] = targetY;
          }
        }
      }

      // upload updated positions
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positionArray);
    }

    function render() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      const bg = hexToRgb(config.canvasBg);
      gl.clearColor(bg.r, bg.g, bg.b, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (particles.length === 0) return;

      gl.useProgram(program);

      // uniforms
      const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      // attributes: position
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positionLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      // attributes: color
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      const colorLoc = gl.getAttribLocation(program, "a_color");
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, particles.length);
    }

    function loop() {
      updatePhysics();
      render();
      raf = requestAnimationFrame(loop);
    }

    function animate() {
      if (!raf) raf = requestAnimationFrame(loop);
    }

    // ------- EVENTS -------
    function setupEvents() {
      const onMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        mouse.x = (event.clientX - rect.left) * dpr;
        mouse.y = (event.clientY - rect.top) * dpr;
        animationCount = 300;
      };
      document.addEventListener("mousemove", onMove);

      const onResize = () => {
        setupCanvas();
        if (particles.length > 0) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dim = Math.sqrt(particles.length);
          for (let i = 0; i < particles.length; i++) {
            const row = Math.floor(i / dim);
            const col = i % dim;
            const rx = centerX + (col - dim / 2) * 1.0;
            const ry = centerY + (row - dim / 2) * 1.0;
            particles[i].originalX = rx;
            particles[i].originalY = ry;
            positionArray[i * 2] = rx;
            positionArray[i * 2 + 1] = ry;
          }
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, positionArray);
        }
      };
      window.addEventListener("resize", onResize);

      // cleanup
      return () => {
        document.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
      };
    }


    setupCanvas();
    setupWebGL();
    if (!gl) return;
    setupShaders();
    const cleanupEvents = setupEvents();
    loadLogo();

 
    return () => {
      cleanupEvents && cleanupEvents();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
      <canvas className="absolute top-0 left-0 w-[100vw] h-[100vh]" ref={canvasRef} />
  );
};

export default HomePage;

/*
 * 任务：颜色与呼吸节奏（uniform + 动画）
 *   1. 改 Math.sin 的系数，让缩放和颜色变得更快或更慢
 *   2. 给 g、b 两个分量换不同的相位（+ 2.0、+ 4.0），配出好看的渐变色
 *   3. 挑战：让缩放范围变成 0.2 ~ 1.0（改 0.6 + 0.4 * 这两项）
 *
 * 要点：attribute 每个顶点一个值，uniform 一次绘制中保持不变。
 */

const gl = WebGLUtils.getContext("glcanvas");

const vertexShaderSource = `
  attribute vec2 a_position;
  uniform float u_scale; // 所有顶点共享同一个缩放值
  void main() {
    gl_Position = vec4(a_position * u_scale, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec3 u_color;
  void main() {
    gl_FragColor = vec4(u_color, 1.0);
  }
`;

const program = WebGLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const positions = new Float32Array([
  0.0,  0.8,
 -0.8, -0.8,
  0.8, -0.8,
]);
WebGLUtils.createBuffer(gl, positions);

const aPosition = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

const uScale = gl.getUniformLocation(program, "u_scale");
const uColor = gl.getUniformLocation(program, "u_color");

function render(timeMs) {
  const t = timeMs * 0.001; // 毫秒 → 秒

  WebGLUtils.resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 用 sin 让缩放和颜色随时间平滑变化 ← 改这些系数和相位
  const scale = 0.6 + 0.4 * Math.sin(t * 2.0);
  const r = 0.5 + 0.5 * Math.sin(t);
  const g = 0.5 + 0.5 * Math.sin(t + 2.0);
  const b = 0.5 + 0.5 * Math.sin(t + 4.0);

  gl.uniform1f(uScale, scale);
  gl.uniform3f(uColor, r, g, b);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

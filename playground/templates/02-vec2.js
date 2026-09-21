/*
 * 任务：x、y 两个方向分别缩放
 *   uniform 可以是 vec2——一次传两个值，x、y 各缩各的。
 *   1. 改两个频率（t * 2.0 和 t * 3.0），看变形节奏的变化
 *   2. 给其中一个加相位差（如 Math.sin(t + 1.57)），观察变化
 *   3. 挑战：片元着色器加一个 uniform float u_time，
 *      在 GLSL 里用 sin(u_time) 让颜色随时间流动
 */

const gl = WebGLUtils.getContext("glcanvas");

const vertexShaderSource = `
  attribute vec2 a_position;
  uniform vec2 u_scale; // vec2：x、y 两个方向各自的缩放
  void main() {
    gl_Position = vec4(a_position * u_scale, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.65, 0.55, 0.98, 1.0); // 紫色
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

function render(timeMs) {
  const t = timeMs * 0.001;

  WebGLUtils.resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const sx = 0.4 + 0.3 * Math.sin(t * 2.0); // ← 横向伸缩节奏
  const sy = 0.4 + 0.3 * Math.sin(t * 3.0); // ← 纵向伸缩节奏
  gl.uniform2f(uScale, sx, sy);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

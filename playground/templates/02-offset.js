/*
 * 任务：让三角形动起来（uniform 平移）
 *   模板已经让三角形左右来回移动。
 *   1. 改成上下移动，或 x、y 一起变 → 斜着移动
 *   2. 用 (cos t, sin t) 当偏移量，让它沿圆形轨迹绕圈
 *      —— 圆轨迹也是参数方程：轨迹管「运动」，形状管「长相」，两回事！
 *   3. 让 u_scale 也用 sin 呼吸，边绕圈边变大变小
 */

const gl = WebGLUtils.getContext("glcanvas");

const vertexShaderSource = `
  attribute vec2 a_position;
  uniform vec2 u_offset;  // 平移量：vec2 一次传 x、y 两个值
  uniform float u_scale;
  void main() {
    gl_Position = vec4(a_position * u_scale + u_offset, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.43, 0.91, 1.0, 1.0); // 青色
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

const uOffset = gl.getUniformLocation(program, "u_offset");
const uScale = gl.getUniformLocation(program, "u_scale");

function render(timeMs) {
  const t = timeMs * 0.001;

  WebGLUtils.resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform2f(uOffset, 0.5 * Math.sin(t), 0.0); // ← 改这一行换轨迹
  gl.uniform1f(uScale, 0.35);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

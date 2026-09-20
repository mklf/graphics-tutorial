/**
 * 第 02 课：Uniforms 与动画
 *
 * 本课你将学到：
 *   1. uniform 变量 —— 从 JavaScript 传给着色器的「全局」数据
 *      （与 attribute 不同：attribute 每个顶点一个值，uniform 一次绘制中保持不变）
 *   2. 用 requestAnimationFrame 制作动画
 *   3. 正弦函数驱动的颜色与缩放变化
 */

const gl = WebGLUtils.getContext("glcanvas");

const vertexShaderSource = `
  attribute vec2 a_position;

  // uniform：本次绘制中所有顶点共享同一个值
  uniform float u_scale;

  void main() {
    // 整体缩放三角形
    gl_Position = vec4(a_position * u_scale, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  // 从 JS 传入的 RGB 颜色
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

// 获取 uniform 变量的「位置句柄」，之后通过它传值
const uScale = gl.getUniformLocation(program, "u_scale");
const uColor = gl.getUniformLocation(program, "u_color");

// ---------- 动画循环 ----------

function render(timeMs) {
  const t = timeMs * 0.001; // 毫秒 → 秒

  // 画布尺寸可能变化（如窗口缩放），每帧同步一下
  WebGLUtils.resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 用 sin 函数让缩放和颜色随时间平滑变化
  const scale = 0.6 + 0.4 * Math.sin(t * 2.0);
  const r = 0.5 + 0.5 * Math.sin(t);
  const g = 0.5 + 0.5 * Math.sin(t + 2.0);
  const b = 0.5 + 0.5 * Math.sin(t + 4.0);

  // 上传 uniform 值（1f = 一个 float，3f = 三个 float）
  gl.uniform1f(uScale, scale);
  gl.uniform3f(uColor, r, g, b);

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 请求下一帧（浏览器会在屏幕刷新前调用，通常 60 次/秒）
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// 🎯 动手试试：
// - 修改 Math.sin 的系数，改变动画速度和颜色变化节奏
// - 加一个 uniform vec2 u_offset，让三角形随时间平移
// - 用 u_scale 分别缩放 x 和 y（提示：vec2 缩放）

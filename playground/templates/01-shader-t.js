/*
 * 任务：把参数方程搬进顶点着色器
 *   attribute 不一定存「位置」——它只是每顶点一份的数据。
 *   这个模板给每个顶点存参数 t，坐标在顶点着色器里用 cos/sin 算出来。
 *
 *   1. 让半径随 t 增大（比如 r = 0.1 + a_t * 0.08），
 *      并把 JS 里 Math.PI * 2 改成 Math.PI * 6 → 螺旋线
 *   2. x、y 用不同频率（cos(3.0 * a_t)、sin(2.0 * a_t)）→ 利萨茹图形
 *   3. 加一个 uniform float u_radius，从 JS 控制整体大小
 */

const gl = WebGLUtils.getContext("glcanvas");

const vertexShaderSource = `
  attribute float a_t; // 每个顶点只存一个参数 t（不是坐标！）
  void main() {
    float r = 0.7;
    gl_Position = vec4(r * cos(a_t), r * sin(a_t), 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.45, 0.7, 1.0); // 粉色
  }
`;

const program = WebGLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// JS 只负责生成一串参数 t：0 → 2π
const SEGMENTS = 128;
const params = [];
for (let i = 0; i <= SEGMENTS; i++) {
  params.push((i / SEGMENTS) * Math.PI * 2); // ← 多绕几圈就改这里
}
WebGLUtils.createBuffer(gl, new Float32Array(params));

const aT = gl.getAttribLocation(program, "a_t");
gl.enableVertexAttribArray(aT);
gl.vertexAttribPointer(aT, 1, gl.FLOAT, false, 0, 0); // 每顶点 1 个分量

gl.clearColor(0.1, 0.1, 0.18, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.LINE_STRIP, 0, SEGMENTS + 1);

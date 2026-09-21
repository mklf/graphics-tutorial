/*
 * 任务：参数方程画圆
 *   圆写不进顶点缓冲，但可以用参数方程 x = r·cos t, y = r·sin t
 *   采样出一圈顶点，让 GPU 连成折线——采样越密越像圆。
 *
 *   1. 把 SIDES 从 6 改成 64，看折线如何逼近圆
 *   2. 让半径随 i 增大（比如 r = 0.1 + 0.6 * (i / SIDES)），
 *      再把角度范围从 Math.PI * 2 改成 Math.PI * 6 多绕几圈 → 螺旋线
 *   3. x、y 用不同频率（cos(3t)、sin(2t)），画利萨茹图形
 */

const gl = WebGLUtils.getContext("glcanvas");

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
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

const SIDES = 6; // ← 边数：改大试试
const positions = [];
for (let i = 0; i <= SIDES; i++) {
  const t = (i / SIDES) * Math.PI * 2; // 参数 t 扫过一整圈
  const r = 0.7;
  positions.push(r * Math.cos(t), r * Math.sin(t));
}
WebGLUtils.createBuffer(gl, new Float32Array(positions));

const aPosition = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

gl.clearColor(0.1, 0.1, 0.18, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.LINE_STRIP, 0, SIDES + 1);

/*
 * 任务：改一改这个三角形
 *   1. 修改 positions 里的坐标，改变三角形的形状
 *   2. 修改片元着色器里的 vec4 颜色值
 *   3. 把 gl.TRIANGLES 改成 gl.POINTS 或 gl.LINES，看画出了什么
 *
 * 这是第 01 课的最小程序：顶点着色器定位置，片元着色器定颜色。
 */

const gl = WebGLUtils.getContext("glcanvas");

// 顶点着色器：对每个顶点执行一次，决定它画在哪
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// 片元着色器：对每个像素执行一次，决定它的颜色
const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); // ← 改这里换颜色（R, G, B, A）
  }
`;

const program = WebGLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// 三角形三个顶点的坐标（裁剪空间 [-1, 1]）← 改这些数字变形状
const positions = new Float32Array([
  0.0,  0.8,   // 顶部
 -0.8, -0.8,   // 左下
  0.8, -0.8,   // 右下
]);
WebGLUtils.createBuffer(gl, positions);

const aPosition = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

gl.clearColor(0.1, 0.1, 0.18, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3); // ← 试试 gl.POINTS / gl.LINES

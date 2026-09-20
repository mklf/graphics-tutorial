/**
 * 第 01 课：Hello Triangle
 *
 * 本课你将学到 WebGL 渲染的最小完整流程：
 *   1. 编写顶点着色器（Vertex Shader）和片元着色器（Fragment Shader）
 *   2. 编译并链接着色器程序
 *   3. 把顶点数据送进缓冲区（Buffer）
 *   4. 调用 drawArrays 绘制
 *
 * WebGL 的渲染管线（简化版）：
 *   顶点数据 → 顶点着色器（决定每个顶点画在哪）
 *            → 光栅化（把三角形拆成像素）
 *            → 片元着色器（决定每个像素的颜色）
 *            → 屏幕
 */

const gl = WebGLUtils.getContext("glcanvas");

// ---------- 1. 着色器源码（GLSL 语言） ----------

// 顶点着色器：对每个顶点执行一次
// attribute 是从 JavaScript 传入的「每顶点」数据
const vertexShaderSource = `
  attribute vec2 a_position;

  void main() {
    // gl_Position 是内置输出变量：顶点在裁剪空间中的位置
    // 裁剪空间范围是 [-1, 1]，x 向右，y 向上
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// 片元着色器：对每个像素执行一次，决定它的颜色
const fragmentShaderSource = `
  // 片元着色器需要声明浮点精度
  precision mediump float;

  void main() {
    // gl_FragColor 是内置输出变量：该像素的 RGBA 颜色
    gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); // 橙色
  }
`;

// ---------- 2. 编译链接 ----------

const program = WebGLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// ---------- 3. 顶点数据 ----------

// 三角形的三个顶点（裁剪空间坐标）
const positions = new Float32Array([
  0.0,  0.8,   // 顶部
 -0.8, -0.8,   // 左下
  0.8, -0.8,   // 右下
]);

WebGLUtils.createBuffer(gl, positions);

// 告诉 WebGL 如何从缓冲区读取数据，喂给 a_position 这个 attribute
const aPosition = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(aPosition);
// 参数：位置、每顶点 2 个分量、类型 float、不归一化、步长 0（紧密排列）、偏移 0
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

// ---------- 4. 清屏并绘制 ----------

gl.clearColor(0.1, 0.1, 0.18, 1.0); // 深蓝背景
gl.clear(gl.COLOR_BUFFER_BIT);

// 参数：绘制三角形、从第 0 个顶点开始、共 3 个顶点
gl.drawArrays(gl.TRIANGLES, 0, 3);

// 🎯 动手试试：
// - 修改 positions 里的坐标，看看三角形怎么变化
// - 修改片元着色器里的 vec4 颜色值
// - 把 gl.TRIANGLES 改成 gl.POINTS 或 gl.LINES，看画出了什么

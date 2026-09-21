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
 *
 * 为什么要把着色器分成「顶点」和「片元」两个阶段？
 *   1. 运行次数完全不同：一个三角形只有 3 个顶点，却可能覆盖几十万个像素。
 *      分开后，GPU 可以用成千上万个核心同时处理这些互不依赖的像素，
 *      这正是 GPU 渲染快的根本原因。
 *   2. 职责不同：顶点着色器管「形状和位置」，片元着色器管「颜色和外观」，
 *      想换颜色只需改片元着色器，不用动几何逻辑（第 02 课就是例子）。
 *   3. 两者之间的光栅化由硬件固定完成，天然把「每顶点」和「每像素」
 *      两种计算隔开。
 *
 * 着色器的「输入参数」是什么？
 *   GLSL 的 main() 没有形参，输入输出靠特殊修饰的全局变量：
 *     attribute —— 顶点着色器的输入：JS 经缓冲区传入，每顶点一个值
 *                  （如本课的 a_position）
 *     uniform   —— 两种着色器都能读的输入：一次绘制中保持不变的全局值
 *                  （如第 02 课的 u_scale、u_color）
 *     varying   —— 片元着色器的输入：顶点着色器输出、经光栅化插值后的值
 *                  （第 03 课讲）。注意片元着色器没有 attribute，
 *                  顶点数据只能靠 varying 插值间接到达
 *   输出则是两个内置变量：顶点着色器写 gl_Position，片元着色器写 gl_FragColor。
 *
 * gl_Position 和 varying 是什么关系？
 *   两者都是顶点着色器的输出，但分工不同，由光栅化联系起来：
 *     gl_Position 管「形状」：光栅化根据三个顶点的位置算出三角形盖住
 *       哪些像素，以及每个像素受各顶点多大影响（插值权重）
 *     varying 管「数据」：要传给片元着色器的值（如颜色），光栅化会用
 *       同一组权重，把顶点处的值平滑混合到每个像素上
 *   即：gl_Position 决定插值的「权重」，varying 是被插值的「货物」。
 *   gl_Position 必写且不传给片元着色器；varying 可有可无（本课没用）。
 *
 * 其他内置输入输出变量（了解即可，后续课程用到再细讲）：
 *   gl_PointSize   —— 顶点着色器输出：画 gl.POINTS 时点的大小（像素）
 *   gl_PointCoord  —— 片元着色器输入：片元在点内的坐标 [0,1]，可画圆点
 *   gl_FrontFacing —— 片元着色器输入：该像素是否属于正面三角形
 *                     （第 06 课背面剔除用到）
 *   gl_FragData    —— 片元着色器输出（扩展）：一次写多个渲染目标
 *   WebGL2 另有 gl_FragDepth（手动写深度）、gl_VertexID / gl_InstanceID
 *   （顶点/实例自动编号），第 15 课讲
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

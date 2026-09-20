/**
 * WebGL 教学用公共工具函数
 * 用法：<script src="../../common/webgl-utils.js"></script>
 */

const WebGLUtils = {
  /**
   * 获取 WebGL 上下文并处理失败情况
   * @param {string} canvasId canvas 元素的 id
   * @returns {WebGLRenderingContext}
   */
  getContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) throw new Error(`找不到 canvas: ${canvasId}`);

    const gl = canvas.getContext("webgl");
    if (!gl) throw new Error("当前浏览器不支持 WebGL");

    // 让画布分辨率匹配显示尺寸（含高分屏）
    WebGLUtils.resizeCanvas(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    return gl;
  },

  /**
   * 让 canvas 的像素尺寸匹配 CSS 显示尺寸（适配 Retina 屏）
   */
  resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  },

  /**
   * 编译单个着色器
   * @param {WebGLRenderingContext} gl
   * @param {number} type gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER
   * @param {string} source GLSL 源码
   */
  compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`着色器编译失败: ${info}\n源码:\n${source}`);
    }
    return shader;
  },

  /**
   * 链接着色器程序（顶点 + 片元）
   * @returns {WebGLProgram}
   */
  createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = WebGLUtils.compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = WebGLUtils.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`着色器程序链接失败: ${info}`);
    }
    return program;
  },

  /**
   * 创建缓冲区并填入数据
   * @param {WebGLRenderingContext} gl
   * @param {Float32Array|Uint16Array} data
   * @param {number} target gl.ARRAY_BUFFER 或 gl.ELEMENT_ARRAY_BUFFER
   * @returns {WebGLBuffer}
   */
  createBuffer(gl, data, target = gl.ARRAY_BUFFER) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    return buffer;
  },
};

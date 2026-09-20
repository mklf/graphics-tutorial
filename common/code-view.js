/**
 * 课程源码展示组件
 *
 * 作用：在课程页面直接显示本课 main.js 的源码（含全部注释），
 * 带语法高亮和行号，让学习者不用离开页面就能对照画面读代码。
 *
 * 用法（在各课的 index.html 中）：
 *   <div id="code">源码加载中…</div>
 *   <script src="../../common/code-view.js"></script>
 *   <script>CodeView.show("main.js", document.getElementById("code"));</script>
 *
 * 注意：直接双击打开 HTML（file:// 协议）时，浏览器禁止网页读取本地文件，
 * 此时会退化为一个「点击查看源码」链接；用 http 服务（如 python3 -m http.server）
 * 或访问线上地址时则正常内嵌显示。
 */

const CodeView = {
  // 注入一次样式（深色主题，与网站配色一致）
  _injectStyle() {
    if (document.getElementById("codeview-style")) return;
    const style = document.createElement("style");
    style.id = "codeview-style";
    style.textContent = `
      .cv-box { border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; overflow: hidden; background: #12121f; }
      .cv-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 0.8rem; color: #9aa0b4; }
      .cv-header a { color: #6ee7ff; text-decoration: none; }
      .cv-header a:hover { text-decoration: underline; }
      .cv-code { margin: 0; padding: 12px 0; overflow-x: auto; font: 13px/1.7 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; counter-reset: cvline; }
      .cv-line { display: block; padding-right: 16px; white-space: pre; color: #d6deeb; tab-size: 4; }
      .cv-line::before { counter-increment: cvline; content: counter(cvline); display: inline-block; width: 2.8em; margin-right: 1.4em; text-align: right; color: #4a5165; user-select: none; }
      .cv-line:hover { background: rgba(255,255,255,0.03); }
      .cv-k { color: #6ee7ff; }   /* 关键字 */
      .cv-b { color: #a78bfa; }   /* 内置对象 / GLSL 内置函数与变量 */
      .cv-s { color: #f0b56e; }   /* 字符串（GLSL 源码也在其中） */
      .cv-n { color: #b5cea8; }   /* 数字 */
      .cv-c { color: #7f8c9f; }   /* 注释 */
      .cv-fallback { padding: 16px; color: #9aa0b4; font-size: 0.9rem; line-height: 1.8; }
      .cv-fallback a { color: #6ee7ff; }
    `;
    document.head.appendChild(style);
  },

  // JS 关键字 + GLSL 关键字/类型
  _keywords: new Set([
    "const", "let", "var", "function", "return", "if", "else", "for", "while", "do",
    "new", "typeof", "delete", "in", "of", "instanceof", "true", "false", "null",
    "undefined", "this", "class", "extends", "super", "switch", "case", "break",
    "continue", "default", "try", "catch", "finally", "throw",
    // GLSL
    "attribute", "uniform", "varying", "precision", "highp", "mediump", "lowp",
    "void", "float", "int", "bool", "vec2", "vec3", "vec4", "mat2", "mat3", "mat4",
    "sampler2D", "samplerCube", "struct", "in", "out", "inout", "discard",
  ]),

  // 常见内置标识符（GLSL 内置函数/变量以 gl_ 开头，单独用正则判断）
  _builtinRe: /^(gl_[A-Za-z0-9_]+|sin|cos|tan|abs|floor|ceil|fract|min|max|clamp|mix|step|smoothstep|length|distance|normalize|dot|cross|reflect|pow|sqrt|exp|log|texture2D|WebGLUtils|Math|Float32Array|Uint16Array|Uint32Array|requestAnimationFrame|document|window|console)$/,

  /**
   * 极简语法高亮：一遍扫描，把代码切成 注释/字符串/数字/单词 四类 token，
   * 其余原样输出。返回按行切分好的 HTML（每行一个 .cv-line）。
   */
  _highlight(code) {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // 依次匹配：行注释 | 块注释 | 字符串（含模板字符串） | 数字 | 标识符
    const tokenRe = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)/g;

    const lines = [""];
    const push = (text, cls) => {
      // token 可能跨行（块注释、模板字符串），按 \n 拆开逐行追加
      const parts = text.split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) lines.push("");
        if (!parts[i]) continue;
        const chunk = esc(parts[i]);
        lines[lines.length - 1] += cls ? `<span class="${cls}">${chunk}</span>` : chunk;
      }
    };

    let last = 0;
    let m;
    while ((m = tokenRe.exec(code))) {
      if (m.index > last) push(code.slice(last, m.index), ""); // 标点、空白等
      const [full, lineC, blockC, str, num, word] = m;
      if (lineC || blockC) push(full, "cv-c");
      else if (str) push(full, "cv-s");
      else if (num) push(full, "cv-n");
      else if (CodeView._keywords.has(word)) push(full, "cv-k");
      else if (CodeView._builtinRe.test(word)) push(full, "cv-b");
      else push(full, "");
      last = m.index + full.length;
    }
    if (last < code.length) push(code.slice(last), "");

    return lines.map((l) => `<span class="cv-line">${l}</span>`).join("");
  },

  /**
   * 读取 url 指向的源码文件，渲染进 container
   * @param {string} url 源码文件路径（一般是 "main.js"）
   * @param {HTMLElement} container 挂载点
   */
  async show(url, container) {
    CodeView._injectStyle();

    const header = `
      <div class="cv-header">
        <span>📄 ${url} —— 注释就是讲解，建议对照上方画面逐行读</span>
        <a href="${url}" target="_blank" rel="noopener">新标签页打开 →</a>
      </div>`;

    let code;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      code = await res.text();
    } catch (e) {
      // file:// 协议下浏览器禁止 fetch 本地文件，给出指引
      container.innerHTML = `
        <div class="cv-box">
          ${header}
          <div class="cv-fallback">
            直接双击打开网页时，浏览器不允许页面读取本地源码文件。<br>
            请<a href="${url}" target="_blank" rel="noopener">点击这里查看 ${url}</a>，
            或在项目根目录运行 <code>python3 -m http.server 8000</code> 后访问
            <code>http://localhost:8000/</code>。
          </div>
        </div>`;
      return;
    }

    const html = CodeView._highlight(code.replace(/\r\n/g, "\n").replace(/\n+$/, ""));
    container.innerHTML = `
      <div class="cv-box">
        ${header}
        <pre class="cv-code"><code>${html}</code></pre>
      </div>`;
  },
};

/**
 * 动手试试 · 练习场逻辑
 *
 * 左侧选题 → 中间编辑器改代码 → 右侧 iframe 实时运行。
 * 编辑器用 CDN 引入的 CodeMirror；CDN 加载失败时降级为纯 textarea。
 *
 * 新增一道题：
 *   1. 在 playground/templates/ 下放一个可直接运行的模板文件（任务写开头注释）
 *   2. 在下面 EXERCISES 数组里注册一条
 */

(function () {
  const EXERCISES = [
    { id: "01-basics",    lesson: "第 01 课 · Hello Triangle",  title: "改一改三角形",       file: "templates/01-basics.js",    task: "改坐标变形状、改颜色、换 POINTS / LINES 绘制模式" },
    { id: "01-circle",    lesson: "第 01 课 · Hello Triangle",  title: "参数方程画圆",       file: "templates/01-circle.js",    task: "边数 6 → 64 逼近圆；再试试螺旋线和利萨茹图形" },
    { id: "01-shader-t",  lesson: "第 01 课 · Hello Triangle",  title: "参数方程搬进着色器", file: "templates/01-shader-t.js",  task: "attribute 存参数 t，在顶点着色器里改公式换形状" },
    { id: "02-colors",    lesson: "第 02 课 · Uniforms 与动画", title: "颜色与呼吸节奏",     file: "templates/02-colors.js",    task: "改 sin 的系数和相位，让缩放和颜色按你的节奏变" },
    { id: "02-offset",    lesson: "第 02 课 · Uniforms 与动画", title: "让三角形动起来",     file: "templates/02-offset.js",    task: "u_offset 平移；用 (cos t, sin t) 让它绕圈——圆轨迹也是参数方程" },
    { id: "02-vec2",      lesson: "第 02 课 · Uniforms 与动画", title: "x、y 分别缩放",      file: "templates/02-vec2.js",      task: "uniform vec2 一次传两个值，两个方向不同频率地变形" },
  ];

  const els = {
    list: document.getElementById("ex-list"),
    task: document.getElementById("task"),
    status: document.getElementById("status"),
    runBtn: document.getElementById("run"),
    resetBtn: document.getElementById("reset"),
    frame: document.getElementById("preview"),
    textarea: document.getElementById("editor"),
  };

  let current = null;
  let hasError = false;
  const templateCache = {};

  // ---------- 编辑器：优先 CodeMirror，失败降级纯 textarea ----------
  // 刷新方式只有两种：⌘/Ctrl + Enter、点「▶ 运行」按钮（不做输入自动刷新）

  let cm = null;
  if (window.CodeMirror) {
    cm = CodeMirror.fromTextArea(els.textarea, {
      mode: "javascript",
      theme: "dracula",
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      tabSize: 2,
      indentUnit: 2,
      extraKeys: { "Cmd-Enter": run, "Ctrl-Enter": run },
    });
  } else {
    els.textarea.classList.add("fallback-visible");
    els.textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { // Tab 缩进而不是跳焦点
        e.preventDefault();
        els.textarea.setRangeText("  ", els.textarea.selectionStart, els.textarea.selectionEnd, "end");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    });
  }

  const getCode = () => (cm ? cm.getValue() : els.textarea.value);
  const setCode = (code) => (cm ? cm.setValue(code) : (els.textarea.value = code));

  // ---------- 左侧题目列表 ----------

  function buildList() {
    let lastLesson = "";
    for (const ex of EXERCISES) {
      if (ex.lesson !== lastLesson) {
        lastLesson = ex.lesson;
        const group = document.createElement("div");
        group.className = "ex-group";
        group.textContent = ex.lesson;
        els.list.appendChild(group);
      }
      const btn = document.createElement("button");
      btn.className = "ex-btn";
      btn.dataset.id = ex.id;
      btn.innerHTML = `<span class="ex-title">${ex.title}</span><span class="ex-task">${ex.task}</span>`;
      btn.addEventListener("click", () => select(ex.id));
      els.list.appendChild(btn);
    }
  }

  // ---------- 选题、载入模板 ----------

  async function select(id) {
    const ex = EXERCISES.find((e) => e.id === id) || EXERCISES[0];
    current = ex;
    document.querySelectorAll(".ex-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.id === ex.id);
    });
    els.task.textContent = "任务：" + ex.task;
    setCode(await loadTemplate(ex.file));
    run();
  }

  async function loadTemplate(file) {
    if (templateCache[file]) return templateCache[file];
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      templateCache[file] = text;
      return text;
    } catch (e) {
      // file:// 协议下浏览器禁止 fetch 本地文件
      return [
        "// 模板加载失败：直接双击打开（file://）时浏览器禁止读取本地文件。",
        "// 请在项目根目录运行：python3 -m http.server 8000",
        "// 或访问线上地址：https://mklf.github.io/graphics-tutorial/playground/",
      ].join("\n");
    }
  }

  // ---------- 运行：把代码写进 iframe（srcdoc 完全隔离，写崩了也不影响练习场） ----------

  function buildSrcdoc(code) {
    // 记录用户代码起始行号，报错时换算回编辑器里的行号
    let prefix = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin: 0; background: #1a1a2e; }
  canvas { width: 100vw; height: 100vh; display: block; }
  #err { position: fixed; top: 0; left: 0; right: 0; z-index: 9; display: none;
         background: #7f1d1d; color: #fff; padding: 8px 12px;
         font: 12px/1.5 ui-monospace, monospace; white-space: pre-wrap; }
</style>
</head>
<body>
<div id="err"></div>
<canvas id="glcanvas"></canvas>
<script>
  window.onerror = function (msg, src, line) {
    var offset = window.__errOffset || 0;
    var userLine = line > offset ? line - offset : line;
    var text = "出错了：" + msg + "（代码第 " + userLine + " 行附近）";
    var el = document.getElementById("err");
    el.style.display = "block";
    el.textContent = text;
    parent.postMessage({ type: "pg-error", text: text }, "*");
  };
</script>
<script src="../common/webgl-utils.js"></script>
<script>window.__errOffset = __OFFSET__;</script>
<script>
`;
    prefix = prefix.replace("__OFFSET__", String((prefix.match(/\n/g) || []).length));
    // 防止用户代码里恰好出现 </script> 提前结束脚本块
    return prefix + code.replace(/<\/script>/gi, "<\\/script>") + "\n</script>\n</body>\n</html>";
  }

  function run() {
    if (!current) return;
    hasError = false;
    els.frame.srcdoc = buildSrcdoc(getCode());
    setStatus("运行中…", "");
  }

  function setStatus(text, cls) {
    els.status.textContent = text;
    els.status.className = cls;
  }

  // iframe 加载完成且没报错 → 显示成功
  els.frame.addEventListener("load", () => {
    if (!hasError && current) {
      setStatus("✓ 运行成功 " + new Date().toLocaleTimeString(), "ok");
    }
  });

  // iframe 里的运行时错误通过 postMessage 报上来
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "pg-error") {
      hasError = true;
      setStatus(e.data.text, "err");
    }
  });

  els.runBtn.addEventListener("click", run);
  els.resetBtn.addEventListener("click", () => {
    if (!current) return;
    setCode(templateCache[current.file] || "");
    run();
  });

  // ---------- 入口 ----------

  buildList();
  const initial = new URLSearchParams(location.search).get("ex");
  select(initial || EXERCISES[0].id);
})();

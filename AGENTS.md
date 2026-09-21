# AGENTS.md

给 AI 协作者的项目说明。修改本项目前请先读完本文件。

## 项目定位

- 这是一个**面向初学者的中文图形学教程**，教学语言为 **WebGL（原生，不用框架）**
- 在线地址：https://mklf.github.io/graphics-tutorial/
- 仓库：https://github.com/mklf/graphics-tutorial （GitHub 账号 `mklf`）

## 核心设计决策（重要，勿违背）

### 学习者问答必须记录进教程

用户（学习者）在学习过程中提出的**每一个问题**都要记录到仓库根目录的 `Q&A.md`，方便回顾：

- 记录格式：按课程/主题分组，每条包含**日期、问题、解答要点**（见 `Q&A.md` 中的模板）
- 解答要用学习者能懂的语言重新整理，不是简单复制聊天记录
- 如果某个问题暴露了现有课程的讲解盲区，优先考虑把解释补充进对应课程的注释中
- `Q&A.md` 与课程代码一起提交推送，线上可见

### 不用 Three.js 等框架写示例

第 1~15 课的示例代码**必须使用原生 WebGL**，原因：

- 本教程的教学目标是**理解图形学底层原理**（渲染管线、着色器、MVP 矩阵、光照模型）
- Three.js 会把这些概念全部封装掉，违背教学初衷
- 唯一例外：大纲末尾的第 16 课是「Three.js 对照课」，让学生体会框架抽象的价值——该课应在学生已掌握原生 WebGL 后再添加

### 零构建；课程零依赖、工具页可用 CDN

- 所有页面都是**纯 HTML + JavaScript**，直接在浏览器打开即可运行，不引入 npm、打包器、框架
- **课程示例（lessons/）禁止任何第三方库**（含 CDN）：教学目标是原生 WebGL，库会把概念封装成黑盒
- **辅助工具页（如 playground/ 练习场）允许经 CDN 引入成熟库**（如 CodeMirror 编辑器），因为它们是工具而不是教学内容；但必须做 CDN 加载失败时的降级
- 故意的简单性 > 工程化的完备性

## 目录结构

```
图形学教程/
├── AGENTS.md            # 本文件
├── README.md            # 面向学习者的大纲与说明
├── Q&A.md               # 学习者问答记录（见「核心设计决策」）
├── index.html           # 首页：课程导航 + WebGL 动态背景
├── common/
│   ├── webgl-utils.js   # 公共工具：getContext / compileShader / createProgram / createBuffer / resizeCanvas
│   └── code-view.js     # 课程页源码展示：读取 main.js 并高亮渲染（含行号）
├── playground/          # 「动手试试」练习场：选题 → 在线编辑（CodeMirror CDN）→ 手动运行看效果（⌘/Ctrl+Enter 或按钮）
│   ├── index.html
│   ├── playground.js    # 题目注册表（EXERCISES）+ 编辑器 + iframe 运行器
│   └── templates/       # 每题一个可直接运行的模板，任务写在开头注释
└── lessons/
    └── NN-kebab-name/   # 每课一个目录：index.html + main.js
```

## 添加新课程的完整流程（缺一不可）

1. 在 `lessons/` 下建目录，命名格式：`NN-英文短名/`（NN 为两位课号，如 `03-attributes-interpolation`）
2. 写 `index.html`：复制已有课程的模板（含「← 返回首页」链接，引用 `../../common/webgl-utils.js` 与 `../../common/code-view.js`，页面下半部分会自动展示本课 main.js 源码）
3. 写 `main.js`，遵守下面的代码风格
4. （可选）为该课的「动手试试」在练习场加题：`playground/templates/` 下放可直接运行的模板，并在 `playground.js` 的 `EXERCISES` 里注册
5. **在 `index.html` 首页的 `parts` 数组中注册该课**：填 `num/title/desc/link`，并把 `ready` 从 `false` 改为 `true`
6. 同步更新 `README.md` 中的大纲表格（如果内容有变化）
7. 提交并推送（见下方「部署」），线上约 1 分钟自动更新

## 代码风格约定

- **全中文注释**，假设读者是零基础：每段代码解释「在做什么」和「为什么」
- 每课 `main.js` 开头用块注释说明本课知识点（参照 01/02 课的格式）
- 每课结尾必须有 `🎯 动手试试：` 练习清单（3 个左右由易到难的修改建议）
- GLSL 着色器源码以内联模板字符串写在 main.js 中，方便对照阅读
- 画布尺寸 640×480，深蓝背景 `#1a1a2e` 系（与首页风格一致）
- 页面左上角固定「← 返回首页」链接（`../../index.html`）
- 课程页布局：上方画布展示运行效果，下方用 `common/code-view.js` 内嵌展示本课 `main.js` 源码（讲解写在注释里，学习者对照着看）
- 优先复用 `common/webgl-utils.js`，不要在课程里重复造工具函数；若某工具只在进阶课需要，直接写在该课内并注释说明

## 课程大纲状态

已完成：01（Hello Triangle）、02（Uniforms 与动画）
计划中：03 属性与插值、04 纹理贴图、05 变换矩阵、06 立方体、07 相机与投影、08 第一人称漫游、09 漫反射、10 Phong、11 多光源、12 FBO 后处理、13 阴影、14 天空盒、15 WebGL2、16 Three.js 对照课（见上方决策）

## 部署

- GitHub Pages 从 `main` 分支根目录发布，**`git push` 即部署**，无需 CI
- 仓库 remote 使用 SSH 别名：`git@github.com-mklf:mklf/graphics-tutorial.git`（本机 GitHub 账号是 mklf；SSH 配置在 `~/.ssh/config` 的 `github.com-mklf` 主机项）
- 本地预览：`python3 -m http.server 8000`，访问 `http://localhost:8000/`

## 验证要求

- 改完 JS 后运行 `node --check <file>` 做语法检查
- 提交前确认：首页能打开、新课程页能打开、`ready` 标志和链接正确

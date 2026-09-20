# AGENTS.md

给 AI 协作者的项目说明。修改本项目前请先读完本文件。

## 项目定位

- 这是一个**面向初学者的中文图形学教程**，教学语言为 **WebGL（原生，不用框架）**
- 在线地址：https://mklf.github.io/graphics-tutorial/
- 仓库：https://github.com/mklf/graphics-tutorial （GitHub 账号 `mklf`）

## 核心设计决策（重要，勿违背）

### 不用 Three.js 等框架写示例

第 1~15 课的示例代码**必须使用原生 WebGL**，原因：

- 本教程的教学目标是**理解图形学底层原理**（渲染管线、着色器、MVP 矩阵、光照模型）
- Three.js 会把这些概念全部封装掉，违背教学初衷
- 唯一例外：大纲末尾的第 16 课是「Three.js 对照课」，让学生体会框架抽象的价值——该课应在学生已掌握原生 WebGL 后再添加

### 零构建、零依赖

- 所有课程都是**纯 HTML + JavaScript**，直接在浏览器打开即可运行
- 不引入 npm、打包器、框架（教学示例内也不允许 CDN 引入库，common/ 下的手写工具库除外）
- 故意的简单性 > 工程化的完备性

## 目录结构

```
图形学教程/
├── AGENTS.md            # 本文件
├── README.md            # 面向学习者的大纲与说明
├── index.html           # 首页：课程导航 + WebGL 动态背景
├── common/
│   └── webgl-utils.js   # 公共工具：getContext / compileShader / createProgram / createBuffer / resizeCanvas
└── lessons/
    └── NN-kebab-name/   # 每课一个目录：index.html + main.js
```

## 添加新课程的完整流程（缺一不可）

1. 在 `lessons/` 下建目录，命名格式：`NN-英文短名/`（NN 为两位课号，如 `03-attributes-interpolation`）
2. 写 `index.html`：复制已有课程的模板（含「← 返回首页」链接，引用 `../../common/webgl-utils.js`）
3. 写 `main.js`，遵守下面的代码风格
4. **在 `index.html` 首页的 `parts` 数组中注册该课**：填 `num/title/desc/link`，并把 `ready` 从 `false` 改为 `true`
5. 同步更新 `README.md` 中的大纲表格（如果内容有变化）
6. 提交并推送（见下方「部署」），线上约 1 分钟自动更新

## 代码风格约定

- **全中文注释**，假设读者是零基础：每段代码解释「在做什么」和「为什么」
- 每课 `main.js` 开头用块注释说明本课知识点（参照 01/02 课的格式）
- 每课结尾必须有 `🎯 动手试试：` 练习清单（3 个左右由易到难的修改建议）
- GLSL 着色器源码以内联模板字符串写在 main.js 中，方便对照阅读
- 画布尺寸 640×480，深蓝背景 `#1a1a2e` 系（与首页风格一致）
- 页面左上角固定「← 返回首页」链接（`../../index.html`）
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

# 图形学教程（WebGL 版）

以 WebGL 为教学语言的图形学入门教程。直接在浏览器中运行，无需安装任何环境。

**在线访问（GitHub Pages）：https://mklf.github.io/graphics-tutorial/**

## 快速开始

本教程所有课程都是纯 HTML + JavaScript，不需要构建工具。

```bash
# 在本目录下启动一个静态服务器
python3 -m http.server 8000
```

然后浏览器打开：`http://localhost:8000/lessons/01-hello-triangle/`

> 也可以直接双击各课程目录下的 `index.html` 用浏览器打开。

## 教程大纲

### 第一部分：WebGL 基础

| 课程 | 主题 | 内容 |
|------|------|------|
| 01 | Hello Triangle | 渲染管线初识：着色器、缓冲区、画第一个三角形 |
| 02 | Uniforms 与动画 | uniform 变量、用时间驱动颜色变化 |
| 03 | 属性与插值 | 顶点颜色、varying 变量、光栅化插值 |
| 04 | 纹理贴图 | 加载图片、UV 坐标、纹理采样 |

### 第二部分：进入三维

| 课程 | 主题 | 内容 |
|------|------|------|
| 05 | 变换矩阵 | 平移 / 旋转 / 缩放，模型矩阵 |
| 06 | 画一个立方体 | 索引缓冲、深度测试 |
| 07 | 相机与投影 | 视图矩阵、透视投影、MVP 矩阵 |
| 08 | 第一人称漫游 | 键盘鼠标控制相机 |

### 第三部分：光照与材质

| 课程 | 主题 | 内容 |
|------|------|------|
| 09 | 法线与漫反射 | Lambert 光照模型 |
| 10 | 高光与 Phong | 完整 Phong 光照：环境光 + 漫反射 + 镜面高光 |
| 11 | 多光源 | 点光源、平行光、聚光灯 |

### 第四部分：进阶专题

| 课程 | 主题 | 内容 |
|------|------|------|
| 12 | 帧缓冲与后处理 | FBO、离屏渲染、模糊/边缘检测 |
| 13 | 阴影 | Shadow Map |
| 14 | 天空盒与环境 | Cube Map |
| 15 | WebGL2 速览 | VAO、3D 纹理、实例化渲染 |

## 目录结构

```
图形学教程/
├── README.md            # 本文件
├── Q&A.md               # 学习过程中的问答记录
├── AGENTS.md            # 给 AI 协作者的项目说明
├── common/
│   └── webgl-utils.js   # 公共工具函数（着色器编译、画布自适应等）
└── lessons/
    ├── 01-hello-triangle/
    ├── 02-uniforms-animation/
    └── ...              # 后续课程按大纲逐步添加
```

## 学习建议

1. 每课先跑起来看效果，再逐行读代码（注释很详细）
2. 动手改参数：颜色、速度、顶点坐标……观察变化
3. 遮住代码自己重写一遍，卡住再回头看

## 参考资源

- [WebGL Fundamentals](https://webglfundamentals.org/)（最推荐的配套阅读）
- [MDN WebGL 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)
- 《交互式计算机图形学》（Angel & Shreiner）

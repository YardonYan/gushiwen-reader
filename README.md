<p align="center">
  <img src="docs/images/banner-v2.webp" alt="古诗文读本横幅，范宽《溪山行旅图》" width="100%">
</p>

<h1 align="center">古诗文读本</h1>

<p align="center">
  广东中考 · 初中必背古诗文 · 课堂投屏与逐字逐词解读<br>
  <a href="https://gushiwen-reader-x7alhjqexlp.qoder.zone">公网预览</a>
  ·
  <a href="https://github.com/YardonYan/gushiwen-reader">GitHub 仓库</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML-CSS-JavaScript-111917?style=flat-square" alt="HTML CSS JavaScript">
  <img src="https://img.shields.io/badge/%E7%AF%87%E7%9B%AE-105-bd5842?style=flat-square" alt="105 篇">
  <img src="https://img.shields.io/badge/%E8%AE%B8%E5%8F%AF-MIT-356c5e?style=flat-square" alt="MIT License">
</p>

一个面向学生自学、教师备课和课堂投屏的古诗文读本。每篇作品独占一页，原文可以逐字逐词点击，疑难字显示拼音，整句可以展开释义与译文，并配有全文翻译、整体理解和考点辨误。

界面以课堂观看为第一场景：减少固定装饰和重复工具，让篇名、原文、句解与点击反馈尽快进入首屏。手机、平板和讲台投屏使用同一套内容与交互，不另做简化版。

## 界面预览

| 桌面目录 | 平板阅读 | 投屏阅读 |
| :---: | :---: | :---: |
| <img src="docs/images/catalog-desktop.webp" alt="桌面端篇目目录" width="100%"> | <img src="docs/images/reader-tablet.webp" alt="平板端《观沧海》阅读页" width="100%"> | <img src="docs/images/reader-desktop.webp" alt="投屏端《观沧海》阅读页" width="100%"> |

| 手机目录 | 手机阅读 | 逐词释义 |
| :---: | :---: | :---: |
| <img src="docs/images/catalog-mobile.webp" alt="手机端篇目目录" width="100%"> | <img src="docs/images/reader-mobile.webp" alt="手机端《观沧海》阅读页" width="100%"> | <img src="docs/images/word-detail.webp" alt="点击“碣石”显示拼音、字义与详解" width="100%"> |

## 项目背景

灵感来自日常学习中的三个问题：必背篇目分散、疑难字缺少读音、译文与原文对不上。读本把《义务教育语文课程标准（2022年版）》7—9 年级推荐篇目、统编教材篇目和广东卷考查记录放在同一套目录中，按年级与体裁编排。

目前收录 **105 篇**，其中诗 56 篇、词 18 篇、曲 4 篇、文 27 篇。

| 分类 | 数量 | 说明 |
| :--- | ---: | :--- |
| 课标推荐 | 62 | 依据 2022 年版课标 7—9 年级推荐篇目整理 |
| 教材增补 | 43 | 补齐统编教材要求掌握的作品 |
| 广东卷考过 | 18 | 单独标记实际年份与题型，与上述两类交叉 |

“广东卷考过”不是频率估算。标签直接来自目录中记录的考查年份和题型，例如“2025 理解性默写”“2023 情境化默写”。

## 主要功能

- **逐字逐词释义**：点击原文中的字或词，打开注音、字义、详解和易错提醒；选中状态使用柔和底色与下划线，不用红圈遮挡文字。
- **整句解读**：点击句首序号，查看整句释义、译文和赏析。
- **全文翻译与整体理解**：帮助学生从字词进入篇章，也方便教师备课。
- **年级真实画作**：七年级上、下册，八年级上、下册，九年级上、下册各配一幅公有领域山水画，按季节、行旅、江雪、岳阳楼与送别意境匹配；图下标注作者、作品名和画面说明。
- **背诵默写**：支持隐藏提示、逐空输入、错字标记、显示答案、重置和完成印章。
- **原文搜索**：可按篇名、作者、朝代或任意一句诗文搜索。
- **组合筛选**：按年级、体裁、课标推荐、教材增补和广东卷考查筛选。
- **阅读设置**：拼音有关闭、难字、全部三档；字号有五档；墨夜与宣纸主题可切换并本地保存。
- **课堂投屏**：默认宣纸主题，正文采用大字号规范宋体；短屏桌面自动收紧留白，优先保证原文完整可见。
- **三端同步**：手机、平板与投屏保留相同的搜索、释义、句解、默写和考点功能。

## 阅读示例

点击《观沧海》中的“碣石”，可以看到 `jié shí` 的读音、词义、字形解释，以及碣石山与曹操北征乌桓的背景。

句首编号用于展开整句释义。例如“树木丛生，百草丰茂”会显示“岛上树木繁茂，百草丰美”，并说明秋景中草木繁盛与诗人昂扬心境的关系。

## 视觉与排版

整体采用“课堂讲笺 + 青绿山水”的方向：

- 目录按年级排列，编号使用清晰的宋体徽章，不把篇目做成等权卡片墙。
- 单篇阅读以紧凑篇头、作者信息、原文和句解为主体，山水图片只作为辅助识别。
- 宣纸主题适合明亮教室，是默认主题；墨夜主题保留给低光环境。两套主题都按年级配置阅读强调色与释义底色，不是简单换色。
- 展开的释义卡片沿用当前年级的柔和底色与左侧强调线，字词点击后只保留浅色高亮和内侧下划线，文字始终完整可见。
- 正文统一使用本地规范宋体栈：`Songti SC`、`STSong`、`Noto Serif CJK SC`、`Source Han Serif SC`、`SimSun`，并以 600 字重增强投影辨识度；不请求外部字体服务。
- 目录编号放大为 36—40px 徽章；句首序号统一为两位数，保持 44×44px 可点击区域。

### 六册年级配画

六幅画作均选自公有领域，不使用卡通、动漫或 AI 生成图片。阅读页会显示作品名、作者和一句意境说明，并可跳转到 Wikimedia Commons 查看原图与授权信息。

![六册真实山水画与页面标注总览](docs/images/paintings-overview.webp)

| 七年级上 | 七年级下 | 八年级上 |
| :---: | :---: | :---: |
| <img src="web/assets/images/paintings/guo-xi-early-spring.webp" alt="郭熙《早春图》局部" width="100%"> | <img src="web/assets/images/paintings/dong-yuan-xiao-xiang.webp" alt="董源《潇湘图》局部" width="100%"> | <img src="web/assets/images/paintings/fan-kuan-travelers.webp" alt="范宽《溪山行旅图》局部" width="100%"> |
| [郭熙《早春图》](https://commons.wikimedia.org/wiki/File:Guo_Xi_-_Early_Spring_(large).jpg)<br>北宋 · 春山复苏 | [董源《潇湘图》](https://commons.wikimedia.org/wiki/File:Xiao_and_Xiang_rivers.jpg)<br>五代 · 江南平远 | [范宽《溪山行旅图》](https://commons.wikimedia.org/wiki/File:Travelers_Among_Mountains_and_Streams.png)<br>北宋 · 巨峰行旅 |

| 八年级下 | 九年级上 | 九年级下 |
| :---: | :---: | :---: |
| <img src="web/assets/images/paintings/xia-gui-snow-stream.webp" alt="夏圭《雪溪放牧图》局部" width="100%"> | <img src="web/assets/images/paintings/xia-yong-yueyang-tower.webp" alt="夏永《岳阳楼图》局部" width="100%"> | <img src="web/assets/images/paintings/guan-tong-mountain-pass.webp" alt="关仝《关山行旅图》局部" width="100%"> |
| [夏圭《雪溪放牧图》](https://commons.wikimedia.org/wiki/File:%E5%A4%8F%E5%9C%AD%E9%9B%AA%E6%BA%AA%E6%94%BE%E7%89%A7%E5%9B%BE%E9%A1%B5.png)<br>南宋 · 江雪归牧 | [夏永《岳阳楼图》](https://commons.wikimedia.org/wiki/File:XiaYong-YueYangLou.jpg)<br>元 · 岳阳楼阁 | [关仝《关山行旅图》](https://commons.wikimedia.org/wiki/File:Guan_Tong_-_Travelers_in_a_Mountain_Pass.jpg)<br>五代 · 关山送远 |

封面与页脚另引范宽《溪山行旅图》、郭熙《早春图》和王希孟《千里江山图》。所有画作均为公有领域作品，图片已本地压缩与裁切，不依赖外部图片服务。

## 屏幕适配

| 场景 | 常见尺寸 | 布局重点 |
| :--- | :--- | :--- |
| 手机 | 320—430px | 单行顶栏、设置收进弹出面板、正文减少左右留白，并保留年级配画 |
| 平板 | 768—834px | 保留篇头山水与完整工具栏，正文保持大字号 |
| 桌面与投屏 | 1024—1440px | 正文优先进入首屏，1366×768 等短屏自动收紧间距 |

主要操作保持至少 44×44px 的可点击尺寸。字号调到“特大”时，手机端不产生横向溢出；目录与阅读页均使用流式布局，不为每种设备单独维护内容。

## 本地运行

需要 Node.js 18 或更高版本。项目没有第三方依赖，不需要安装包。

```bash
git clone https://github.com/YardonYan/gushiwen-reader.git
cd gushiwen-reader
npm start
```

打开终端输出的地址，默认是：

```text
http://127.0.0.1:4173
```

如需修改端口：

```bash
PORT=8080 npm start
```

## 静态部署

`web/` 就是完整静态站点，可以直接部署到 GitHub Pages、Netlify、Vercel、Cloudflare Pages 或任意静态服务器。

- 入口文件：`web/index.html`
- 路由使用 URL Hash，不需要配置 SPA 重写。
- 运行时的样式、脚本、诗文数据和图片全部位于 `web/` 内。
- 页脚仅保留画作来源链接，不请求外部 API。

## 目录结构

```text
.
├─ web/
│  ├─ index.html
│  ├─ assets/
│  │  ├─ css/
│  │  │  ├─ site.css
│  │  │  └─ curation.css
│  │  ├─ js/
│  │  │  ├─ app.js
│  │  │  ├─ reader.js
│  │  │  ├─ dictation.js
│  │  │  └─ motif.js
│  │  └─ images/
│  │     ├─ paintings/
│  │     │  └─ 六幅本地 WebP 画作
│  │     └─ 封面与页脚古画
│  └─ data/
│     ├─ catalog.json
│     ├─ source.json
│     └─ pieces/
├─ docs/
│  └─ images/
├─ scripts/
│  └─ serve.mjs
├─ LICENSE
├─ package.json
└─ README.md
```

## 数据说明

- `catalog.json`：目录、年级、体裁、课标或教材分类、广东卷考查记录。
- `source.json`：原文底本，用于全文搜索与完整性校验。
- `pieces/<id>.json`：单篇的作者介绍、创作背景、逐词解释、句子翻译、全文翻译、整体理解和考点。

原文有明确的一致性约束：把 `lines[].t[].w` 依次拼接并移除空白后，必须与 `source.json` 对应文本完全一致，包括标点。当前 105 篇均已通过该校验。

## 技术特点

- 原生 HTML、CSS 和 ES Modules，无框架、无构建步骤。
- Hash 路由：`#/` 为目录，`#/p/<id>` 为单篇。
- 异步搜索与路由切换带版本检查，避免旧请求覆盖新结果。
- 设置保存在浏览器 `localStorage`，不需要账号或后端。
- 支持减少动态效果的系统偏好与打印样式。

## 开发方式

本项目由 Qoder AI Coding 助手协作完成，涵盖篇目资料整理、内容编写、前端实现、静态校验与浏览器回归。项目本身不调用 AI 服务，不需要模型、API Key 或后端；使用者直接读取仓库中的诗文数据和解读内容。

## 版权说明

本项目中的诗歌、文言文原文、教材编排及相关内容并非本项目作者所有，相关权利归原作者或相应权利人所有。作者仅出于学习和交流态度制作本站，内容仅供学习及教师课程讲解、投影演示使用，不主张内容版权。

仓库中的原创代码、README 与视觉编排采用 [MIT License](LICENSE)。古诗文原文与公有领域画作不因该许可证产生新的权利主张。

画作来源：

- [郭熙《早春图》](https://commons.wikimedia.org/wiki/File:Guo_Xi_-_Early_Spring_(large).jpg)
- [董源《潇湘图》](https://commons.wikimedia.org/wiki/File:Xiao_and_Xiang_rivers.jpg)
- [范宽《溪山行旅图》](https://commons.wikimedia.org/wiki/File:Travelers_Among_Mountains_and_Streams.png)
- [夏圭《雪溪放牧图》](https://commons.wikimedia.org/wiki/File:%E5%A4%8F%E5%9C%AD%E9%9B%AA%E6%BA%AA%E6%94%BE%E7%89%A7%E5%9B%BE%E9%A1%B5.png)
- [夏永《岳阳楼图》](https://commons.wikimedia.org/wiki/File:XiaYong-YueYangLou.jpg)
- [关仝《关山行旅图》](https://commons.wikimedia.org/wiki/File:Guan_Tong_-_Travelers_in_a_Mountain_Pass.jpg)
- [王希孟《千里江山图》](https://commons.wikimedia.org/wiki/File:Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._(Complete,_51,3x1191,5_cm)._1113._Palace_museum,_Beijing.jpg)

# 丝路商贸 Demo

[打开在线演示](https://shenjiaxing.github.io/silkroute-trade-demo/)

演示以中国大陆至新加坡的企业采购为例。可以在右上角切换采购方与供货方，体验同一笔订单的两个视角。

## 体验流程

1. 打开采购市场的「对比费用明细」，比较两家供应商的同规格螺栓。更改采购数量可重新计算货款、运费、税费、服务费和送仓费。
2. 采用一份报价并生成采购单。订单页也提供一个缺少装箱单的样例，方便直接查看清关流程。
3. 在订单里生成并下载样例发票和装箱单，发起委托。用演示按钮推进出口放行、进口放行，最后记录签收和实际费用。
4. 也可以先发布采购需求，切换为供货方提交报价，再切回采购方采用报价。供货方可以发布或编辑商品，变更会显示在采购市场。

企业、报价、单证与清关结果均为样例。数据只保存在当前浏览器，换设备会看到初始样例。网站使用 GitHub Pages，直接提供静态文件。

## 本地运行

在仓库目录运行 `python3 -m http.server 8792 --bind 127.0.0.1`，打开 `http://127.0.0.1:8792/`。无需安装依赖或配置 API 密钥。

## 演示配图

`assets/port.webp`、`assets/fasteners.webp`、`assets/cartons.webp`、`assets/pallets.webp` 和 `assets/tape.webp` 来自内置图像生成工具。商品图从同一张四格商品摄影图裁出，并以 WebP 存储。

<details>
<summary>图像生成提示词</summary>

港口封面

> Photorealistic editorial photograph for the right half of a Chinese B2B trade dashboard hero banner, landscape. Elevated aerial oblique view of a Singapore-style maritime container terminal, looking diagonally across a loaded dark-green container vessel, stacks of ochre and rust containers, blue-green water and distinctive tall quayside gantry cranes. Put fascinating cranes and most of the sharply rendered container ship in the middle and right. Clean, restrained international logistics annual-report photography, atmospheric overcast sunlight with subtle warm highlights, dark teal water, muted green and amber cargo, realistic scale. Photograph only, no UI, no words, no logos, no numbered labels legible, no added illustration. Composition should still work cropped to a wide 2.3:1 strip around the vertical center.

商品摄影

> A realistic e-commerce catalog photography contact sheet for a B2B industrial supply website. Strict 2 by 2 grid, exact equal quadrants, edge-to-edge, no divider or gutters, landscape 3:2 overall. Each quadrant has its own seamless very light warm gray stone studio tabletop and is a distinct three-quarter-view product photo. Top left: neatly arranged stainless steel hex bolt fasteners with threaded silver bolts and hex nuts. Top right: a stack of closed unprinted corrugated kraft shipping cartons with one smaller closed brown carton in front. Bottom left: a small stack of two durable black or charcoal industrial plastic pallets, with visible molded grid top and clean holes. Bottom right: three horizontal rolls of tan kraft packing tape with brown cardboard cores. Center each subject within its own quadrant with generous safe margin on all sides, product uses 65 percent of that quadrant, soft shadow, physical details and genuine rich texture. Four clearly distinct products, no people, no text, no lettering, no logos, no watermarks, no graphic decoration.

</details>

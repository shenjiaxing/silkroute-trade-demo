# 一带一路国际总商会 · 跨境采购演示

[打开在线演示](https://shenjiaxing.win/silkroute-trade-demo/)

演示以中国大陆至新加坡的企业采购为例。「演示身份」可切换采购方与供货方。桌面端在侧栏，手机端在顶部。

## 体验流程

1. 打开采购市场的「对比费用明细」，比较两家供应商的同规格螺栓。更改采购数量可重新计算货款、运费、税费、服务费和送仓费。
2. 采用一份报价并生成采购单。订单页也提供一个缺少装箱单的样例，方便直接查看清关流程。
3. 在订单里生成并下载样例发票和装箱单，发起委托。用演示按钮推进出口放行、进口放行，最后记录签收和实际费用。
4. 也可以先发布采购需求，切换为供货方提交报价，再切回采购方采用报价。供货方可以发布或编辑商品，变更会显示在采购市场。

企业、报价、单证与清关结果均为样例。数据只保存在当前浏览器，换设备会看到初始样例。网站使用 GitHub Pages，直接提供静态文件。

## 本地运行

在仓库目录运行 `python3 -m http.server 8792 --bind 127.0.0.1`，打开 `http://127.0.0.1:8792/`。无需安装依赖或配置 API 密钥。

## 设计参考与素材许可

- [Impeccable](https://github.com/pbakaus/impeccable) 的工作台布局原则用于组织货源清单、到货费用和订单动线。
- [Anthropic Frontend Design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) 的行业视觉与排版建议用于蓝灰色系统和运输线路的表达。
- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) 用于检查键盘焦点、布局及数字对齐。
- 线路照片由 KimonBerlin 拍摄，缩放转为 WebP，页面按布局裁切。照片采用 [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。[原始照片](https://commons.wikimedia.org/wiki/File:Container_port_(12848714813).jpg)
- 金额数字使用 Barlow Semi Condensed，许可见 [SIL Open Font License](assets/Barlow-OFL.txt)。

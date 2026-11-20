import { categories, documents, landed, milestones, OWN_COMPANY, OWN_SUPPLIER, quoteFromProduct, SITE_NAME, specKey, unitOptions } from './trade.js';

const icons = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  box: '<path d="M21 8v8a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.7l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12m-4.5-7.7 9 5.2"/>',
  route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M9 6h7a3 3 0 0 1 0 6h-8a3 3 0 0 0 0 6h7"/>',
  list: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  truck: '<path d="M3 5h12v12H3zM15 9h4l3 4v4h-7m-12 0h2m15 0h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  file: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 13h6m-6 4h6"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/>',
  shield: '<path d="M12 3c2 2 5 3 8 3v6c0 4.5-3.5 7.5-8 9-4.5-1.5-8-4.5-8-9V6c3 0 6-1 8-3Z"/><path d="m9 12 2 2 4-4"/>',
  pin: '<path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  ship: '<path d="M3 13h18l-3 5H6l-3-5Zm4 0V9h10v4m-8-4V6h6v3M3 21c1 0 2-.5 3-1 1 .5 2 1 3 1s2-.5 3-1c1 .5 2 1 3 1s2-.5 3-1c1 .5 2 1 3 1"/>',
  users: '<circle cx="9" cy="7" r="3"/><path d="M3 19v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m2-15a3 3 0 0 1 0 6m4 9v-2a4 4 0 0 0-3-4"/>',
};

export function icon(name, size = 20) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

export function h(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

const moneyFormat = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormat = new Intl.NumberFormat('zh-Hans');
const dateFormat = new Intl.DateTimeFormat('zh-Hans', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const money = cents => `S$${moneyFormat.format(cents / 100)}`;
const count = value => numberFormat.format(value);
const stamp = date => dateFormat.format(new Date(date));

const pages = {
  buyer: [['market', '采购市场', 'search'], ['requests', '采购询价', 'list'], ['orders', '订单与清关', 'truck']],
  seller: [['inventory', '商品管理', 'box'], ['requests', '收到的询价', 'list'], ['orders', '订单与清关', 'truck']],
};

export function headerView(role, page) {
  return `<div class="header-inner">
    <a class="brand" href="#${role === 'buyer' ? 'market' : 'inventory'}" aria-label="${SITE_NAME}">
      <span class="brand-mark" aria-hidden="true"></span><span class="brand-name" translate="no">一带一路<span>国际总商会</span></span>
    </a>
    <nav class="site-nav" aria-label="主要导航">
      ${pages[role].map(([url, label, graphic]) => `<a href="#${url}"${url === page ? ' aria-current="page"' : ''}>${icon(graphic, 19)}<span>${label}</span></a>`).join('')}
    </nav>
    <div class="header-controls">
      <label class="role-control">
        <span class="role-label">演示身份</span>
        <span class="role-field">
          ${icon('users', 17)}
          <select id="role-select">
            <option value="buyer"${role === 'buyer' ? ' selected' : ''}>采购方</option>
            <option value="seller"${role === 'seller' ? ' selected' : ''}>供货方</option>
          </select>
          ${icon('chevron', 14)}
        </span>
      </label>
    </div>
  </div>`;
}

function empty(title, description, graphic = 'box') {
  return `<div class="empty">${icon(graphic, 28)}<h3>${title}</h3><p>${description}</p></div>`;
}

function productRow(product, selected) {
  return `<tr class="catalogue-row" role="row">
    <th class="catalogue-product" scope="row" role="rowheader">
      <button type="button" class="text-button product-title" data-action="product" data-id="${h(product.id)}">${h(product.name)}</button>
      <span class="row-meta">${h(product.spec)}</span>
    </th>
    <td class="catalogue-supplier" role="cell"><span>${h(product.supplier)}</span><span class="row-meta">${h(product.origin)}</span><span class="row-meta mobile-arrival">${count(product.days)} 天到仓</span></td>
    <td class="catalogue-price" role="cell"><strong class="amount">${money(product.price)}</strong><span> / ${h(product.unit)}</span><span class="row-meta">${count(product.moq)} ${h(product.unit)}起订</span></td>
    <td class="catalogue-arrival" role="cell">${count(product.days)} 天</td>
    <td class="catalogue-actions" role="cell"><div class="product-actions">
      <button class="button button-small ${selected ? 'button-picked' : 'button-secondary'}" type="button" data-action="compare-toggle" data-id="${h(product.id)}" aria-pressed="${selected}">${icon(selected ? 'check' : 'plus', 15)} ${selected ? '已加入' : '加入比价'}</button>
      <button class="text-button similar-link" type="button" data-action="similar" data-id="${h(product.id)}">找相似</button>
    </div></td>
  </tr>`;
}

export function compareSelection(state) {
  return state.compared.map(id => state.products.find(product => product.id === id)).filter(Boolean);
}

function comparisonPanel(items) {
  const quantity = Math.max(0, ...items.map(product => product.moq));
  const amounts = items.map(product => landed(quoteFromProduct(product, quantity), quantity));
  const lowest = Math.min(...amounts);
  return `<aside class="compare-ledger surface" id="comparison" tabindex="-1" aria-labelledby="compare-heading">
    <div class="compare-title"><h2 id="compare-heading">到货比价</h2>${items.length ? '<button type="button" class="text-button" data-action="compare-clear">清空</button>' : ''}</div>
    <div class="compare-body">
      ${items.length ? `<div class="compare-context"><p class="compare-product">${h(items[0].name)}</p><p class="row-meta">${count(quantity)} ${h(items[0].unit)}送至新加坡裕廊仓库</p></div>
        <ul class="compare-list">${items.map((product, index) => `<li class="compare-line">
          <div>${h(product.supplier)}<span class="row-meta">${count(product.days)} 天到仓</span></div>
          <div class="compare-amount"><strong class="amount">${money(amounts[index])}</strong>${items.length > 1 && amounts[index] === lowest ? '<span class="lowest">最低总价</span>' : ''}</div>
          <button type="button" class="icon-button remove" data-action="compare-toggle" data-id="${h(product.id)}" aria-label="移除${h(product.supplier)}报价">${icon('x', 15)}</button>
        </li>`).join('')}</ul>` : '<p class="compare-description">添加最多三件同规格商品，比较各自的送仓总价。</p>'}
      <button class="button button-primary button-block" type="button" data-action="compare-open"${items.length ? '' : ' disabled'}>${items.length === 1 ? '查看费用明细' : '对比费用明细'}</button>
      <p class="footnote compare-note">运费、税费和服务费均为演示估算。</p>
    </div>
  </aside>`;
}

const sortChoices = [['featured', '默认顺序'], ['price', '货品单价从低到高'], ['days', '预计交期从短到长']];
const options = (values, active) => values.map(([value, label]) => `<option value="${h(value)}"${value === active ? ' selected' : ''}>${h(label)}</option>`).join('');

export function marketView(state, filters) {
  const similar = state.products.find(product => product.id === filters.similar);
  const equivalent = similar && state.products.some(product => product.id !== similar.id && specKey(product) === specKey(similar));
  const keywords = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = state.products.filter(product => {
    if (similar) return equivalent ? specKey(product) === specKey(similar) : product.category === similar.category;
    if (filters.category && product.category !== filters.category) return false;
    const text = [product.name, product.spec, product.category, product.supplier, product.origin].join(' ').toLowerCase();
    return keywords.every(keyword => text.includes(keyword));
  });
  if (filters.sort === 'price') results.sort((a, b) => a.price - b.price);
  if (filters.sort === 'days') results.sort((a, b) => a.days - b.days);
  const compared = compareSelection(state);

  return `${workspaceHeading('采购市场', '按规格找货，比较送到仓库的总价。', `<div class="page-actions">
    <a class="button button-secondary" href="#orders/SL-0001">查看样例订单</a>
    <button type="button" class="button button-primary" data-action="request-new">${icon('plus', 17)} 发布采购需求</button>
  </div>`)}
  <section class="route-band" aria-label="演示线路">
    <div class="route-content">
      <p class="route-caption">${icon('route', 17)} 演示线路</p>
      <div class="route-stops">
        <div><span>发货地</span><strong>中国大陆</strong></div>
        <span class="route-track" aria-hidden="true">${icon('ship', 20)}</span>
        <div><span>目的地</span><strong>新加坡</strong></div>
      </div>
    </div>
    <figure class="route-photo">
      <img src="./assets/singapore-port.webp" alt="新加坡港集装箱码头" width="1200" height="801" fetchpriority="high">
      <figcaption><a href="https://commons.wikimedia.org/wiki/File:Container_port_(12848714813).jpg">KimonBerlin</a><span class="photo-license"> / <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a></span></figcaption>
    </figure>
  </section>
  <div class="market-layout">
    <section class="catalogue surface" aria-labelledby="catalogue-heading">
      <div class="catalogue-controls">
        <div class="catalogue-heading"><h2 id="catalogue-heading">货源清单</h2><span class="catalogue-count">${results.length} 件商品</span><button type="button" class="text-button compare-jump" data-action="compare-jump" aria-controls="comparison">比价清单（${compared.length}）</button></div>
        <form class="search-bar" data-form="search" role="search" autocomplete="off">
          <label class="search-field">${icon('search', 19)}<span class="sr-only">搜索商品和供应商</span>
            <input type="search" name="query" placeholder="如 M8 或海越包装…" value="${h(filters.query)}" maxlength="120">
          </label>
          <button class="button button-secondary" type="submit">搜索</button>
        </form>
        <div class="filter-row">
          <div class="filters" role="group" aria-label="商品分类">${['', ...categories].map(category => `<button type="button" class="filter-chip" data-action="category" data-category="${h(category)}" aria-pressed="${!similar && category === filters.category}">${category || '全部商品'}</button>`).join('')}</div>
          <label class="sort-control"><span class="sr-only">结果排序</span><select id="sort-select">${options(sortChoices, filters.sort)}</select>${icon('chevron', 15)}</label>
        </div>
        ${similar ? `<div class="filter-context"><span>${equivalent ? '同规格' : '同类别'}：${h(similar.name)}</span><button type="button" class="text-button" data-action="search-reset">清除筛选</button></div>` : ''}
      </div>
      ${results.length ? `<table class="catalogue-table" role="table" aria-label="采购市场货源">
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">商品与规格</th><th scope="col" role="columnheader">供货方</th><th scope="col" role="columnheader">单价与起订量</th><th class="catalogue-arrival" scope="col" role="columnheader">预计到仓</th><th scope="col" role="columnheader">操作</th></tr></thead>
        <tbody role="rowgroup">${results.map(product => productRow(product, state.compared.includes(product.id))).join('')}</tbody>
      </table>` : `${empty('没有符合条件的商品', '换一个型号、供应商或清除筛选。', 'search')}<button class="button button-secondary empty-action" type="button" data-action="search-reset">清除筛选</button>`}
    </section>
    ${comparisonPanel(compared)}
  </div>`;
}

function workspaceHeading(title, description, action = '') {
  return `<div class="workspace-heading"><div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}

export function inventoryView(state) {
  const items = state.products.filter(product => product.supplierId === OWN_SUPPLIER);
  return `${workspaceHeading('商品管理', `${OWN_COMPANY} · 管理采购方可见的商品和报价`, '<button class="button button-primary" type="button" data-action="product-new">发布商品</button>')}
    <section class="surface workspace-panel"><div class="panel-heading"><h2>我的商品</h2><span class="muted">${items.length} 件</span></div>
      <div class="listing">${items.map(product => `<article class="list-row inventory-row">
        <span class="section-icon">${icon('box', 21)}</span>
        <div class="list-main"><h3>${h(product.name)}</h3><p>${h(product.spec)} <span>${h(product.origin)}</span></p></div>
        <div class="inventory-price"><strong class="amount">${money(product.price)}</strong><small> / ${h(product.unit)}</small><p>${count(product.moq)} ${h(product.unit)}起订</p></div>
        <button class="button button-secondary button-small" type="button" data-action="product-edit" data-id="${h(product.id)}">编辑</button>
      </article>`).join('')}</div>
    </section>`;
}

function quoteBreakdown(quote, quantity) {
  return [
    ['商品货款', quote.price * quantity], ['国际运费', quote.freight], ['预估税费', quote.tax],
    ['报关服务费', quote.fees], ['本地送仓费', quote.delivery],
  ];
}

function costSummary(quote, quantity, actual = null) {
  return `<dl class="cost-summary">${quoteBreakdown(quote, quantity).map(([label, amount]) => `<div><dt>${label}</dt><dd class="amount">${money(amount)}</dd></div>`).join('')}
    <div class="cost-total"><dt>预计到货总价</dt><dd class="amount">${money(landed(quote, quantity))}</dd></div>
    ${actual === null ? '' : `<div class="cost-actual"><dt>实际到货费用（演示）</dt><dd class="amount">${money(actual)}</dd></div>`}</dl>`;
}

function requestDetails(state, request) {
  const buyer = state.role === 'buyer';
  const ownQuote = request.quotes.find(quote => quote.supplierId === OWN_SUPPLIER);
  const quotes = buyer ? request.quotes : request.quotes.filter(quote => quote.supplierId === OWN_SUPPLIER);
  return `<a class="back-link" href="#requests">返回询价列表</a>
    ${workspaceHeading(h(request.name), `${h(request.id)} · ${h(request.category)}`, !buyer && !request.orderId ? `<button class="button button-primary" type="button" data-action="quote-write" data-id="${h(request.id)}">${ownQuote ? '修改我的报价' : '提交报价'}</button>` : '')}
    <div class="request-layout">
      <section class="surface request-brief"><div class="panel-heading"><h2>采购要求</h2><span class="badge ${request.orderId ? 'badge-green' : ''}">${request.orderId ? '已生成订单' : '询价中'}</span></div>
        <dl class="details-grid"><div><dt>规格</dt><dd>${h(request.spec)}</dd></div><div><dt>数量</dt><dd>${count(request.quantity)} ${h(request.unit)}</dd></div><div><dt>交付地点</dt><dd>${h(request.destination)}</dd></div></dl>
        ${request.note ? `<p class="request-note">${h(request.note)}</p>` : ''}
        ${buyer && request.orderId ? `<a class="button button-secondary details-action" href="#orders/${h(request.orderId)}">查看订单 ${h(request.orderId)}</a>` : ''}
      </section>
      <section class="request-quotes"><div class="market-heading"><h2>${buyer ? '供应商报价' : '我的报价'}</h2><span>${quotes.length} 份</span></div>
        ${quotes.length ? `<div class="quote-grid">${quotes.map(quote => `<article class="surface quote-card">
          <div class="quote-heading"><h3>${h(quote.supplier)}</h3><p class="quote-meta"><span>${h(quote.origin)}</span><span>${count(quote.days)} 天到仓</span></p></div>
          ${costSummary(quote, request.quantity)}
          ${quote.note ? `<p class="muted quote-note">${h(quote.note)}</p>` : ''}
          ${buyer && !request.orderId ? `<button type="button" class="button button-primary" data-action="quote-accept" data-id="${h(request.id)}" data-quote="${h(quote.id)}">采用报价</button>` : ''}
        </article>`).join('')}</div>` : `<div class="surface">${empty('暂无报价', buyer ? '供货方提交报价后，会在这里显示。' : '报价时请填写运费、预估税费和到仓时间。', 'list')}</div>`}
      </section>
    </div>`;
}

export function requestsView(state, id) {
  const request = state.requests.find(item => item.id === id);
  if (request) return requestDetails(state, request);

  const buyer = state.role === 'buyer';
  return `${workspaceHeading(buyer ? '采购询价' : '收到的询价', buyer ? '收集同一采购需求的供应商报价，并选择一份生成订单。' : `${OWN_COMPANY} · 查看采购要求并提交到货报价。`, buyer ? '<button class="button button-primary" type="button" data-action="request-new">发布采购需求</button>' : '')}
    <section class="surface workspace-panel"><div class="panel-heading"><h2>${buyer ? '我的询价' : '采购需求'}</h2><span class="muted">${state.requests.length} 条</span></div>
      <div class="listing">${[...state.requests].reverse().map(item => `<a class="list-row request-row" href="#requests/${h(item.id)}">
        <span class="section-icon">${icon('list', 20)}</span><div class="list-main"><span class="identifier">${h(item.id)}</span><h3>${h(item.name)}</h3><p>${h(item.spec)} · ${count(item.quantity)} ${h(item.unit)}</p></div>
        <span class="request-destination">${icon('pin', 16)} ${h(item.destination)}</span>
        <span class="badge ${item.orderId ? 'badge-green' : ''}">${item.orderId ? '已生成订单' : buyer ? `${item.quotes.length} 份报价` : item.quotes.some(quote => quote.supplierId === OWN_SUPPLIER) ? '已报价' : '待报价'}</span>
      </a>`).join('')}</div>
    </section>`;
}

function orderDetails(order, role) {
  const buyer = role === 'buyer';
  const complete = documents.every(document => order.docs[document.key]);
  const nextActions = { 1: '模拟出口放行', 2: '模拟进口放行', 3: '确认签收' };
  return `<div class="order-detail">
    <section class="surface order-overview"><div class="panel-heading"><div><span class="identifier" translate="no">${h(order.id)}</span><h2>${h(order.product.name)}</h2></div><span class="badge ${order.stage > 0 ? 'badge-green' : 'badge-amber'}">${milestones[order.stage].name}</span></div>
      <dl class="details-grid"><div><dt>规格与数量</dt><dd>${h(order.product.spec)} <span class="order-quantity">${count(order.quantity)} ${h(order.product.unit)}</span></dd></div><div><dt>供货方</dt><dd>${h(order.quote.supplier)}</dd></div><div><dt>送仓路线</dt><dd>${h(order.quote.origin)} <span aria-hidden="true">→</span> ${h(order.destination)}</dd></div></dl>
    </section>
    <div class="order-flow-grid">
      <div class="surface order-flow">
        <section class="document-panel"><div class="panel-heading"><h2>报关资料</h2><span class="muted">${documents.filter(document => order.docs[document.key]).length} / ${documents.length} 齐备</span></div>
          <div class="doc-list">${documents.map(document => `<div class="doc-row"><span class="section-icon">${icon('file', 19)}</span><div><strong>${document.name}</strong><p class="${order.docs[document.key] ? '' : 'pending-document'}">${order.docs[document.key] ? '样例已生成' : '待补充'}</p></div>
            ${order.docs[document.key] ? `<button class="icon-button download" type="button" data-action="doc-download" data-id="${h(order.id)}" data-doc="${document.key}" aria-label="下载样例${document.name}">${icon('download', 18)}</button>` : `<button class="button button-secondary button-small" type="button" data-action="doc-generate" data-id="${h(order.id)}" data-doc="${document.key}" aria-label="生成样例${document.name}">生成样例</button>`}
          </div>`).join('')}</div>
          ${order.stage === 0 ? `<div class="panel-action">
            <p class="footnote">${!complete ? '补齐发票和装箱单后即可委托。' : buyer ? '资料齐备，可发起演示委托。' : '由采购方委托报关。'}</p>
            ${buyer ? `<button type="button" class="button button-primary" data-action="delegate" data-id="${h(order.id)}"${complete ? '' : ' disabled'}>${icon('shield', 17)} 一键委托报关</button>` : ''}
          </div>` : ''}
        </section>
        <section class="timeline-panel"><div class="panel-heading"><h2>清关与交付进度</h2>${buyer && nextActions[order.stage] ? `<button type="button" class="button button-secondary button-small" data-action="advance" data-id="${h(order.id)}">${nextActions[order.stage]}</button>` : ''}</div>
          <ol class="timeline">${milestones.map((milestone, index) => `<li class="${index < order.stage ? 'done' : index === order.stage ? 'current' : 'pending'}"${index === order.stage ? ' aria-current="step"' : ''}>
            <span class="timeline-marker">${index < order.stage ? icon('check', 15) : ''}</span><div><h3>${milestone.name}</h3><p>${milestone.message}</p></div><span class="timeline-date">${order.history[index] ? stamp(order.history[index]) : ''}</span>
          </li>`).join('')}</ol>
        </section>
      </div>
      <section class="surface cost-overview"><div class="panel-heading"><h2>到货费用</h2><span class="muted" translate="no">SGD</span></div><div class="cost-panel">${costSummary(order.quote, order.quantity, order.actual)}</div></section>
    </div>
  </div>`;
}

export function ordersView(state, id) {
  const orders = [...state.orders].reverse().filter(order => state.role === 'buyer' || order.quote.supplierId === OWN_SUPPLIER);
  const active = orders.find(order => order.id === id) ?? orders[0];
  return `${workspaceHeading('订单与清关', '查看订单单证、报关委托和送仓进度。')}
    ${orders.length ? `<div class="orders-layout"><aside class="surface order-sidebar" aria-label="订单列表"><div class="panel-heading"><h2>订单</h2><span class="muted">${orders.length} 笔</span></div>
      ${orders.map(order => `<a class="order-link${order.id === active.id ? ' active' : ''}" href="#orders/${h(order.id)}"${order.id === active.id ? ' aria-current="true"' : ''}>
        <span class="identifier">${h(order.id)}</span><strong>${h(order.product.name)}</strong><span>${milestones[order.stage].name}</span>
      </a>`).join('')}</aside>${orderDetails(active, state.role)}</div>` : `<div class="surface">${empty('暂无订单', '采购方采用你的报价后，订单会显示在这里。', 'truck')}</div>`}`;
}

export function dialogView(title, subtitle, content, wide = false) {
  return `<div class="dialog-frame${wide ? ' dialog-wide' : ''}"><div class="dialog-heading"><div><h2 id="dialog-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div><button class="icon-button" type="button" aria-label="关闭" data-action="dialog-close">${icon('x', 21)}</button></div>${content}</div>`;
}

const actions = (label, cancel = '取消') => `<div class="form-actions"><button class="button button-secondary" type="button" data-action="dialog-close">${cancel}</button><button class="button button-primary" type="submit">${label}</button></div>`;
const numeric = (name, label, value, min, max, step = 1) => `<label>${label}<input name="${name}" type="number" value="${value}" min="${min}" max="${max}" step="${step}" required></label>`;
const textField = (name, label, value = '', max = 90) => `<label>${label}<input name="${name}" type="text" value="${h(value)}" maxlength="${max}" required></label>`;

export function requestForm(product) {
  return dialogView('发布采购需求', '供货方可按这个需求提交到货报价。', `<form class="form-stack" data-form="request">
    <div class="form-grid">${textField('name', '商品名称', product?.name)}<label>类别<select name="category">${options(categories.map(item => [item, item]), product?.category)}</select></label></div>
    ${textField('spec', '型号及规格', product?.spec, 140)}
    <div class="form-grid">${numeric('quantity', '采购数量', product?.moq ?? 500, 1, 1000000)}<label>单位<select name="unit">${options(unitOptions.map(item => [item, item]), product?.unit)}</select></label></div>
    ${textField('destination', '交付地点', '新加坡裕廊仓库')}
    <label>补充要求 <span class="optional">选填</span><textarea name="note" rows="3" maxlength="250" placeholder="交期、包装或认证要求"></textarea></label>
    ${actions('发布询价')}</form>`);
}

export function productDetails(product) {
  return dialogView(h(product.name), h(product.spec), `<dl class="details-grid product-dialog-meta">
      <div><dt>供货方</dt><dd>${h(product.supplier)}</dd></div><div><dt>发货地</dt><dd>${h(product.origin)}</dd></div><div><dt>类别</dt><dd>${h(product.category)}</dd></div>
      <div><dt>单价</dt><dd><span class="amount">${money(product.price)}</span> / ${h(product.unit)}</dd></div><div><dt>起订量</dt><dd>${count(product.moq)} ${h(product.unit)}</dd></div><div><dt>预计到仓</dt><dd>${count(product.days)} 天</dd></div>
    </dl>
    <div class="form-actions"><button class="button button-secondary" type="button" data-action="similar" data-id="${h(product.id)}">找相似</button><button class="button button-primary" type="button" data-action="request-new" data-id="${h(product.id)}">按此规格询价</button></div>`);
}

export function productForm(product) {
  return dialogView(product ? '编辑商品' : '发布商品', `${OWN_COMPANY} · 发布后采购方可在市场中找到这件商品。`, `<form class="form-stack" data-form="product" data-id="${h(product?.id)}">
    <div class="form-grid">${textField('name', '商品名称', product?.name)}<label>类别<select name="category">${options(categories.map(item => [item, item]), product?.category)}</select></label></div>
    ${textField('spec', '型号及规格', product?.spec, 140)}
    <div class="form-grid">${textField('origin', '发货地', product?.origin ?? '中国苏州')}<label>单位<select name="unit">${options(unitOptions.map(item => [item, item]), product?.unit)}</select></label></div>
    <div class="form-grid">${numeric('price', '商品单价（SGD）', product ? product.price / 100 : '', 0.01, 100000, 0.01)}${numeric('moq', '最小起订量', product?.moq ?? 100, 1, 1000000)}</div>
    <div class="form-grid">${numeric('freight', '起订量国际运费（SGD）', (product?.freight ?? 10000) / 100, 0, 100000, 0.01)}${numeric('fees', '报关服务费（SGD）', (product?.fees ?? 3000) / 100, 0, 100000, 0.01)}</div>
    <div class="form-grid">${numeric('delivery', '起订量送仓费（SGD）', (product?.delivery ?? 2000) / 100, 0, 100000, 0.01)}${numeric('days', '预计到仓天数', product?.days ?? 10, 1, 365)}</div>
    ${actions(product ? '保存商品' : '发布商品')}</form>`);
}

export function quoteForm(request) {
  const quote = request.quotes.find(item => item.supplierId === OWN_SUPPLIER);
  return dialogView(quote ? '修改报价' : '提交到货报价', `${h(request.name)} · ${count(request.quantity)} ${h(request.unit)} · ${h(request.destination)}`, `<form class="form-stack" data-form="quote" data-id="${h(request.id)}">
    <div class="form-grid">${textField('origin', '发货地', quote?.origin ?? '中国苏州')}${numeric('days', '预计到仓天数', quote?.days ?? 8, 1, 365)}</div>
    <div class="form-grid">${numeric('price', '商品单价（SGD）', quote ? quote.price / 100 : '', 0.01, 100000, 0.01)}${numeric('freight', '国际运费（SGD）', (quote?.freight ?? 8000) / 100, 0, 100000, 0.01)}</div>
    <div class="form-grid">${numeric('tax', '预估税费（SGD）', (quote?.tax ?? 3000) / 100, 0, 100000, 0.01)}${numeric('fees', '报关服务费（SGD）', (quote?.fees ?? 2000) / 100, 0, 100000, 0.01)}</div>
    ${numeric('delivery', '本地送仓费（SGD）', (quote?.delivery ?? 1800) / 100, 0, 100000, 0.01)}
    <label>备注 <span class="optional">选填</span><textarea name="note" rows="2" maxlength="250">${h(quote?.note)}</textarea></label>
    ${actions('提交报价')}</form>`);
}

export function compareDialog(items, quantity) {
  const quotes = items.map(product => quoteFromProduct(product, quantity));
  const amounts = quotes.map(quote => landed(quote, quantity));
  const breakdown = quotes.map(quote => quoteBreakdown(quote, quantity));
  return dialogView('到货费用明细', `${h(items[0].name)} · ${h(items[0].spec)} · 新加坡裕廊仓库`, `<form class="quantity-form" data-form="compare-quantity">
    ${numeric('quantity', `采购数量（${h(items[0].unit)}）`, quantity, Math.max(...items.map(product => product.moq)), 1000000)}
    <button class="button button-secondary" type="submit">重新计算</button></form>
    <div class="table-scroll" role="region" aria-label="费用对照表" tabindex="0"><table class="cost-table">
      <thead><tr><th scope="col">费用项目</th>${items.map(product => `<th scope="col">${h(product.supplier)}<small>${h(product.origin)} · ${product.days} 天</small></th>`).join('')}</tr></thead>
      <tbody>${breakdown[0].map(([label], index) => `<tr><th scope="row">${label}</th>${breakdown.map(lines => `<td><span class="amount">${money(lines[index][1])}</span></td>`).join('')}</tr>`).join('')}
        <tr class="table-total"><th scope="row">预计到货总价</th>${amounts.map(amount => `<td><span class="amount">${money(amount)}</span>${amounts.length > 1 && amount === Math.min(...amounts) ? '<small class="best-price">最低总价</small>' : ''}</td>`).join('')}</tr>
        <tr><td></td>${items.map(product => `<td><button class="button button-primary button-small" type="button" data-action="catalogue-accept" data-id="${h(product.id)}">采用报价</button></td>`).join('')}</tr>
      </tbody></table></div>
    <p class="footnote dialog-note">${icon('info', 15)} 各项费用为演示估算，订单仅在当前浏览器保存。</p>`, true);
}

export function acceptForm({ product, quote, quantity, destination }, previous) {
  return dialogView('确认采购单', `${h(product.name)} · ${count(quantity)} ${h(product.unit)} · ${h(quote.supplier)}`, `<form class="form-stack" data-form="order">
    <p class="notice">送至 ${h(destination)}。此操作会建立样例订单，供后续生成单证和演示委托报关。</p>
    ${costSummary(quote, quantity)}
    <div class="form-actions"><button class="button button-secondary" type="button" data-action="${previous === 'compare' ? 'compare-back' : 'dialog-close'}">返回</button><button class="button button-primary" type="submit">生成采购单</button></div></form>`);
}

export function delegateForm(order) {
  return dialogView('委托报关', `${h(order.id)} · ${h(order.quote.origin)} → ${h(order.destination)}`, `<form class="form-stack" data-form="delegate" data-id="${h(order.id)}">
    <p class="notice">本次委托包含商业发票和装箱单。确认后可在订单页演示出口放行、进口放行和签收。</p>
    <label class="checkbox-label"><input type="checkbox" name="authorize" required>确认使用本单的样例资料进行报关演示</label>
    ${actions('确认委托')}</form>`);
}

export function deliveryForm(order) {
  return dialogView('确认签收', `${h(order.id)} · ${h(order.destination)}`, `<form class="form-stack" data-form="delivery" data-id="${h(order.id)}">
    ${numeric('actual', '实际到货费用（SGD，演示）', landed(order.quote, order.quantity) / 100, 0, 200000000000, 0.01)}
    ${actions('记录签收')}</form>`);
}

import { defaultCase, demoCurrency, findCase } from './cases.js';
import { caseOf, currencyOf, destinationOf, documents, loadState, makeOrder, matchingOffers, milestones, nextRecordId, OWN_COMPANY, OWN_SUPPLIER, quoteFromProduct, SITE_NAME, specKey, STORAGE_KEY } from './trade.js';
import { acceptForm, compareDialog, delegateForm, deliveryForm, headerView, icon, inventoryView, marketView, money, ordersView, productDetails, productForm, quoteForm, requestForm, requestsView } from './views.js';

const header = document.querySelector('#header');
const main = document.querySelector('#main');
const dialog = document.querySelector('#dialog');
const toast = document.querySelector('#toast');

let state = loadState();
const filters = { query: '', caseId: defaultCase.id, comparisonCaseId: defaultCase.id, sort: 'featured', similar: '' };
let comparisonQuantity = 0;
let orderDraft = null;
let dialogOpener = null;
let toastTimer;

function route() {
  const [page, id] = location.hash.slice(1).split('/');
  const home = state.role === 'seller' ? 'inventory' : 'market';
  return { page: ['requests', 'orders', home].includes(page) ? page : home, id };
}

function render() {
  const { page, id } = route();
  const navigation = `${state.role}/${page}`;
  if (header.dataset.navigation !== navigation) {
    header.innerHTML = headerView(state.role, page);
    header.dataset.navigation = navigation;
  }
  if (page === 'requests') main.innerHTML = requestsView(state, id);
  else if (page === 'orders') main.innerHTML = ordersView(state, id);
  else if (page === 'inventory') main.innerHTML = inventoryView(state);
  else main.innerHTML = marketView(state, filters);
}

function renderPage() {
  if (dialog.open) dialog.close();
  render();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function go(page, id) {
  const hash = id ? `#${page}/${id}` : `#${page}`;
  if (hash !== location.hash) history.pushState(null, '', hash);
  renderPage();
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the in-memory demo usable when browser storage is unavailable.
  }
}

function message(text, kind = 'success') {
  clearTimeout(toastTimer);
  toast.classList.toggle('toast-error', kind === 'error');
  toast.innerHTML = `${icon(kind === 'error' ? 'info' : 'check', 20)} <span></span>`;
  toast.querySelector('span').textContent = text;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4800);
}

function showDialog(html) {
  if (!dialog.open) dialogOpener = document.activeElement;
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  const focusTarget = dialog.querySelector('input:not([type="checkbox"])')
    ?? dialog.querySelector('.dialog-heading button');
  focusTarget?.focus({ preventScroll: true });
  dialog.scrollTop = 0;
}

dialog.addEventListener('close', () => {
  dialogOpener?.focus({ preventScroll: true });
  dialogOpener = null;
  orderDraft = null;
});

const findProduct = id => state.products.find(product => product.id === id);
const findRequest = id => state.requests.find(request => request.id === id);
const findOrder = id => state.orders.find(order => order.id === id
  && (state.role === 'buyer' || order.quote.supplierId === OWN_SUPPLIER));

function toggleComparison(product, trigger) {
  const caseId = caseOf(product);
  const selected = matchingOffers(state, caseId);
  const ids = selected.map(item => item.id);
  const switchScope = filters.comparisonCaseId !== caseId;
  filters.comparisonCaseId = caseId;
  if (ids.includes(product.id)) {
    state.comparisons[caseId] = ids.filter(id => id !== product.id);
  } else {
    if (selected.length >= 3) {
      if (switchScope) render();
      message('最多比较三份报价，请先移除一份。', 'error');
      return;
    }
    if (selected.length && specKey(selected[0]) !== specKey(product)) {
      if (switchScope) render();
      message('请先移除当前选项，再加入不同规格、线路或币种的商品。', 'error');
      return;
    }
    state.comparisons[caseId] = [...ids, product.id];
  }
  save();
  render();
  const selector = trigger.classList.contains('remove') ? '[data-action="compare-open"]' : `.product-actions [data-id="${product.id}"][data-action="compare-toggle"]`;
  main.querySelector(selector)?.focus({ preventScroll: true });
}

function openComparison(quantity) {
  const products = matchingOffers(state, filters.comparisonCaseId);
  if (!products.length) return;
  comparisonQuantity = quantity ?? Math.max(...products.map(product => product.moq));
  showDialog(compareDialog(products, comparisonQuantity));
}

function chooseCatalogueQuote(product) {
  orderDraft = {
    product,
    quote: quoteFromProduct(product, comparisonQuantity),
    quantity: comparisonQuantity,
    destination: destinationOf(product),
  };
  showDialog(acceptForm(orderDraft, 'compare'));
}

function chooseRequestQuote(id, quoteId) {
  const request = findRequest(id);
  const quote = request?.quotes.find(item => item.id === quoteId);
  if (!quote || request.orderId) return;
  orderDraft = { product: request, quote, quantity: request.quantity, destination: request.destination, requestId: id };
  showDialog(acceptForm(orderDraft, 'request'));
}

function downloadDocument(order, documentType) {
  const lines = [
    `${SITE_NAME} · ${documentType.name}（样例）`, '仅用于演示', '', `订单编号 ${order.id}`,
    `供货方 ${order.quote.supplier}`, `路线 ${order.quote.origin} 至 ${order.destination}`,
    `货品 ${order.product.name}`, `规格 ${order.product.spec}`, `数量 ${order.quantity} ${order.product.unit}`,
  ];
  if (documentType.key === 'invoice') {
    const currency = currencyOf(order.quote);
    lines.push(`结算币种 ${currency}`, `商品单价 ${money(order.quote.price, currency)}`, `商品货款 ${money(order.quote.price * order.quantity, currency)}`);
  } else {
    lines.push('包装 外箱装载，箱数与重量以实际装运清单为准。');
  }
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${order.id}-${documentType.filename}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function advance(order) {
  order.stage += 1;
  order.history[order.stage] = new Date().toISOString();
  save();
  if (dialog.open) dialog.close();
  render();
  message(milestones[order.stage].name);
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id, quote, doc } = button.dataset;
  const buyer = state.role === 'buyer';

  switch (action) {
    case 'dialog-close': dialog.close(); break;
    case 'case-select':
      Object.assign(filters, { caseId: id, query: '', similar: '' });
      if (id) filters.comparisonCaseId = id;
      render();
      main.querySelector('.case-tab[aria-pressed="true"]')?.focus({ preventScroll: true });
      break;
    case 'search-reset':
      Object.assign(filters, { query: '', similar: '' });
      render();
      main.querySelector('[name="query"]')?.focus({ preventScroll: true });
      break;
    case 'similar': {
      const caseId = caseOf(findProduct(id));
      if (dialog.open) dialog.close();
      Object.assign(filters, { query: '', caseId, comparisonCaseId: caseId, similar: id });
      render();
      main.querySelector('.filter-context button')?.focus({ preventScroll: true });
      break;
    }
    case 'product': showDialog(productDetails(findProduct(id))); break;
    case 'request-new': if (buyer) showDialog(requestForm(findProduct(id), filters.caseId)); break;
    case 'compare-toggle': toggleComparison(findProduct(id), button); break;
    case 'compare-clear':
      state.comparisons[filters.comparisonCaseId] = [];
      save();
      render();
      main.querySelector('#comparison').focus({ preventScroll: true });
      break;
    case 'compare-jump': {
      const comparison = main.querySelector('#comparison');
      comparison.scrollIntoView({ block: 'start' });
      comparison.focus({ preventScroll: true });
      break;
    }
    case 'compare-open': openComparison(); break;
    case 'compare-back': openComparison(comparisonQuantity); break;
    case 'catalogue-accept': if (buyer) chooseCatalogueQuote(findProduct(id)); break;
    case 'quote-accept': if (buyer) chooseRequestQuote(id, quote); break;
    case 'product-new': if (!buyer) showDialog(productForm()); break;
    case 'product-edit': {
      const product = findProduct(id);
      if (!buyer && product?.supplierId === OWN_SUPPLIER) showDialog(productForm(product));
      break;
    }
    case 'quote-write': {
      const request = findRequest(id);
      if (!buyer && request && !request.orderId) showDialog(quoteForm(request));
      break;
    }
    case 'doc-generate':
    case 'doc-download': {
      const order = findOrder(id);
      const documentType = documents.find(item => item.key === doc);
      if (!order || !documentType) break;
      if (action === 'doc-download' && order.docs[doc]) downloadDocument(order, documentType);
      if (action === 'doc-generate' && order.stage === 0) {
        order.docs[doc] = true;
        save();
        render();
        main.querySelector(`[data-action="doc-download"][data-doc="${doc}"]`)?.focus({ preventScroll: true });
        message(`已生成样例${documentType.name}`);
      }
      break;
    }
    case 'delegate': {
      const order = findOrder(id);
      if (buyer && order?.stage === 0 && documents.every(document => order.docs[document.key])) showDialog(delegateForm(order));
      break;
    }
    case 'advance': {
      const order = findOrder(id);
      if (buyer && order?.stage === 3) showDialog(deliveryForm(order));
      if (buyer && (order?.stage === 1 || order?.stage === 2)) advance(order);
      break;
    }
  }
});

document.addEventListener('change', event => {
  if (event.target.id === 'role-select') {
    const previous = route();
    state.role = event.target.value;
    save();
    if (['requests', 'orders'].includes(previous.page)) {
      render();
    } else {
      go(state.role === 'buyer' ? 'market' : 'inventory');
    }
    header.querySelector('#role-select').focus({ preventScroll: true });
  }
  if (event.target.id === 'sort-select') {
    filters.sort = event.target.value;
    render();
    main.querySelector('#sort-select').focus({ preventScroll: true });
  }
  if (event.target.name === 'caseId') {
    const scene = findCase(event.target.value);
    if (!scene) return;
    const form = event.target.form;
    const isRequest = form.dataset.form === 'request';
    const locationField = form.elements.namedItem(isRequest ? 'destination' : 'origin');
    const suggestion = isRequest ? scene.destination : scene.origin;
    if (locationField.value === form.dataset.autoLocation) locationField.value = suggestion;
    form.dataset.autoLocation = suggestion;
  }
});

document.addEventListener('input', event => {
  if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('');
});

document.addEventListener('submit', event => {
  const form = event.target;
  const type = form.dataset.form;
  if (!type) return;
  event.preventDefault();

  for (const input of form.querySelectorAll('input[type="text"][required]')) {
    if (input.value.trim()) continue;
    input.setCustomValidity('请填写此项。');
    input.reportValidity();
    return;
  }

  const data = new FormData(form);
  const value = key => String(data.get(key) ?? '').trim();
  const number = key => Number(value(key));
  const cents = key => Math.round(number(key) * 100);
  const buyer = state.role === 'buyer';

  switch (type) {
    case 'search':
      filters.query = value('query');
      filters.similar = '';
      render();
      main.querySelector('[name="query"]').focus({ preventScroll: true });
      break;
    case 'compare-quantity': openComparison(number('quantity')); break;
    case 'request': {
      if (!buyer) return;
      const scene = findCase(value('caseId'));
      const id = nextRecordId('RFQ', state.requests);
      state.requests.push({ id, name: value('name'), spec: value('spec'), caseId: scene?.id ?? null,
        category: scene?.label ?? form.dataset.category, currency: scene ? demoCurrency : 'SGD',
        quantity: number('quantity'), unit: value('unit'), destination: value('destination'), note: value('note'), orderId: null, quotes: [] });
      save();
      go('requests', id);
      message('采购询价已发布');
      break;
    }
    case 'product': {
      if (buyer) return;
      const product = findProduct(form.dataset.id);
      if (product && product.supplierId !== OWN_SUPPLIER) return;
      const scene = findCase(value('caseId'));
      if (!scene && !product) return;
      const values = {
        name: value('name'), spec: value('spec'), caseId: scene?.id ?? null,
        category: scene?.label ?? product.category, currency: product ? currencyOf(product) : demoCurrency,
        destination: scene?.destination ?? destinationOf(product), unit: value('unit'), origin: value('origin'),
        price: cents('price'), moq: number('moq'), freight: cents('freight'), fees: cents('fees'), delivery: cents('delivery'), days: number('days'),
      };
      if (data.has('tax')) values.tax = cents('tax');
      if (product) {
        const previousCaseId = caseOf(product);
        Object.assign(product, values);
        const selection = matchingOffers(state, previousCaseId).filter(item => caseOf(item) === previousCaseId);
        state.comparisons[previousCaseId] = selection.filter(item => specKey(item) === specKey(selection[0])).map(item => item.id);
      } else {
        state.products.unshift({ ...values, id: `product-${crypto.randomUUID()}`, supplierId: OWN_SUPPLIER, supplier: OWN_COMPANY });
      }
      save();
      go('inventory');
      message(product ? '商品已更新' : '商品已发布到采购市场');
      break;
    }
    case 'quote': {
      const request = findRequest(form.dataset.id);
      if (buyer || !request || request.orderId) return;
      const existing = request.quotes.find(item => item.supplierId === OWN_SUPPLIER);
      const values = { origin: value('origin'), days: number('days'), currency: currencyOf(request), price: cents('price'), freight: cents('freight'),
        fees: cents('fees'), tax: cents('tax'), delivery: cents('delivery'), note: value('note') };
      if (existing) Object.assign(existing, values);
      else request.quotes.push({ ...values, id: crypto.randomUUID(), supplierId: OWN_SUPPLIER, supplier: OWN_COMPANY });
      save();
      go('requests', request.id);
      message('到货报价已提交');
      break;
    }
    case 'order': {
      if (!buyer || !orderDraft) return;
      const request = findRequest(orderDraft.requestId);
      if (request?.orderId) return;
      const order = makeOrder({ ...orderDraft, id: nextRecordId('SL', state.orders) });
      state.orders.push(order);
      if (request) request.orderId = order.id;
      save();
      go('orders', order.id);
      message(`采购单 ${order.id} 已生成`);
      break;
    }
    case 'delegate': {
      const order = findOrder(form.dataset.id);
      if (buyer && order?.stage === 0 && data.has('authorize') && documents.every(document => order.docs[document.key])) advance(order);
      break;
    }
    case 'delivery': {
      const order = findOrder(form.dataset.id);
      if (buyer && order?.stage === 3) {
        order.actual = cents('actual');
        advance(order);
      }
      break;
    }
  }
});

document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
});

window.addEventListener('hashchange', renderPage);
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY && !dialog.open) {
    state = loadState();
    render();
  }
});

render();

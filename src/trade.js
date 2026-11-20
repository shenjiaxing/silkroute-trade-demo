import { demoCurrency, findCase, otherCaseId, sampleOrderId, tradeCases } from './cases.js';

export const OWN_SUPPLIER = 'hai-tu';
export const OWN_COMPANY = '演示供货企业';
export const SITE_NAME = '一带一路国际总商会';
export const STORAGE_KEY = 'silkroute-trade-demo-v2';
const previousStorageKey = 'silkroute-trade-demo-v1';
const previousDestination = '新加坡裕廊仓库';

export const documents = [
  { key: 'invoice', name: '商业发票', filename: 'invoice' },
  { key: 'packing', name: '装箱单', filename: 'packing-list' },
];

export const milestones = [
  { name: '准备单证', message: '生成或补齐本次订单的报关资料' },
  { name: '已委托报关', message: '报关服务商接收委托并复核资料' },
  { name: '出口已放行', message: '出口地报关完成' },
  { name: '进口已放行', message: '目的地清关完成' },
  { name: '买家已签收', message: '订单送达并记录最终费用' },
];

export const unitOptions = ['件', '个', '卷', '套', '千克', '块', '台', '米', '只'];

export const caseOf = item => findCase(item?.caseId)?.id ?? otherCaseId;
export const currencyOf = item => item?.currency === demoCurrency ? demoCurrency : 'SGD';
export const destinationOf = item => item.destination || findCase(item.caseId)?.destination || previousDestination;

export function matchingOffers(state, caseId) {
  return (state.comparisons[caseId] ?? []).map(id => state.products.find(product => product.id === id)).filter(Boolean);
}

export function quoteFromProduct(product, quantity) {
  const batches = quantity / product.moq;
  const freight = Math.round(product.freight * batches);
  // The old Singapore demo stored no per-lot tax amount.
  const tax = product.tax === undefined
    ? Math.round((product.price * quantity + freight) * 0.09)
    : Math.round(product.tax * batches);
  return {
    supplierId: product.supplierId,
    supplier: product.supplier,
    origin: product.origin,
    currency: currencyOf(product),
    price: product.price,
    freight,
    tax,
    fees: product.fees,
    delivery: Math.round(product.delivery * batches),
    days: product.days,
  };
}

export function landed(quote, quantity) {
  return quote.price * quantity + quote.freight + quote.tax + quote.fees + quote.delivery;
}

export function specKey(product) {
  return [caseOf(product), product.category, product.name, product.spec, product.unit, destinationOf(product), currencyOf(product)]
    .map(value => value.normalize('NFKC').toLowerCase().replace(/\s+/g, ''))
    .join('|');
}

export function nextRecordId(prefix, records) {
  const latest = records.reduce((number, record) => Math.max(number, Number(record.id.slice(prefix.length + 1)) || 0), 0);
  return `${prefix}-${String(latest + 1).padStart(4, '0')}`;
}

export function makeOrder({ id, product, quote, quantity, destination, requestId = null }) {
  return {
    id,
    caseId: product.caseId ?? null,
    product: { name: product.name, spec: product.spec, unit: product.unit },
    quote: { ...quote },
    quantity,
    destination,
    requestId,
    stage: 0,
    docs: {},
    history: [new Date().toISOString()],
    actual: null,
  };
}

function freshState() {
  const state = { role: 'buyer', products: [], requests: [], orders: [], comparisons: {} };
  for (const scene of tradeCases) {
    const offers = scene.offers.map(offer => ({
      ...offer,
      caseId: scene.id,
      category: scene.label,
      destination: scene.destination,
      currency: demoCurrency,
      supplierId: offer.supplier ? `sample-${offer.id}` : OWN_SUPPLIER,
      supplier: offer.supplier ?? OWN_COMPANY,
    }));
    state.products.push(...offers);
    state.comparisons[scene.id] = offers.slice(0, 2).map(offer => offer.id);

    const sampleOffer = offers[0];
    const sampleOrder = makeOrder({
      id: sampleOrderId(scene), product: sampleOffer, quote: quoteFromProduct(sampleOffer, sampleOffer.moq),
      quantity: sampleOffer.moq, destination: scene.destination,
    });
    sampleOrder.docs.invoice = true;
    state.orders.push(sampleOrder);

    const requestOffer = offers.at(-1);
    state.requests.push({
      id: `RFQ-C${String(scene.page).padStart(2, '0')}`, caseId: scene.id, category: scene.label, currency: demoCurrency,
      name: requestOffer.name, spec: requestOffer.spec, unit: requestOffer.unit,
      quantity: requestOffer.moq, destination: scene.destination, orderId: null,
      note: '请注明送仓费用和预计到仓时间。',
      quotes: [{ ...quoteFromProduct(requestOffer, requestOffer.moq), id: `quote-case-${scene.page}`, note: '费用为演示估算。' }],
    });
  }
  return state;
}

const previousSeedIds = new Set(['bolt-suzhou', 'box-ningbo', 'pallet-foshan', 'bolt-shenzhen', 'tape-yiwu', 'box-dongguan']);
const editablePreviousSeed = {
  name: '304 不锈钢六角螺栓', spec: 'M8 × 30 mm · DIN 933', category: '紧固件', origin: '中国苏州', unit: '件',
  moq: 1000, price: 26, freight: 12600, fees: 3300, delivery: 2000, days: 9,
};

function loadPrevious(previous) {
  const state = freshState();
  state.role = previous.role === 'seller' ? 'seller' : 'buyer';
  const savedProducts = previous.products.filter(product => !previousSeedIds.has(product.id)
    || (product.id === 'bolt-suzhou' && Object.entries(editablePreviousSeed).some(([field, value]) => product[field] !== value)));
  state.products.push(...savedProducts.map(product => ({ ...product, currency: 'SGD', destination: previousDestination })));
  state.comparisons[otherCaseId] = (previous.compared ?? []).filter(id => savedProducts.some(product => product.id === id));
  state.requests.unshift(...previous.requests.filter(request => request.id !== 'RFQ-0001'
    || request.orderId || request.quotes.some(quote => quote.id !== 'quote-seed')));
  state.orders.unshift(...previous.orders.filter(order => order.id !== 'SL-0001' || order.stage > 0 || order.docs.packing));
  return state;
}

function hasRecords(state) {
  return Array.isArray(state?.products) && Array.isArray(state?.requests) && Array.isArray(state?.orders);
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (hasRecords(saved) && saved.comparisons) return saved;
    const previous = JSON.parse(localStorage.getItem(previousStorageKey));
    if (hasRecords(previous)) return loadPrevious(previous);
  } catch {
    // The demo also works in browsers that disallow storage.
  }
  return freshState();
}

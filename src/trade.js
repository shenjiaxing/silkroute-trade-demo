export const OWN_SUPPLIER = 'hai-tu';
export const OWN_COMPANY = '海途工业品';
export const STORAGE_KEY = 'silkroute-trade-demo-v1';

export const categories = ['紧固件', '包装耗材', '仓储用品'];

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

const stainlessBolt = {
  name: '304 不锈钢六角螺栓',
  spec: 'M8 × 30 mm · DIN 933',
  category: '紧固件',
  unit: '件',
  moq: 1000,
};

const products = [
  { ...stainlessBolt, id: 'bolt-suzhou', supplierId: OWN_SUPPLIER, supplier: OWN_COMPANY, origin: '中国苏州', price: 26, freight: 12600, fees: 3300, delivery: 2000, days: 9 },
  { id: 'box-ningbo', name: '五层瓦楞运输纸箱', spec: '400 × 300 × 250 mm · BC 楞', category: '包装耗材', supplierId: 'hai-yue', supplier: '海越包装', origin: '中国宁波', unit: '个', moq: 500, price: 108, freight: 16500, fees: 2800, delivery: 3500, days: 11 },
  { id: 'pallet-foshan', name: '网格塑料托盘', spec: '1200 × 1000 mm · HDPE', category: '仓储用品', supplierId: 'nan-qiao', supplier: '南桥仓储设备', origin: '中国佛山', unit: '个', moq: 50, price: 1540, freight: 21000, fees: 3800, delivery: 4200, days: 12 },
  { ...stainlessBolt, id: 'bolt-shenzhen', supplierId: 'heng-da', supplier: '恒达紧固件', origin: '中国深圳', price: 29, freight: 7200, fees: 2600, delivery: 1800, days: 7 },
  { id: 'tape-yiwu', name: '牛皮纸封箱胶带', spec: '48 mm × 50 m · 自粘型', category: '包装耗材', supplierId: 'guo-yu', supplier: '国裕包装', origin: '中国义乌', unit: '卷', moq: 300, price: 175, freight: 8500, fees: 2100, delivery: 1800, days: 8 },
  { id: 'box-dongguan', name: '五层瓦楞运输纸箱', spec: '400 × 300 × 250 mm · BC 楞', category: '包装耗材', supplierId: 'dong-an', supplier: '东岸纸品', origin: '中国东莞', unit: '个', moq: 500, price: 103, freight: 18300, fees: 3000, delivery: 3100, days: 10 },
];

export const unitOptions = ['件', '个', '卷', '套', '千克'];

export function quoteFromProduct(product, quantity) {
  const batches = quantity / product.moq;
  const freight = Math.round(product.freight * batches);
  return {
    supplierId: product.supplierId,
    supplier: product.supplier,
    origin: product.origin,
    price: product.price,
    freight,
    tax: Math.round((product.price * quantity + freight) * 0.09),
    fees: product.fees,
    delivery: Math.round(product.delivery * batches),
    days: product.days,
  };
}

export function landed(quote, quantity) {
  return quote.price * quantity + quote.freight + quote.tax + quote.fees + quote.delivery;
}

export function specKey(product) {
  return [product.category, product.name, product.spec, product.unit]
    .map(value => value.normalize('NFKC').toLowerCase().replace(/\s+/g, ''))
    .join('|');
}

export function makeOrder({ number, product, quote, quantity, destination, requestId = null }) {
  return {
    id: `SL-${String(number).padStart(4, '0')}`,
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
  const request = {
    id: 'RFQ-0001',
    name: '五层瓦楞运输纸箱',
    spec: '400 × 300 × 250 mm · BC 楞',
    category: '包装耗材',
    quantity: 500,
    unit: '个',
    destination: '新加坡裕廊仓库',
    note: '希望纸箱平铺打包，报价请注明预计到仓时间。',
    orderId: null,
    quotes: [{ ...quoteFromProduct(products[1], 500), id: 'quote-seed', note: '含新加坡本地送仓。' }],
  };
  const sampleOrder = makeOrder({
    number: 1,
    product: products[0],
    quote: quoteFromProduct(products[0], 1000),
    quantity: 1000,
    destination: '新加坡裕廊仓库',
  });
  sampleOrder.docs.invoice = true;

  return {
    role: 'buyer',
    products: structuredClone(products),
    requests: [request],
    orders: [sampleOrder],
    compared: ['bolt-suzhou', 'bolt-shenzhen'],
  };
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved?.products) && Array.isArray(saved?.requests)
      && Array.isArray(saved?.orders) && Array.isArray(saved?.compared)) {
      return saved;
    }
  } catch {
    // The demo also works in browsers that disallow storage.
  }
  return freshState();
}

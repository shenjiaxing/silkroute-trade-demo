// Case themes come from pages 9–14 of the chamber introduction.
// The products, delivery points, amounts (USD cents), and terms are demo data.
export const tradeCases = [
  {
    id: 'central-asia-energy',
    label: '中亚风光储',
    title: '中亚风光储一体化项目',
    page: 9,
    origin: '中国大陆',
    market: '中亚',
    destination: '中亚项目仓（演示）',
    description: '商会资料介绍了中亚某国的风光储一体化项目，以及配套的门到门物流与清关服务。',
    offers: [
      { id: 'solar-jiangsu', name: '单晶光伏组件', spec: '580 W · 双玻组件', origin: '中国江苏', unit: '块', moq: 200, price: 7700, freight: 187000, tax: 49000, fees: 35000, delivery: 26000, days: 24 },
      { id: 'solar-guangdong', name: '单晶光伏组件', spec: '580 W · 双玻组件', supplier: '光伏样例商', origin: '中国广东', unit: '块', moq: 200, price: 7900, freight: 103000, tax: 47000, fees: 30000, delivery: 21000, days: 20 },
      { id: 'wind-tower-flange', name: '风机塔筒连接法兰', spec: '环形钢制法兰 · 按图加工', supplier: '风电样例商', origin: '中国山东', unit: '件', moq: 4, price: 98000, freight: 146000, tax: 16000, fees: 32000, delivery: 28000, days: 29 },
      { id: 'energy-control-cabinet', name: '储能控制柜', spec: '户外型 · 控制与监测', supplier: '储能样例商', origin: '中国广东', unit: '台', moq: 8, price: 128500, freight: 96000, tax: 28000, fees: 26000, delivery: 22000, days: 23 },
    ],
  },
  {
    id: 'middle-east-agriculture',
    label: '中东智慧农业',
    title: '中东智慧农业产业园',
    page: 11,
    origin: '中国香港及内地',
    market: '中东',
    destination: '中东项目仓（演示）',
    description: '商会资料介绍了针对中东某国农业用水需求的智慧农业合作，涉及节水技术与智能温室。',
    offers: [
      { id: 'fertigation-hong-kong', name: '温室水肥一体机', spec: '四通道 · 温室灌溉', origin: '中国香港', unit: '台', moq: 4, price: 142000, freight: 56000, tax: 19000, fees: 24000, delivery: 15000, days: 19 },
      { id: 'fertigation-guangdong', name: '温室水肥一体机', spec: '四通道 · 温室灌溉', supplier: '节水样例商', origin: '中国广东', unit: '台', moq: 4, price: 151000, freight: 39000, tax: 18300, fees: 20000, delivery: 13000, days: 16 },
      { id: 'greenhouse-controller', name: '温室环境控制器', spec: '多区控制 · 温湿度监测', supplier: '温室样例商', origin: '中国香港', unit: '台', moq: 12, price: 24500, freight: 36000, tax: 9300, fees: 14000, delivery: 11000, days: 15 },
    ],
  },
  {
    id: 'pakistan-power',
    label: '巴基斯坦电站',
    title: '巴基斯坦电站建设',
    page: 12,
    origin: '中国大陆',
    market: '巴基斯坦',
    destination: '巴基斯坦项目仓（演示）',
    description: '商会资料介绍了巴基斯坦电站建设，以及设计、施工和建材等中资企业的协作。',
    offers: [
      { id: 'cable-tray-jiangsu', name: '热镀锌电缆桥架', spec: '300 × 100 mm · 槽式', origin: '中国江苏', unit: '米', moq: 400, price: 1280, freight: 90300, tax: 13600, fees: 24500, delivery: 17000, days: 17 },
      { id: 'cable-tray-zhejiang', name: '热镀锌电缆桥架', spec: '300 × 100 mm · 槽式', supplier: '电站样例商', origin: '中国浙江', unit: '米', moq: 400, price: 1320, freight: 61500, tax: 13000, fees: 20100, delivery: 16000, days: 15 },
      { id: 'cable-tray-support', name: '电缆桥架支吊架', spec: '镀锌钢 · 双杆吊装式', supplier: '安装样例商', origin: '中国湖北', unit: '套', moq: 150, price: 540, freight: 42000, tax: 3900, fees: 12000, delivery: 9000, days: 14 },
    ],
  },
  {
    id: 'israel-irrigation',
    label: '以色列精准灌溉',
    title: '以色列精准灌溉合作',
    page: 13,
    origin: '以色列',
    market: '中国大陆',
    destination: '中国大陆项目仓（演示）',
    description: '商会资料介绍了精准灌溉企业股权合作，涉及传感、监测和智能灌溉技术。下方是据此设置的采购样例。',
    offers: [
      { id: 'soil-sensor-a', name: '土壤水分传感器', spec: 'RS-485 型 · 含温度测量', origin: '以色列', unit: '只', moq: 40, price: 4800, freight: 31500, tax: 10400, fees: 15000, delivery: 7900, days: 13 },
      { id: 'soil-sensor-b', name: '土壤水分传感器', spec: 'RS-485 型 · 含温度测量', supplier: '灌溉样例商', origin: '以色列', unit: '只', moq: 40, price: 5060, freight: 19000, tax: 10300, fees: 13300, delivery: 7200, days: 11 },
      { id: 'irrigation-dripper', name: '压力补偿式滴头', spec: '2 L/h · 适配滴灌管', supplier: '滴头样例商', origin: '以色列', unit: '只', moq: 2000, price: 34, freight: 24000, tax: 6500, fees: 8500, delivery: 6300, days: 11 },
    ],
  },
];

export const cooperationCases = [
  { title: '欧亚数字贸易港', page: 10, description: '香港 AI 企业与俄罗斯电商平台的数字贸易合作，涉及智能报关与智能客服方案。' },
  { title: '教育、科技与人文交流', page: 14, description: '中国香港、内地与中东教育机构探索联合办学与人文交流。' },
];

export const defaultCase = tradeCases[0];
export const otherCaseId = 'other';
export const demoCurrency = 'USD';
export const findCase = id => tradeCases.find(scene => scene.id === id);
export const sampleOrderId = scene => `SL-C${String(scene.page).padStart(2, '0')}`;

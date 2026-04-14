import React, { useEffect, useMemo, useState } from 'react'
import {
  QrCode,
  Clock3,
  MapPin,
  Store,
  Camera,
  LocateFixed,
  CheckCircle2,
  Search,
  FileDown,
  CircleAlert,
  AlertTriangle,
  ClipboardCheck,
} from 'lucide-react'

type DesktopTabKey = 'driver' | 'history' | 'success' | 'records'
type MobileTabKey = 'driver' | 'success' | 'recent'
type ExportPeriod = 'day' | 'week' | 'month'
type DelayStatus = '未迟到' | '迟到' | '待人工判断'

type StoreItem = {
  id: string
  name: string
  radius: number
  location: string
  lat: number | null
  lng: number | null
}

type RecordItem = {
  id: string
  date: string
  time: string
  store: string
  supplier: string
  category: string
  batch: string
  geoPassed: boolean
  distance: number
  photoUploaded: boolean
  exceptionReason: string
  exceptionRemark: string
  status: string
  normalArrivalTime: string
  latestArrivalTime: string
  isLate: boolean
  lateMinutes: number
  ruleMatched: boolean
  needManualReview: boolean
  delayStatus: DelayStatus
}

type ArrivalRule = {
  supplier: string
  store: string
  normalTime: string
}

const stores: StoreItem[] = [
  { id: 'hz1', name: '杭州一店', radius: 100, location: '浙江省杭州市拱墅区石桥街道石祥路138号中大银泰城购物中心地下一层B131A号', lat: 30.327759, lng: 120.177118 },
  { id: 'hz2', name: '杭州二店', radius: 100, location: '浙江省杭州市拱墅区祥符街道杭行路666号万达商业中心4幢2单元442室-2（铺位号4F01、4F02A）', lat: null, lng: null },
  { id: 'nb1', name: '宁波一店', radius: 100, location: '浙江省宁波市海曙区环城西路南段858号A-2F-26，A-2F-27，A-2F-28，A-2F-29b', lat: null, lng: null },
  { id: 'nb2', name: '宁波二店', radius: 100, location: '浙江省宁波市鄞州区首南街道天童南路1088号、句章东路999号（宁波环球银泰城内购物中心F3层303号）', lat: 29.796625, lng: 121.545412 },
  { id: 'tz1', name: '台州一店', radius: 100, location: '浙江省台州市椒江区白云街道万达广场北区101号3F层3F-C号商铺', lat: 28.636075, lng: 121.417475 },
  { id: 'yq1', name: '乐清一店', radius: 100, location: '浙江省温州市乐清市城南街道宴海西路77号乐清正大广场银泰百货F3层L3-006号', lat: null, lng: null },
  { id: 'wz1', name: '温州一店', radius: 100, location: '浙江省温州市鹿城区大南街道解放南路9号地块（温州世贸中心B1至八层）8F-B001号', lat: 28.00671, lng: 120.664709 },
  { id: 'wz2', name: '温州二店', radius: 100, location: '浙江省温州市龙湾区蒲州街道上江路150号吾悦广场5018/5021/5022/5023/5025', lat: 27.985906, lng: 120.723206 },

  { id: 'fz1', name: '福州一店', radius: 100, location: '福建省福州市台江区上海街道工业路199号中防万宝城商铺L1层QSL1-038、039、048-1、049、050、051、052、053号', lat: 26.061127, lng: 119.289818 },
  { id: 'fz4', name: '福州四店', radius: 100, location: '福建省福州市长乐区吴航郑和中路3号十洋商务广场4层，铺位号：4-8/4-9/4-10-4-11', lat: 25.957138, lng: 119.51598 },
  { id: 'fz5', name: '福州五店', radius: 100, location: '福建省福州市仓山区金山街道浦上大道306号一品商务汇购物广场第四层L401、L402、L403、L404、L405、L406号商铺', lat: 26.033796, lng: 119.267965 },
  { id: 'fz6', name: '福州六店', radius: 100, location: '福建省福州市鼓楼区鼓东街道五四路128号恒力城地下一层012-018号商铺', lat: 26.091576, lng: 119.305516 },
  { id: 'fz8', name: '福州八店', radius: 100, location: '福州市鼓楼区八一七北路133号国际商厦大洋商场5楼（L5-01）铺位', lat: 26.084251, lng: 119.30072 },
  { id: 'fz9', name: '福州九店', radius: 100, location: '福建省福州市台江区八一七中路760号群升商城二期E2#楼负一层01商场', lat: 26.058715, lng: 119.305074 },
  { id: 'fq1', name: '福清一店', radius: 100, location: '福建省福清市龙山利桥街303号东百利桥古街B1F层B2-b1013/B2-b1015/B2-b1016/B2-b1018-1/B2-b1018-2/B2-b1018-3店铺', lat: 25.715155, lng: 119.383702 },
  { id: 'pt1', name: '莆田一店', radius: 100, location: '福建省莆田市荔城区镇海街道八二一南街42号101室2F-07-24号商铺', lat: 25.429302, lng: 119.022054 },
  { id: 'nd1', name: '宁德一店', radius: 100, location: '福建省宁德市蕉城区天湖东路2-1-1号', lat: 26.650777, lng: 119.537544 },

  { id: 'fz3', name: '福州三店', radius: 100, location: '福建省福州市台江区鳌峰街道鳌江路8号（江滨中大道北侧、曙光路东侧）福州金融街万达广场二期D区地下室地下1层超市1-A-A-A-1', lat: 26.051435, lng: 119.341614 },
  { id: 'fz10', name: '福州十店', radius: 100, location: '福建省福州市台江区工业路378号万象生活城406、407、408、410、421号商铺', lat: 26.064721, lng: 119.290138 },
  { id: 'fz7', name: '福州七店', radius: 100, location: '福建省福州市晋安区化工路198号东二环泰禾城市广场泰禾商务中心二区B地块项目5号楼负壹层C006-C011/C013-C019/C021-C022/C028-C036/C037', lat: 26.08982, lng: 119.339866 },
  { id: 'fz11', name: '福州十一店', radius: 100, location: '福建省福州市晋安区新店镇坂中路6号五四北泰禾城市广场（三期）6#楼五层L511', lat: 26.139831, lng: 119.323835 },

  { id: 'xm1', name: '厦门一店', radius: 100, location: '厦门市思明区厦禾路882-888号世贸商城禹悦汇A区514-3、514-1-5', lat: 24.46778, lng: 118.113791 },
  { id: 'xm2', name: '厦门二店', radius: 100, location: '厦门市湖里区仙岳路4688号银泰百货B101、B122-B123、B124商铺', lat: 24.506943, lng: 118.18008 },
  { id: 'xm3', name: '厦门三店', radius: 100, location: '福建省厦门市集美区同集南路68号332室', lat: 24.589729, lng: 118.106569 },

  { id: 'ly1', name: '龙岩一店', radius: 100, location: '福建省龙岩市新罗区龙岩大道中688号裙楼JH2015-1、JH2015-2、JH2015-3', lat: 25.086164, lng: 117.021336 },
  { id: 'qz1', name: '泉州一店', radius: 100, location: '福建省泉州市鲤城区新华北路366号开元盛世广场G层142-151号商铺', lat: 24.917738, lng: 118.585063 },
  { id: 'ha1', name: '惠安一店', radius: 100, location: '福建省惠安县螺阳镇世纪大道1899号禹州城市广场6#B购物中心二层2057号商铺', lat: 24.718073, lng: 118.624234 },
  { id: 'zz1', name: '漳州一店', radius: 100, location: '福建省漳州市龙文区建元东路2号万达广场A1地块商场百货4F室401', lat: 24.49787, lng: 117.678387 },
  { id: 'sm1', name: '三明一店', radius: 100, location: '福建省三明市三元区东乾二路1号（万达广场15幢大型商业综合体3F-B）', lat: 26.28424, lng: 117.661712 },
]

const suppliers = [
  '建伟水产摊',
  '高绍安水产',
  '合顺昌贸易有限公司',
  '邵明芳水产',
  '志中海鲜批发',
  '蠔倍佳水产',
  '福建省康晶贸易有限公司',
  '海中舟',
  '配送部',
]

const categories = ['活鲜', '冻品', '蔬菜', '其他物料']
const exceptionReasons = ['定位异常', '司机未带货', '到店延迟', '信息填写错误', '其他']

const arrivalRules: ArrivalRule[] = [
  { supplier: '建伟水产摊', store: '福州一店', normalTime: '10:00' },
  { supplier: '建伟水产摊', store: '福州四店', normalTime: '9:30' },
  { supplier: '建伟水产摊', store: '福州五店', normalTime: '9:30' },
  { supplier: '建伟水产摊', store: '福州六店', normalTime: '9:30' },
  { supplier: '建伟水产摊', store: '福州八店', normalTime: '9:30' },
  { supplier: '建伟水产摊', store: '福州九店', normalTime: '8:30-9:30' },
  { supplier: '建伟水产摊', store: '宁德一店', normalTime: '9:30-9:50' },
  { supplier: '建伟水产摊', store: '莆田一店', normalTime: '9:00-9:30' },
  { supplier: '建伟水产摊', store: '福清一店', normalTime: '9:00-9:20' },

  { supplier: '高绍安水产', store: '福州三店', normalTime: '8:30-9:00' },

  { supplier: '合顺昌贸易有限公司', store: '厦门一店', normalTime: '8:40-9:00' },
  { supplier: '合顺昌贸易有限公司', store: '厦门二店', normalTime: '9:00' },
  { supplier: '合顺昌贸易有限公司', store: '厦门三店', normalTime: '8:10-8:30' },
  { supplier: '合顺昌贸易有限公司', store: '厦门四店', normalTime: '8:30' },
  { supplier: '合顺昌贸易有限公司', store: '泉州一店', normalTime: '9:00' },
  { supplier: '合顺昌贸易有限公司', store: '泉州二店', normalTime: '8:30-9:00' },
  { supplier: '合顺昌贸易有限公司', store: '龙岩一店', normalTime: '8:30-9:00' },
  { supplier: '合顺昌贸易有限公司', store: '杭州一店', normalTime: '8:00' },
  { supplier: '合顺昌贸易有限公司', store: '杭州二店', normalTime: '8:00' },
  { supplier: '合顺昌贸易有限公司', store: '宁波一店', normalTime: '8:00' },
  { supplier: '合顺昌贸易有限公司', store: '宁波二店', normalTime: '8:00' },

  { supplier: '邵明芳水产', store: '福州一店', normalTime: '8:00-8:30' },
  { supplier: '邵明芳水产', store: '福州四店', normalTime: '9:00' },
  { supplier: '邵明芳水产', store: '福州六店', normalTime: '8:30-9:00' },
  { supplier: '邵明芳水产', store: '福州七店', normalTime: '8:00-8:20' },
  { supplier: '邵明芳水产', store: '福州八店', normalTime: '9:00-9:30' },
  { supplier: '邵明芳水产', store: '福州十店', normalTime: '8:30' },
  { supplier: '邵明芳水产', store: '宁德一店', normalTime: '9:30-9:50' },
  { supplier: '邵明芳水产', store: '莆田一店', normalTime: '9:00-9:30' },
  { supplier: '邵明芳水产', store: '福清一店', normalTime: '9:00-9:20' },

  { supplier: '福建省康晶贸易有限公司', store: '福州一店', normalTime: '8:00' },
  { supplier: '福建省康晶贸易有限公司', store: '福州三店', normalTime: '8:30' },
  { supplier: '福建省康晶贸易有限公司', store: '福州五店', normalTime: '9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '福州七店', normalTime: '8:30' },
  { supplier: '福建省康晶贸易有限公司', store: '福州八店', normalTime: '8:30' },
  { supplier: '福建省康晶贸易有限公司', store: '福州九店', normalTime: '8:30-9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '福州十店', normalTime: '9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '福州十一店', normalTime: '9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '泉州一店', normalTime: '8:30' },
  { supplier: '福建省康晶贸易有限公司', store: '厦门一店', normalTime: '9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '厦门二店', normalTime: '8:00' },
  { supplier: '福建省康晶贸易有限公司', store: '厦门四店', normalTime: '9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '温州一店', normalTime: '8:30-9:00' },
  { supplier: '福建省康晶贸易有限公司', store: '温州二店', normalTime: '8:30' },
  { supplier: '福建省康晶贸易有限公司', store: '台州一店', normalTime: '8:30' },
  { supplier: '福建省康晶贸易有限公司', store: '乐清一店', normalTime: '5:30' },

  { supplier: '海中舟', store: '福州十店', normalTime: '8:30-9:00' },

  { supplier: '志中海鲜批发', store: '漳州一店', normalTime: '8:30-9:00' },
  { supplier: '志中海鲜批发', store: '三明一店', normalTime: '9:00' },

  { supplier: '蠔倍佳水产', store: '宁德一店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '莆田一店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '福清一店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '厦门二店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '厦门三店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '厦门四店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '泉州一店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '泉州二店', normalTime: '10:30前' },
  { supplier: '蠔倍佳水产', store: '温州一店', normalTime: '7:30-8:30' },
  { supplier: '蠔倍佳水产', store: '温州二店', normalTime: '8:30' },
  { supplier: '蠔倍佳水产', store: '杭州一店', normalTime: '10:00前' },
  { supplier: '蠔倍佳水产', store: '杭州二店', normalTime: '8:30' },
  { supplier: '蠔倍佳水产', store: '乐清一店', normalTime: '10:30前' },
]

function formatDateTime(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function todayStr() {
  return formatDateTime().slice(0, 10)
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function calcDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function normalizeTimeText(text: string) {
  return text.replaceAll('：', ':').replace(/\s+/g, '')
}

function parseClockToMinutes(text: string) {
  const normalized = normalizeTimeText(text)
  const parts = normalized.split(':')
  if (parts.length === 1) {
    const hour = Number(parts[0])
    if (Number.isNaN(hour)) return null
    return hour * 60
  }
  const hour = Number(parts[0])
  const minute = Number(parts[1])
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null
  return hour * 60 + minute
}

function extractLatestMinutes(normalTime: string) {
  const text = normalizeTimeText(normalTime)
  if (!text) return null

  if (text.includes('-')) {
    const arr = text.split('-')
    return parseClockToMinutes(arr[arr.length - 1])
  }

  if (text.endsWith('前')) {
    return parseClockToMinutes(text.replace('前', ''))
  }

  return parseClockToMinutes(text)
}

function formatMinutesToText(totalMinutes: number | null) {
  if (totalMinutes == null) return '-'
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function getArrivalRule(supplier: string, store: string) {
  return arrivalRules.find((item) => item.supplier === supplier && item.store === store) ?? null
}

const box: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 16,
  boxSizing: 'border-box',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  boxSizing: 'border-box',
  fontSize: 16,
  minHeight: 44,
}

const buttonStyle = (primary = true): React.CSSProperties => ({
  padding: '10px 14px',
  borderRadius: 12,
  border: primary ? 'none' : '1px solid #cbd5e1',
  background: primary ? '#0f172a' : '#fff',
  color: primary ? '#fff' : '#0f172a',
  cursor: 'pointer',
  fontWeight: 600,
  minHeight: 44,
})

function MobileRecordCard({ record }: { record: RecordItem }) {
  const judgeColor =
    record.delayStatus === '迟到'
      ? '#dc2626'
      : record.delayStatus === '待人工判断'
      ? '#92400e'
      : '#166534'

  return (
    <div style={{ ...box, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <div style={{ fontWeight: 700 }}>{record.store}</div>
        <div style={{ color: judgeColor, fontWeight: 700 }}>{record.delayStatus === '迟到' ? `迟到 ${record.lateMinutes} 分钟` : record.delayStatus}</div>
      </div>
      <div style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14, lineHeight: 1.7 }}>
        <div><span style={{ color: '#64748b' }}>供应商：</span>{record.supplier}</div>
        <div><span style={{ color: '#64748b' }}>打卡时间：</span>{record.time}</div>
        <div><span style={{ color: '#64748b' }}>送货品类：</span>{record.category}</div>
        <div><span style={{ color: '#64748b' }}>批次：</span>{record.batch}</div>
        <div><span style={{ color: '#64748b' }}>定位：</span>{record.geoPassed ? `通过（${record.distance}米）` : '未通过'}</div>
        <div><span style={{ color: '#64748b' }}>规则状态：</span>{record.ruleMatched ? '已匹配' : '未匹配'}</div>
        <div><span style={{ color: '#64748b' }}>状态：</span>{record.status}</div>
      </div>
    </div>
  )
}

export default function App() {
  const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const [screenWidth, setScreenWidth] = useState<number>(initialWidth)
  const isMobile = screenWidth < 768

  const [desktopTab, setDesktopTab] = useState<DesktopTabKey>('driver')
  const [mobileTab, setMobileTab] = useState<MobileTabKey>('driver')

  const [selectedStoreId, setSelectedStoreId] = useState('qz1')
  const [storeLocked, setStoreLocked] = useState(false)

  const [currentSupplier, setCurrentSupplier] = useState('')
  const [category, setCategory] = useState('')
  const [deliveryBatch, setDeliveryBatch] = useState('上午批次')

  const [distance, setDistance] = useState<number | null>(null)
  const [geoPassed, setGeoPassed] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const [useMockLocation, setUseMockLocation] = useState(true)
  const [mockLng, setMockLng] = useState('119.341179')
  const [mockLat, setMockLat] = useState('26.053821')

  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [exceptionReason, setExceptionReason] = useState('')
  const [exceptionRemark, setExceptionRemark] = useState('')

  const [historyKeyword, setHistoryKeyword] = useState('')
  const [historySupplier, setHistorySupplier] = useState('all')
  const [lastRecord, setLastRecord] = useState<RecordItem | null>(null)

  const [records, setRecords] = useState<RecordItem[]>([
    {
      id: 'REC-20260406-001',
      date: '2026-04-06',
      time: '2026-04-06 10:23:18',
      store: '泉州一店',
      supplier: '福建省康晶贸易有限公司',
      category: '活鲜',
      batch: '上午批次',
      geoPassed: true,
      distance: 28,
      photoUploaded: true,
      exceptionReason: '',
      exceptionRemark: '',
      status: '已打卡',
      normalArrivalTime: '8:30',
      latestArrivalTime: '08:30',
      isLate: true,
      lateMinutes: 113,
      ruleMatched: true,
      needManualReview: false,
      delayStatus: '迟到',
    },
    {
      id: 'REC-20260406-002',
      date: '2026-04-06',
      time: '2026-04-06 08:15:00',
      store: '福州三店',
      supplier: '建伟水产摊',
      category: '活鲜',
      batch: '上午批次',
      geoPassed: true,
      distance: 35,
      photoUploaded: true,
      exceptionReason: '',
      exceptionRemark: '临时补货供应商',
      status: '已打卡',
      normalArrivalTime: '-',
      latestArrivalTime: '-',
      isLate: false,
      lateMinutes: 0,
      ruleMatched: false,
      needManualReview: true,
      delayStatus: '待人工判断',
    },
    {
      id: 'REC-20260406-003',
      date: '2026-04-06',
      time: '2026-04-06 08:34:00',
      store: '三明一店',
      supplier: '志中海鲜批发',
      category: '活鲜',
      batch: '上午批次',
      geoPassed: true,
      distance: 26,
      photoUploaded: true,
      exceptionReason: '',
      exceptionRemark: '',
      status: '已打卡',
      normalArrivalTime: '9:00',
      latestArrivalTime: '09:00',
      isLate: false,
      lateMinutes: 0,
      ruleMatched: true,
      needManualReview: false,
      delayStatus: '未迟到',
    },
    {
      id: 'REC-20260406-004',
      date: '2026-04-06',
      time: '2026-04-06 11:12:44',
      store: '福州一店',
      supplier: '合顺昌贸易有限公司',
      category: '冻品',
      batch: '上午批次',
      geoPassed: true,
      distance: 41,
      photoUploaded: true,
      exceptionReason: '',
      exceptionRemark: '',
      status: '已打卡',
      normalArrivalTime: '-',
      latestArrivalTime: '-',
      isLate: false,
      lateMinutes: 0,
      ruleMatched: false,
      needManualReview: true,
      delayStatus: '待人工判断',
    },
  ])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const storeFromUrl = params.get('store')
    const viewFromUrl = params.get('view')

    if (storeFromUrl) {
      const matchedStore = stores.find((item) => item.id === storeFromUrl)
      if (matchedStore) {
        setSelectedStoreId(matchedStore.id)
        setStoreLocked(true)
      }
    }

    if (viewFromUrl === 'driver' || viewFromUrl === 'success') {
      setDesktopTab(viewFromUrl)
      setMobileTab(viewFromUrl === 'driver' ? 'driver' : 'success')
    }

    if (viewFromUrl === 'history') {
      setDesktopTab('history')
      setMobileTab('recent')
    }

    if (viewFromUrl === 'records') {
      setDesktopTab('records')
      setMobileTab('recent')
    }
  }, [])

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedStoreId) ?? stores[0],
    [selectedStoreId]
  )

  const currentRule = useMemo(() => {
    if (!currentSupplier || !selectedStore?.name) return null
    return getArrivalRule(currentSupplier, selectedStore.name)
  }, [currentSupplier, selectedStore])

  const currentLatestMinutes = useMemo(() => {
    if (!currentRule) return null
    return extractLatestMinutes(currentRule.normalTime)
  }, [currentRule])

  const currentLatestTimeText = useMemo(
    () => formatMinutesToText(currentLatestMinutes),
    [currentLatestMinutes]
  )

  const currentRuleMatched = !!currentRule
  const canSubmit = !!currentSupplier && !!category && geoPassed && photoUploaded

  const visibleRecords = useMemo(() => {
    if (storeLocked) {
      return records.filter((r) => r.store === selectedStore.name)
    }
    return records
  }, [records, storeLocked, selectedStore])

  const historyFiltered = useMemo(() => {
    return visibleRecords.filter((r) => {
      const kw = historyKeyword.trim()
      const matchKw = !kw || [r.id, r.store, r.supplier].some((v) => String(v).includes(kw))
      const matchSupplier = historySupplier === 'all' || r.supplier === historySupplier
      return matchKw && matchSupplier
    })
  }, [visibleRecords, historyKeyword, historySupplier])

  const recentRecords = useMemo(() => historyFiltered.slice(0, 20), [historyFiltered])

  const statToday = visibleRecords.filter((r) => r.date === todayStr()).length
  const statGeoPass = visibleRecords.filter((r) => r.geoPassed).length
  const statManualReview = visibleRecords.filter((r) => r.needManualReview).length

  const handleGeoCheck = () => {
    if (selectedStore.lat == null || selectedStore.lng == null) {
      setDistance(null)
      setGeoPassed(false)
      setLocationMessage('当前门店经纬度未补充，暂时无法进行定位校验。')
      return
    }

    const runCheck = (lat: number, lng: number, label: string) => {
      const meter = calcDistanceMeters(lat, lng, selectedStore.lat as number, selectedStore.lng as number)
      const passed = meter <= selectedStore.radius
      setDistance(meter)
      setGeoPassed(passed)
      setLocationMessage(
        `${label}：当前距离门店约 ${meter} 米，${passed ? '已进入100米范围内，可完成打卡。' : '未进入100米范围内，暂无法打卡。'}`
      )
    }

    if (useMockLocation) {
      const lng = Number(mockLng)
      const lat = Number(mockLat)
      if (Number.isNaN(lng) || Number.isNaN(lat)) {
        setDistance(null)
        setGeoPassed(false)
        setLocationMessage('测试定位坐标格式错误，请检查经纬度。')
        return
      }
      runCheck(lat, lng, '测试定位')
      return
    }

    if (!navigator.geolocation) {
      setLocationMessage('当前设备或浏览器不支持定位。')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => runCheck(position.coords.latitude, position.coords.longitude, '真实定位'),
      () => setLocationMessage('真实定位失败，请允许定位权限后重试。'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleCheckIn = () => {
    if (!canSubmit) return

    const now = new Date()
    const time = formatDateTime(now)
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const ruleMatched = !!currentRule
    const needManualReview = !ruleMatched

    let isLate = false
    let lateMinutes = 0
    let delayStatus: DelayStatus = '待人工判断'

    if (ruleMatched) {
      const latestMinutes = currentLatestMinutes
      isLate = latestMinutes != null ? nowMinutes > latestMinutes : false
      lateMinutes = latestMinutes != null && isLate ? nowMinutes - latestMinutes : 0
      delayStatus = isLate ? '迟到' : '未迟到'
    }

    const rec: RecordItem = {
      id: `REC-${time.replace(/[-: ]/g, '').slice(0, 14)}`,
      date: todayStr(),
      time,
      store: selectedStore.name,
      supplier: currentSupplier,
      category,
      batch: deliveryBatch,
      geoPassed,
      distance: distance ?? 0,
      photoUploaded,
      exceptionReason,
      exceptionRemark,
      status: exceptionReason ? '异常待处理' : '已打卡',
      normalArrivalTime: currentRule?.normalTime ?? '-',
      latestArrivalTime: ruleMatched ? currentLatestTimeText : '-',
      isLate,
      lateMinutes,
      ruleMatched,
      needManualReview,
      delayStatus,
    }

    setRecords((prev) => [rec, ...prev])
    setLastRecord(rec)

    setCurrentSupplier('')
    setCategory('')
    setDeliveryBatch('上午批次')
    setDistance(null)
    setGeoPassed(false)
    setLocationMessage('')
    setPhotoUploaded(false)
    setExceptionReason('')
    setExceptionRemark('')

    setDesktopTab('success')
    setMobileTab('success')
  }

  const exportCsv = (period: ExportPeriod) => {
    const headers = [
      '记录编号',
      '打卡日期',
      '打卡时间',
      '门店名称',
      '所属供应商',
      '送货品类',
      '批次',
      '定位通过',
      '距离(米)',
      '照片',
      '规则状态',
      '人工复核',
      '正常到货时间',
      '最晚到货时间',
      '判定状态',
      '是否迟到',
      '迟到分钟数',
      '异常原因',
      '异常备注',
      '状态',
    ]

    const rows = historyFiltered.map((r) => [
      r.id,
      r.date,
      r.time,
      r.store,
      r.supplier,
      r.category,
      r.batch,
      r.geoPassed ? '是' : '否',
      r.distance,
      r.photoUploaded ? '已上传' : '未上传',
      r.ruleMatched ? '已匹配' : '未匹配',
      r.needManualReview ? '是' : '否',
      r.normalArrivalTime,
      r.latestArrivalTime,
      r.delayStatus,
      r.isLate ? '是' : '否',
      r.lateMinutes,
      r.exceptionReason || '',
      r.exceptionRemark || '',
      r.status,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const periodLabel = period === 'day' ? '日' : period === 'week' ? '周' : '月'
    const storeLabel = storeLocked ? `_${selectedStore.name}` : '_全部门店'
    a.download = `司机到店打卡记录${storeLabel}_${periodLabel}_${todayStr()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))',
  }

  const desktopTabGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
    gap: 8,
    background: '#f1f5f9',
    padding: 6,
    borderRadius: 14,
    marginBottom: 20,
  }

  const mobileTabGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: 8,
    background: '#f1f5f9',
    padding: 6,
    borderRadius: 14,
    marginBottom: 20,
  }

  const driverContent = (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.2fr) minmax(0,0.8fr)',
      }}
    >
      <div style={{ ...box, padding: isMobile ? 14 : 20 }}>
        <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Store size={20} /> 门店二维码打卡入口
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>当前门店</div>
            <select
              style={inputStyle}
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              disabled={storeLocked}
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            {storeLocked && (
              <div style={{ fontSize: 13, color: '#166534', marginTop: 6, lineHeight: 1.6 }}>
                当前页面由门店二维码进入，门店已自动锁定。
              </div>
            )}
          </div>

          <div style={{ ...box, background: '#f8fafc', padding: isMobile ? 14 : 16 }}>
            <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>二维码绑定信息</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>门店：{selectedStore.name}</div>
            <div style={{ color: '#475569', fontSize: 14, marginBottom: 6, lineHeight: 1.8, wordBreak: 'break-all' }}>
              收货地址：{selectedStore.location}
            </div>
            <div style={{ color: '#475569', fontSize: 14, marginBottom: 4 }}>打卡半径：100 米</div>
            <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>
              经纬度：{selectedStore.lat ?? '-'} / {selectedStore.lng ?? '-'}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            }}
          >
            <div>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>所属供应商</div>
              <select style={inputStyle} value={currentSupplier} onChange={(e) => setCurrentSupplier(e.target.value)}>
                <option value="">请选择供应商</option>
                {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>送货品类</div>
              <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">请选择送货品类</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>送货批次</div>
            <select style={inputStyle} value={deliveryBatch} onChange={(e) => setDeliveryBatch(e.target.value)}>
              <option value="上午批次">上午批次</option>
              <option value="下午批次">下午批次</option>
              <option value="晚间补货">晚间补货</option>
            </select>
          </div>

          <div style={{ ...box, background: '#f8fafc', padding: isMobile ? 14 : 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>到货规则提示</div>

            {currentRuleMatched ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <div><span style={{ color: '#64748b' }}>规则状态：</span>已匹配</div>
                <div><span style={{ color: '#64748b' }}>正常到货时间：</span>{currentRule?.normalTime}</div>
                <div><span style={{ color: '#64748b' }}>最晚到货时间：</span>{currentLatestTimeText}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
                  本次打卡会按该供应商在当前门店的预设规则自动判定是否迟到。
                </div>
              </div>
            ) : currentSupplier ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <div><span style={{ color: '#64748b' }}>规则状态：</span>未匹配</div>
                <div><span style={{ color: '#64748b' }}>正常到货时间：</span>未配置</div>
                <div><span style={{ color: '#64748b' }}>最晚到货时间：</span>未配置</div>
                <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
                  当前供应商在本门店暂无预设规则，允许正常提交打卡，后台会标记为“待人工判断”。
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
                请选择供应商后查看当前门店的到货规则。
              </div>
            )}
          </div>

          <div style={{ ...box, padding: isMobile ? 14 : 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700 }}>定位校验</div>
                <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>测试定位或真实定位都可以，100米内才能打卡。</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: geoPassed ? '#166534' : '#334155', whiteSpace: 'nowrap' }}>
                {geoPassed ? '已通过' : '待校验'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <button style={buttonStyle(useMockLocation)} onClick={() => setUseMockLocation(true)}>使用测试定位</button>
              <button style={buttonStyle(!useMockLocation)} onClick={() => setUseMockLocation(false)}>使用真实定位</button>
            </div>

            {useMockLocation && (
              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  marginBottom: 10,
                }}
              >
                <input style={inputStyle} value={mockLng} onChange={(e) => setMockLng(e.target.value)} placeholder="测试经度" />
                <input style={inputStyle} value={mockLat} onChange={(e) => setMockLat(e.target.value)} placeholder="测试纬度" />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
              <button style={buttonStyle(true)} onClick={handleGeoCheck}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <LocateFixed size={16} />
                  {useMockLocation ? '按测试定位校验' : '获取真实定位并校验'}
                </span>
              </button>
              {distance !== null && <div style={{ fontSize: 14 }}>当前距离门店约 <strong>{distance} 米</strong></div>}
            </div>

            {locationMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  fontSize: 14,
                  padding: 10,
                  borderRadius: 10,
                  background: geoPassed ? '#f0fdf4' : '#fffbeb',
                  color: geoPassed ? '#166534' : '#92400e',
                  lineHeight: 1.7,
                }}
              >
                {geoPassed ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{locationMessage}</span>
              </div>
            )}
          </div>

          <div style={{ ...box, padding: isMobile ? 14 : 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                <Camera size={16} /> 现场拍照打卡
              </div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{photoUploaded ? '已上传' : '待上传'}</div>
            </div>
            <button style={buttonStyle(false)} onClick={() => setPhotoUploaded(true)}>上传现场照片</button>
          </div>

          <div style={{ ...box, padding: isMobile ? 14 : 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 10 }}>
              <CircleAlert size={16} /> 异常原因填写
            </div>
            <div
              style={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              }}
            >
              <div>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>异常原因</div>
                <select style={inputStyle} value={exceptionReason} onChange={(e) => setExceptionReason(e.target.value)}>
                  <option value="">无异常可不填</option>
                  {exceptionReasons.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>异常备注</div>
                <input
                  style={inputStyle}
                  placeholder="可补充具体异常情况"
                  value={exceptionRemark}
                  onChange={(e) => setExceptionRemark(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={!canSubmit}
            style={{
              ...buttonStyle(true),
              width: '100%',
              minHeight: 48,
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            确认打卡并记录到店时间
          </button>
        </div>
      </div>

      {!isMobile && (
        <div style={{ ...box, padding: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>当前版本规则说明</div>
          <div style={{ color: '#64748b', marginBottom: 12, lineHeight: 1.7 }}>
            手机端只做打卡和最近记录，电脑端负责完整历史、后台表格和导出。
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.9, color: '#334155' }}>
            <li>有规则：自动判定未迟到或迟到</li>
            <li>无规则：标记为待人工判断</li>
            <li>支持临时供应商送货打卡</li>
            <li>门店二维码可隔离查看本店数据</li>
            <li>手机端不展示后台大表格</li>
            <li>电脑端保留导出和复核</li>
          </ul>
        </div>
      )}
    </div>
  )

  const successContent = (
    <div style={{ ...box, maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 999, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle2 size={36} />
      </div>
      <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>
        打卡成功，已记录到店时间
      </div>
      <div style={{ color: '#64748b', marginBottom: 18, lineHeight: 1.7 }}>
        成功提交后会自动新增一条后台记录，并根据规则状态写入迟到或待人工判断。
      </div>
      <div style={{ ...box, background: '#f8fafc', textAlign: 'left', marginBottom: 18, lineHeight: 1.8 }}>
        <div><span style={{ color: '#64748b' }}>门店：</span>{lastRecord?.store || selectedStore.name}</div>
        <div><span style={{ color: '#64748b' }}>所属供应商：</span>{lastRecord?.supplier || '-'}</div>
        <div><span style={{ color: '#64748b' }}>打卡时间：</span>{lastRecord?.time || formatDateTime()}</div>
        <div><span style={{ color: '#64748b' }}>规则状态：</span>{lastRecord?.ruleMatched ? '已匹配' : '未匹配'}</div>
        <div><span style={{ color: '#64748b' }}>正常到货时间：</span>{lastRecord?.normalArrivalTime || '-'}</div>
        <div><span style={{ color: '#64748b' }}>最晚到货时间：</span>{lastRecord?.latestArrivalTime || '-'}</div>
        <div><span style={{ color: '#64748b' }}>判定状态：</span>{lastRecord?.delayStatus || '-'}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          style={buttonStyle(false)}
          onClick={() => {
            setDesktopTab('driver')
            setMobileTab('driver')
          }}
        >
          继续打卡
        </button>
        {!isMobile && (
          <button
            style={buttonStyle(true)}
            onClick={() => setDesktopTab('records')}
          >
            查看后台记录
          </button>
        )}
        {isMobile && (
          <button
            style={buttonStyle(true)}
            onClick={() => setMobileTab('recent')}
          >
            查看最近记录
          </button>
        )}
      </div>
    </div>
  )

  const mobileRecentContent = (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ ...box, padding: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>最近记录</div>
        <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
          手机端仅展示最近记录卡片，完整历史和后台导出请在电脑端查看。
        </div>
      </div>

      {recentRecords.length === 0 ? (
        <div style={{ ...box, color: '#64748b' }}>当前没有可显示的记录。</div>
      ) : (
        recentRecords.map((record) => <MobileRecordCard key={record.id} record={record} />)
      )}
    </div>
  )

  const desktopHistoryContent = (
    <div style={box}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>司机历史记录查询</div>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: '1fr 220px 260px',
          marginBottom: 16,
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 14, color: '#94a3b8' }} />
          <input
            style={{ ...inputStyle, paddingLeft: 34 }}
            value={historyKeyword}
            onChange={(e) => setHistoryKeyword(e.target.value)}
            placeholder="搜索供应商、门店、记录编号"
          />
        </div>
        <select
          style={inputStyle}
          value={historySupplier}
          onChange={(e) => setHistorySupplier(e.target.value)}
        >
          <option value="all">全部供应商</option>
          {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={buttonStyle(false)} onClick={() => exportCsv('day')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FileDown size={16} /> 导出日
            </span>
          </button>
          <button style={buttonStyle(false)} onClick={() => exportCsv('week')}>导出周</button>
          <button style={buttonStyle(false)} onClick={() => exportCsv('month')}>导出月</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['记录编号', '门店', '供应商', '打卡时间', '规则状态', '判定状态', '状态'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyFiltered.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.id}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.store}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.supplier}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.time}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                  {r.ruleMatched ? '已匹配' : '未匹配'}
                </td>
                <td
                  style={{
                    padding: 12,
                    borderBottom: '1px solid #e2e8f0',
                    whiteSpace: 'nowrap',
                    color:
                      r.delayStatus === '迟到'
                        ? '#dc2626'
                        : r.delayStatus === '待人工判断'
                        ? '#92400e'
                        : '#166534',
                  }}
                >
                  {r.delayStatus === '迟到' ? `迟到 ${r.lateMinutes} 分钟` : r.delayStatus}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const desktopRecordsContent = (
    <div style={box}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>送货司机到店打卡记录表</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: 1900, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {[
                '记录编号',
                '打卡日期',
                '打卡时间',
                '门店名称',
                '所属供应商',
                '送货品类',
                '批次',
                '定位通过',
                '距离(米)',
                '照片',
                '规则状态',
                '人工复核',
                '正常到货时间',
                '最晚到货时间',
                '判定状态',
                '是否迟到',
                '迟到分钟数',
                '异常原因',
                '异常备注',
                '状态',
              ].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyFiltered.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.id}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.date}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.time}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.store}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.supplier}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.category}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.batch}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.geoPassed ? '是' : '否'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.distance}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.photoUploaded ? '已上传' : '未上传'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.ruleMatched ? '已匹配' : '未匹配'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.needManualReview ? '是' : '否'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.normalArrivalTime}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.latestArrivalTime}</td>
                <td
                  style={{
                    padding: 12,
                    borderBottom: '1px solid #e2e8f0',
                    whiteSpace: 'nowrap',
                    color:
                      r.delayStatus === '迟到'
                        ? '#dc2626'
                        : r.delayStatus === '待人工判断'
                        ? '#92400e'
                        : '#166534',
                  }}
                >
                  {r.delayStatus}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.isLate ? '是' : '否'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.lateMinutes}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.exceptionReason || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.exceptionRemark || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: isMobile ? 12 : 16 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={statsGridStyle}>
          {[
            { icon: <QrCode size={24} />, label: '打卡模式', value: '门店二维码' },
            { icon: <Clock3 size={24} />, label: '今日打卡', value: String(statToday) },
            { icon: <MapPin size={24} />, label: '定位通过', value: String(statGeoPass) },
            { icon: <ClipboardCheck size={24} />, label: '待人工判断', value: String(statManualReview) },
          ].map((item) => (
            <div key={item.label} style={{ ...box, display: 'flex', gap: 10, alignItems: 'center', padding: isMobile ? 12 : 16 }}>
              {item.icon}
              <div>
                <div style={{ color: '#64748b', fontSize: isMobile ? 12 : 14 }}>{item.label}</div>
                <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={box}>
          <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, marginBottom: 8, textAlign: 'center', lineHeight: 1.2 }}>
            司机到店扫码打卡业务原型
          </div>
          <div style={{ color: '#475569', marginBottom: 16, textAlign: 'center', fontSize: isMobile ? 14 : 18, lineHeight: 1.6 }}>
            手机端精简为打卡与最近记录，电脑端保留完整后台表格与导出功能。
          </div>

          {storeLocked && (
            <div
              style={{
                ...box,
                marginBottom: 16,
                background: '#f8fafc',
                borderColor: '#cbd5e1',
                lineHeight: 1.7,
              }}
            >
              当前为门店专属查看模式，仅显示：
              <strong> {selectedStore.name} </strong>
              的记录。
            </div>
          )}

          {!isMobile && (
            <div style={desktopTabGridStyle}>
              {[
                { key: 'driver', label: '司机打卡页' },
                { key: 'history', label: '司机历史查询' },
                { key: 'success', label: '打卡成功页' },
                { key: 'records', label: '后台记录表' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setDesktopTab(t.key as DesktopTabKey)}
                  style={{
                    ...buttonStyle(desktopTab === t.key),
                    width: '100%',
                    border: 'none',
                    background: desktopTab === t.key ? '#0f172a' : 'transparent',
                    color: desktopTab === t.key ? '#fff' : '#0f172a',
                    fontSize: 16,
                    padding: '10px 14px',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {isMobile && (
            <div style={mobileTabGridStyle}>
              {[
                { key: 'driver', label: '司机打卡' },
                { key: 'success', label: '打卡成功' },
                { key: 'recent', label: '最近记录' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setMobileTab(t.key as MobileTabKey)}
                  style={{
                    ...buttonStyle(mobileTab === t.key),
                    width: '100%',
                    border: 'none',
                    background: mobileTab === t.key ? '#0f172a' : 'transparent',
                    color: mobileTab === t.key ? '#fff' : '#0f172a',
                    fontSize: 14,
                    padding: '12px 8px',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {!isMobile && desktopTab === 'driver' && driverContent}
          {!isMobile && desktopTab === 'history' && desktopHistoryContent}
          {!isMobile && desktopTab === 'success' && successContent}
          {!isMobile && desktopTab === 'records' && desktopRecordsContent}

          {isMobile && mobileTab === 'driver' && driverContent}
          {isMobile && mobileTab === 'success' && successContent}
          {isMobile && mobileTab === 'recent' && mobileRecentContent}
        </div>
      </div>
    </div>
  )
}
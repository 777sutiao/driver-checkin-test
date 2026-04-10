import React, { useMemo, useState } from 'react'
import {
  QrCode,
  Clock3,
  MapPin,
  Truck,
  Store,
  Camera,
  LocateFixed,
  CheckCircle2,
  Search,
  FileDown,
} from 'lucide-react'

type TabKey = 'driver' | 'history' | 'success' | 'records'
type ExportPeriod = 'day' | 'week' | 'month'

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
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
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
}

const buttonStyle = (primary = true): React.CSSProperties => ({
  padding: '10px 14px',
  borderRadius: 12,
  border: primary ? 'none' : '1px solid #cbd5e1',
  background: primary ? '#0f172a' : '#fff',
  color: primary ? '#fff' : '#0f172a',
  cursor: 'pointer',
  fontWeight: 600,
})

export default function App() {
  const [tab, setTab] = useState<TabKey>('driver')
  const [selectedStoreId, setSelectedStoreId] = useState('qz1')
  const [supplier, setSupplier] = useState('')
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
    },
    {
      id: 'REC-20260406-002',
      date: '2026-04-06',
      time: '2026-04-06 11:12:44',
      store: '福州一店',
      supplier: '合顺昌贸易有限公司',
      category: '冻品',
      batch: '上午批次',
      geoPassed: true,
      distance: 41,
      photoUploaded: false,
      exceptionReason: '信息填写错误',
      exceptionRemark: '批次信息补录',
      status: '异常待处理',
    },
  ])

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedStoreId) ?? stores[0],
    [selectedStoreId]
  )

  const canSubmit = !!supplier && !!category && geoPassed && photoUploaded

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

    const time = formatDateTime()
    const rec: RecordItem = {
      id: `REC-${time.replace(/[-: ]/g, '').slice(0, 14)}`,
      date: todayStr(),
      time,
      store: selectedStore.name,
      supplier,
      category,
      batch: deliveryBatch,
      geoPassed,
      distance: distance ?? 0,
      photoUploaded,
      exceptionReason,
      exceptionRemark,
      status: exceptionReason ? '异常待处理' : '已打卡',
    }

    setRecords((prev) => [rec, ...prev])
    setLastRecord(rec)
    setSupplier('')
    setCategory('')
    setDeliveryBatch('上午批次')
    setDistance(null)
    setGeoPassed(false)
    setLocationMessage('')
    setPhotoUploaded(false)
    setExceptionReason('')
    setExceptionRemark('')
    setTab('success')
  }

  const exportCsv = (period: ExportPeriod) => {
    const headers = ['记录编号', '打卡日期', '打卡时间', '门店名称', '所属供应商', '送货品类', '定位通过', '距离(米)', '照片', '异常原因', '异常备注', '状态']
    const rows = records.map((r) => [
      r.id,
      r.date,
      r.time,
      r.store,
      r.supplier,
      r.category,
      r.geoPassed ? '是' : '否',
      r.distance,
      r.photoUploaded ? '已上传' : '未上传',
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
    a.download = `司机到店打卡记录_${periodLabel}_${todayStr()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const historyFiltered = records.filter((r) => {
    const kw = historyKeyword.trim()
    const matchKw = !kw || [r.id, r.store, r.supplier].some((v) => String(v).includes(kw))
    const matchSupplier = historySupplier === 'all' || r.supplier === historySupplier
    return matchKw && matchSupplier
  })

  const statToday = records.filter((r) => r.date === todayStr()).length
  const statGeoPass = records.filter((r) => r.geoPassed).length
  const statSuppliers = new Set(records.map((r) => r.supplier)).size

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 16 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {[
            { icon: <QrCode size={28} />, label: '打卡模式', value: '门店二维码' },
            { icon: <Clock3 size={28} />, label: '今日打卡', value: String(statToday) },
            { icon: <MapPin size={28} />, label: '定位通过', value: String(statGeoPass) },
            { icon: <Truck size={28} />, label: '供应商数量', value: String(statSuppliers) },
          ].map((item) => (
            <div key={item.label} style={{ ...box, display: 'flex', gap: 12, alignItems: 'center' }}>
              {item.icon}
              <div>
                <div style={{ color: '#64748b', fontSize: 14 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={box}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>司机到店扫码打卡业务原型</div>
          <div style={{ color: '#475569', marginBottom: 16 }}>
            这是完整门店与完整供应商版本，基于纯 React 可运行版整理。
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, background: '#f1f5f9', padding: 6, borderRadius: 14, marginBottom: 20 }}>
            {[
              { key: 'driver', label: '司机打卡页' },
              { key: 'history', label: '司机历史查询' },
              { key: 'success', label: '打卡成功页' },
              { key: 'records', label: '后台记录表' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                style={{
                  ...buttonStyle(tab === t.key),
                  width: '100%',
                  border: 'none',
                  background: tab === t.key ? '#0f172a' : 'transparent',
                  color: tab === t.key ? '#fff' : '#0f172a',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'driver' && (
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)' }}>
              <div style={{ ...box, padding: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Store size={20} /> 门店二维码打卡入口
                </div>

                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <div style={{ marginBottom: 6, fontWeight: 600 }}>当前门店</div>
                    <select style={inputStyle} value={selectedStoreId} onChange={(e) => setSelectedStoreId(e.target.value)}>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ ...box, background: '#f8fafc' }}>
                    <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>二维码绑定信息</div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>门店：{selectedStore.name}</div>
                    <div style={{ color: '#475569', fontSize: 14, marginBottom: 4 }}>收货地址：{selectedStore.location}</div>
                    <div style={{ color: '#475569', fontSize: 14, marginBottom: 4 }}>打卡半径：100 米</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>
                      经纬度：{selectedStore.lat ?? '-'} / {selectedStore.lng ?? '-'}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <div style={{ marginBottom: 6, fontWeight: 600 }}>所属供应商</div>
                      <select style={inputStyle} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
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

                  <div style={{ ...box }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>定位校验</div>
                        <div style={{ color: '#64748b', fontSize: 14 }}>测试定位或真实定位都可以，100米内才能打卡。</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: geoPassed ? '#166534' : '#334155' }}>
                        {geoPassed ? '已通过' : '待校验'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                      <button style={buttonStyle(useMockLocation)} onClick={() => setUseMockLocation(true)}>使用测试定位</button>
                      <button style={buttonStyle(!useMockLocation)} onClick={() => setUseMockLocation(false)}>使用真实定位</button>
                    </div>

                    {useMockLocation && (
                      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginBottom: 10 }}>
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
                      <div style={{ fontSize: 14, padding: 10, borderRadius: 10, background: geoPassed ? '#f0fdf4' : '#fffbeb', color: geoPassed ? '#166534' : '#92400e' }}>
                        {locationMessage}
                      </div>
                    )}
                  </div>

                  <div style={{ ...box }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                        <Camera size={16} /> 现场拍照打卡
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{photoUploaded ? '已上传' : '待上传'}</div>
                    </div>
                    <button style={buttonStyle(false)} onClick={() => setPhotoUploaded(true)}>上传现场照片</button>
                  </div>

                  <div style={{ ...box }}>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>异常原因填写</div>
                    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
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
                      height: 46,
                      opacity: canSubmit ? 1 : 0.5,
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                    }}
                  >
                    确认打卡并记录到店时间
                  </button>
                </div>
              </div>

              <div style={{ ...box, padding: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>当前版本规则说明</div>
                <div style={{ color: '#64748b', marginBottom: 12 }}>完整门店与供应商版本，继续沿用不报错结构。</div>
                <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8, color: '#334155' }}>
                  <li>所有门店都按收货地址处理</li>
                  <li>所有门店定位范围统一为 100 米</li>
                  <li>已删除门店确认流程</li>
                  <li>不记录司机姓名和车牌号</li>
                  <li>支持后台导出记录</li>
                  <li>缺经纬度门店会拦截定位校验</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div style={{ ...box }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>司机历史记录查询</div>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 220px 260px', marginBottom: 16 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: '#94a3b8' }} />
                  <input
                    style={{ ...inputStyle, paddingLeft: 34 }}
                    value={historyKeyword}
                    onChange={(e) => setHistoryKeyword(e.target.value)}
                    placeholder="搜索供应商、门店、记录编号"
                  />
                </div>
                <select style={inputStyle} value={historySupplier} onChange={(e) => setHistorySupplier(e.target.value)}>
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

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['记录编号', '门店', '供应商', '打卡时间', '状态'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyFiltered.map((r) => (
                    <tr key={r.id}>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.id}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.store}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.supplier}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.time}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'success' && (
            <div style={{ ...box, maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 999, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>打卡成功，已记录到店时间</div>
              <div style={{ color: '#64748b', marginBottom: 18 }}>成功提交后会自动新增一条后台记录。</div>
              <div style={{ ...box, background: '#f8fafc', textAlign: 'left', marginBottom: 18 }}>
                <div><span style={{ color: '#64748b' }}>门店：</span>{lastRecord?.store || selectedStore.name}</div>
                <div><span style={{ color: '#64748b' }}>所属供应商：</span>{lastRecord?.supplier || '-'}</div>
                <div><span style={{ color: '#64748b' }}>打卡时间：</span>{lastRecord?.time || formatDateTime()}</div>
                <div><span style={{ color: '#64748b' }}>现场照片：</span>{lastRecord?.photoUploaded ? '已上传' : '未上传'}</div>
                <div><span style={{ color: '#64748b' }}>异常状态：</span>{lastRecord?.exceptionReason || '无异常'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button style={buttonStyle(false)} onClick={() => setTab('driver')}>继续打卡</button>
                <button style={buttonStyle(true)} onClick={() => setTab('records')}>查看后台记录</button>
              </div>
            </div>
          )}

          {tab === 'records' && (
            <div style={{ ...box }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>送货司机到店打卡记录表</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['记录编号', '打卡日期', '打卡时间', '门店名称', '所属供应商', '送货品类', '定位通过', '距离(米)', '照片', '异常原因', '异常备注', '状态'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.id}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.date}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.time}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.store}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.supplier}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.category}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.geoPassed ? '是' : '否'}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.distance}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.photoUploaded ? '已上传' : '未上传'}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.exceptionReason || '-'}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.exceptionRemark || '-'}</td>
                      <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
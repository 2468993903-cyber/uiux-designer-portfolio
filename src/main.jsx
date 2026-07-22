import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Aurora from './components/Aurora'
import Dock from './components/Dock'
import BlurText from './components/BlurText'
import TextType from './components/TextType'
import FluidGlassCursor from './components/FluidGlassCursor'
import PillNav from './components/PillNav'
import TiltedCard from './components/TiltedCard'
import GlareHover from './components/GlareHover'
import CircularGallery from './components/CircularGallery'
// import ShinyText from './components/ShinyText'
import './styles.css'

const heroProjects = [
  { id: 1, title: '可视化数据大屏', type: 'DATA VISUALIZATION', tone: 'blue', image: '/assets/card-visualization-v2.png' },
  { id: 2, title: '后台管理系统', type: 'DEVICE CONSOLE', tone: 'paper', image: '/assets/card-device-console-v2.png' },
  { id: 3, title: '移动端', type: 'MOBILE PRODUCT', tone: 'orange', image: '/assets/card-mobile-v2.png' },
  { id: 4, title: '运营设计', type: 'OPERATION DESIGN', tone: 'violet', image: '/assets/card-operation-v2.png' },
  { id: 5, title: '其他', type: 'MORE WORKS', tone: 'cyan', image: '/assets/card-other-v2.png' },
]

const experiences = [
  { year: '2024.10 — 至今', company: '积成电子股份有限公司', companyEn: 'IESLAB', role: '界面设计工程师', roleFocus: '大屏可视化设计', description: '参与各类电力可视化系统的界面与体验设计。公司长期深耕电力自动化、公用事业自动化及能源信息化领域，为能源电力业务提供数字化产品与解决方案。', tags: ['电力可视化', '数据大屏', '能源数字化'], website: 'https://www.ieslab.com.cn/index.php?c=category&id=8' },
  { year: '2023.11 — 2024.10', company: '数字鲸鱼（山东）能源科技有限公司', companyEn: 'DIGITAL WHALE ENERGY', role: 'UI 设计师', roleFocus: 'B 端设计', description: '负责电力公司管理后台 PMS 3.0 的 B 端产品界面与体验设计。公司主要面向能源电力行业开展软件开发与信息技术服务。', tags: ['PMS 3.0', 'B 端设计', '电力管理后台'], website: null },
  { year: '2022.07 — 2023.11', company: '上海飞未信息技术有限公司', companyEn: 'FEIWEI', role: 'UI 设计师 / 产品助理', roleFocus: '数字农业产品', description: '参与农业农村宅基地制度改革相关数字化产品，承担 UI 设计并协助产品梳理。公司深耕数字农业农村领域，业务覆盖咨询设计、产品研发、应用推广及运维服务。', tags: ['数字农业', '宅基地改革', 'UI / 产品'], website: 'https://51jianku.com/html/cms/fw/fwkh.html' },
]

const projects = [
  // Previous concept covers are retained in each project folder as cover-generated.png.
  { id: 'city', category: 'visual', no: '01', title: '山东电力交易中心可视化大屏', type: '调度', en: 'SHANDONG POWER TRADING CENTER', desc: '面向电力交易调度场景，集中呈现市场运行、交易计划与关键指标。', meta: 'DATA VISUALIZATION', image: '/assets/projects/city/cover-photo-v2.png', gallery: [{src:'/assets/projects/city/overview.jpg',label:'电力市场概况'},{src:'/assets/projects/city/intra-province.png',label:'省内市场'},{src:'/assets/projects/city/inter-province.png',label:'省间市场'}] },
  { id: 'energy', category: 'visual', no: '02', title: '潍坊调度中心驾驶舱', type: '调度', en: 'WEIFANG DISPATCH COCKPIT', desc: '整合电网运行态势、调度任务与异常告警的综合驾驶舱。', meta: 'DISPATCH CENTER', image: '/assets/projects/energy/cover-photo-v2.png', gallery: [{src:'/assets/projects/energy/device-monitor.png',label:'设备监控'},{src:'/assets/projects/energy/satellite.png',label:'卫星云图'},{src:'/assets/projects/energy/collaboration.png',label:'主配协同'},{src:'/assets/projects/energy/power-flow.png',label:'潮流图'}] },
  { id: 'factory', category: 'pc', no: '03', title: '工业数字孪生平台', en: 'INDUSTRIAL DIGITAL TWIN', desc: '连接设备、生产与业务的企业级桌面工作台。', meta: 'PC / WEB · 2024', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=90' },
  { id: 'travel', category: 'mobile', no: '04', title: '城市出行服务', en: 'URBAN MOBILITY APP', desc: '为高频通勤场景设计的一站式移动出行体验。', meta: 'MOBILE APP · 2023', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1800&q=90' },
  { id: 'ai', category: 'ai', no: '05', title: 'AI 数据洞察助手', en: 'AI INSIGHT COPILOT', desc: '将自然语言与数据查询、归因分析连接起来。', meta: 'AI PRODUCT · 2025', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=90' },
  { id: 'console', category: 'operation', no: '06', title: '企业运营工作台', en: 'BUSINESS CONSOLE', desc: '复杂业务流程下的信息架构与效率体验重构。', meta: 'OPERATION DESIGN · 2023', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=90' },
  { id: 'health', category: 'mobile', no: '07', title: '轻量健康记录', en: 'DAILY HEALTH', desc: '关注日常节奏与情绪反馈的轻量移动产品。', meta: 'MOBILE APP · 2022', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1800&q=90' },
  { id: 'grid-command', category: 'visual', no: '03', title: '甘肃一体化值班平台', type: '调度', en: 'GANSU INTEGRATED DUTY PLATFORM', desc: '围绕值班监控、事件处置和协同调度构建一体化可视体验。', meta: 'INTEGRATED DUTY', image: '/assets/projects/grid-command/cover-photo-v2.png', gallery: [{src:'/assets/projects/grid-command/platform.png',label:'一体化值班平台'}] },
  { id: 'carbon-map', category: 'visual', no: '04', title: 'OCS2.0 新一代电网运行监视系统', type: '配网', en: 'OCS 2.0 GRID MONITORING', desc: '服务配网运行监视、风险识别与异常处置的新一代监控系统。', meta: 'DISTRIBUTION GRID', image: '/assets/projects/carbon-map/cover-photo-v2.png', gallery: [{src:'/assets/projects/carbon-map/home.png',label:'系统首页'},{src:'/assets/projects/carbon-map/self-healing.png',label:'自愈服务概览'},{src:'/assets/projects/carbon-map/protection.png',label:'保护定值服务概览'}] },
  { id: 'factory-screen', category: 'visual', no: '05', title: '国网南昌供电公司变电站集中监控系统', type: '集控', en: 'NANCHANG SUBSTATION CONTROL', desc: '集中呈现变电站运行状态、设备告警与监控处置流程。', meta: 'CENTRALIZED CONTROL', image: '/assets/projects/factory-screen/cover-photo-v2.png', gallery: [{src:'/assets/projects/factory-screen/control.png',label:'变电站集中监控'}] },
  { id: 'emergency-screen', category: 'visual', no: '06', title: '电磁暂态仿真系统', type: '仿真产品', en: 'ELECTROMAGNETIC TRANSIENT SIMULATION', desc: '面向电力系统电磁暂态计算、结果分析与仿真任务管理。', meta: 'SIMULATION', image: '/assets/projects/emergency-screen/cover-photo-v2.png', gallery: [{src:'/assets/projects/emergency-screen/simulation.png',label:'电磁暂态仿真'}] },
  { id: 'pms-console', category: 'pc', title: 'PMS 3.0 管理后台', en: 'POWER MANAGEMENT SYSTEM', desc: '面向电力设备台账、巡检与工单管理的企业级后台。', meta: 'PC / WEB · 2024', image: '/assets/card-device-console-v2.png' },
  { id: 'asset-console', category: 'pc', title: '设备资产管理系统', en: 'ASSET MANAGEMENT', desc: '连接资产全生命周期、状态监测与维保计划。', meta: 'PC / WEB · 2024', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=90' },
  { id: 'agri-console', category: 'pc', title: '数字农业工作台', en: 'DIGITAL AGRICULTURE', desc: '服务宅基地改革与农业农村业务的综合管理平台。', meta: 'PC / WEB · 2023', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1800&q=90' },
  { id: 'inspection-console', category: 'pc', title: '智能巡检任务中心', en: 'INSPECTION CENTER', desc: '围绕计划、任务、问题和闭环构建高效桌面体验。', meta: 'PC / WEB · 2023', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=90' },
  { id: 'report-console', category: 'pc', title: '经营分析驾驶舱', en: 'BUSINESS ANALYTICS', desc: '将经营指标、异常洞察与报告协同集中呈现。', meta: 'PC / WEB · 2023', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=90' },
  { id: 'energy-mobile', category: 'mobile', title: '掌上能源服务', en: 'ENERGY MOBILE', desc: '面向能源用户的用能查询、告警与服务触达体验。', meta: 'MOBILE APP · 2024', image: '/assets/card-mobile-v2.png' },
  { id: 'field-mobile', category: 'mobile', title: '现场巡检助手', en: 'FIELD INSPECTION', desc: '帮助一线人员完成任务接收、记录与异常上报。', meta: 'MOBILE APP · 2024', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=90' },
  { id: 'community-mobile', category: 'mobile', title: '社区生活服务', en: 'COMMUNITY SERVICE', desc: '连接社区通知、活动与便民服务的轻量产品。', meta: 'MOBILE APP · 2023', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=90' },
  { id: 'farm-mobile', category: 'mobile', title: '数字乡村移动端', en: 'DIGITAL VILLAGE', desc: '为村务管理和农户服务提供随身业务入口。', meta: 'MOBILE APP · 2023', image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1800&q=90' },
  { id: 'campaign', category: 'operation', title: '品牌活动视觉系统', en: 'CAMPAIGN VISUAL SYSTEM', desc: '从主视觉到多渠道物料的一体化运营设计。', meta: 'OPERATION DESIGN · 2025', image: '/assets/card-operation-v2.png' },
  { id: 'festival', category: 'operation', title: '节日营销专题', en: 'FESTIVAL CAMPAIGN', desc: '兼顾品牌氛围与转化路径的节日专题设计。', meta: 'OPERATION DESIGN · 2024', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1800&q=90' },
  { id: 'social-content', category: 'operation', title: '社交内容设计', en: 'SOCIAL CONTENT', desc: '建立可持续复用的社交媒体内容视觉语言。', meta: 'OPERATION DESIGN · 2024', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1800&q=90' },
  { id: 'launch', category: 'operation', title: '产品发布传播', en: 'PRODUCT LAUNCH', desc: '围绕产品价值构建发布节奏与核心传播画面。', meta: 'OPERATION DESIGN · 2023', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=90' },
  { id: 'brand-kit', category: 'operation', title: '品牌运营素材库', en: 'BRAND ASSET KIT', desc: '沉淀品牌组件与高频运营物料的统一规范。', meta: 'OPERATION DESIGN · 2023', image: '/assets/card-other-v2.png' },
  { id: 'pms-30', category: 'pc', title: 'PMS 3.0', en: 'POWER MANAGEMENT SYSTEM', desc: '', meta: 'B-END / WEB', image: '/assets/card-device-console-v2.png', gallery: [] },
  { id: 'soil-survey', category: 'pc', title: '第三次全国土壤普查管理平台', en: 'NATIONAL SOIL SURVEY', desc: '', meta: 'B-END / WEB', image: '/assets/projects/rural/rural-03.png', gallery: [] },
  { id: 'homestead-standard', category: 'pc', title: '宅基地基准版 2.0', en: 'HOMESTEAD STANDARD 2.0', desc: '', meta: 'B-END / WEB', image: '/assets/projects/rural/rural-01.png', gallery: [] },
  { id: 'lanling-web', category: 'pc', title: '兰陵县农村宅基地管理信息系统', en: 'LANLING HOMESTEAD SYSTEM', desc: '', meta: 'B-END / WEB', image: '/assets/projects/rural/rural-04.png', gallery: [] },
  { id: 'lover-bay', category: 'mobile', title: '恋人湾', en: 'LOVER BAY', desc: '', meta: 'MOBILE APP', image: '/assets/card-mobile-v2.png', gallery: [] },
  { id: 'homestead-assistant', category: 'mobile', title: '宅基地监管助手', en: 'HOMESTEAD ASSISTANT', desc: '', meta: 'MOBILE APP', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=88', gallery: [] },
  { id: 'kerry-red-station', category: 'mobile', title: '嘉里红驿', en: 'KERRY RED STATION', desc: '', meta: 'MOBILE APP', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=88', gallery: [] },
  { id: 'warm-reminder', category: 'mobile', title: '暖行叮嘱系统小程序', en: 'WARM REMINDER', desc: '', meta: 'MINI PROGRAM', image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1400&q=88', gallery: [] },
]

const filters = [
  { id: 'visual', label: '可视化', en: 'VISUALIZATION' },
  { id: 'pc', label: 'PC 端', en: 'DESKTOP' },
  { id: 'mobile', label: '移动端', en: 'MOBILE' },
  { id: 'operation', label: '运营设计', en: 'OPERATION' },
]

const visualGroups = [
  { id: 'power', label: '电力可视化系统', en: 'POWER SYSTEM' },
  { id: 'rural', label: '农业农村可视化系统', en: 'AGRICULTURE & RURAL' },
]

const ruralGalleryCovers = [
  { text: '全国农村宅基地一张图', en: 'NATIONAL HOMESTEAD MAP', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=88' },
  { text: '云南高原特色现代农业产业大脑', en: 'YUNNAN AGRICULTURE BRAIN', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=88' },
  { text: '易管田数据大屏', en: 'FARMLAND DATA SCREEN', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=88' },
  { text: '兰陵县宅基地管理系统', en: 'LANLING HOMESTEAD', image: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=88' },
  { text: '山西省谷子产业集群驾驶舱', en: 'MILLET INDUSTRY COCKPIT', image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=88' },
  { text: '蒙山数据大屏', en: 'MENGSHAN DATA SCREEN', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=88' },
  { text: '数字乡村一张图', en: 'DIGITAL VILLAGE MAP', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=88' },
  { text: '乱占耕地建房整治调度平台', en: 'FARMLAND GOVERNANCE', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=88' },
  { text: '数字农田驾驶舱', en: 'DIGITAL FARMLAND', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88' },
]

const ruralProjectScreens = [
  ['/assets/projects/rural/01/screen-1.png', '/assets/projects/rural/01/screen-2.png'],
  ['/assets/projects/rural/02/screen-1.png', '/assets/projects/rural/02/screen-2.png'],
  ['/assets/projects/rural/03/screen-1.png', '/assets/projects/rural/03/screen-2.png', '/assets/projects/rural/03/screen-3.png'],
  ['/assets/projects/rural/04/screen-1.png', '/assets/projects/rural/04/screen-2.png'],
  ['/assets/projects/rural/05/screen-1.png'],
  ['/assets/projects/rural/06/screen-1.png', '/assets/projects/rural/06/screen-2.png'],
  ['/assets/projects/rural/07/screen-1.png', '/assets/projects/rural/07/screen-2.png', '/assets/projects/rural/07/screen-3.png'],
  ['/assets/projects/rural/08/screen-1.png', '/assets/projects/rural/08/screen-2.png', '/assets/projects/rural/08/screen-3.png', '/assets/projects/rural/08/screen-4.png', '/assets/projects/rural/08/screen-5.png'],
  ['/assets/projects/rural/09/screen-1.png', '/assets/projects/rural/09/screen-2.png', '/assets/projects/rural/09/screen-3.png'],
]

const ruralGalleryItems = ruralGalleryCovers.map((item, index) => ({
  ...item,
  project: {
    id: `rural-${String(index + 1).padStart(2, '0')}`,
    no: String(index + 1).padStart(2, '0'),
    title: item.text,
    en: item.en,
    type: '农业农村',
    desc: '围绕农业农村业务场景构建的数据可视化与数字化管理体验。',
    meta: 'AGRICULTURE & RURAL',
    image: item.image,
    gallery: ruralProjectScreens[index].map((src, screenIndex) => ({ src, label: `项目界面 ${String(screenIndex + 1).padStart(2, '0')}` })),
  },
}))

const powerProjectIds = new Set(['city', 'energy', 'grid-command', 'carbon-map', 'factory-screen', 'emergency-screen'])
const categoryProjectIds = {
  pc: new Set(['pms-30', 'soil-survey', 'homestead-standard', 'lanling-web']),
  mobile: new Set(['lover-bay', 'homestead-assistant', 'kerry-red-station', 'warm-reminder']),
  operation: new Set(),
}

function Loader({ onReveal, onDone }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let value = 0
    let finishTimer
    const timer = window.setInterval(() => {
      value = value < 70 ? Math.min(70, value + 8) : Math.min(100, value + 1)
      setProgress(value)
      if (value === 100) {
        window.clearInterval(timer)
        onReveal()
        finishTimer = window.setTimeout(onDone, 900)
      }
    }, 65)
    return () => { window.clearInterval(timer); window.clearTimeout(finishTimer) }
  }, [onReveal, onDone])
  return <div className={`loader-screen ${progress === 100 ? 'loader-screen--done' : ''}`}>
    <div className="loader-screen__aurora" aria-hidden="true"><Aurora colorStops={['#8f1b05','#ff5a16','#ffd25a']} amplitude={1.18} blend={0.46} speed={0.42}/></div>
    <div className="loader-screen__top"><span><i /> PORTFOLIO / 2026</span><span>UI / UX DESIGNER</span></div>
    <div className="loader-screen__greeting">
      <div className="loader-screen__identity">
        <div className="loader-screen__avatar"><img src="/assets/loader-avatar-v2.jpg" alt="设计师头像" /></div>
        <div className="loader-screen__identity-copy"><span>WELCOME / 01</span><b>VISUAL · AI · BRAND DESIGNER</b></div>
      </div>
      <TextType as="span" className="loader-screen__hello" text="HELLO，" typingSpeed={32} loop={false} showCursor={false} />
      <TextType as="strong" className="loader-screen__designer" text="DESIGNER" initialDelay={220} typingSpeed={45} loop={false} showCursor cursorCharacter="_" cursorBlinkDuration={0.42} />
    </div>
    <div className="loader-screen__center">
      <div className="loader-screen__label"><span>LOADING EXPERIENCE</span><b>{String(progress).padStart(2, '0')}%</b></div>
      <div className="loader-screen__track"><i style={{ width: `${progress}%` }} /></div>
      <div className="loader-screen__status"><span>DESIGN · CONNECT · INSPIRE</span><span>{progress < 100 ? '正在准备作品集' : '加载完成'}</span></div>
    </div>
    <div className="loader-screen__foot"><span>JINAN · CHINA</span><span>© 2026</span></div>
  </div>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header shell">
    <a className="logo" href="#home" aria-label="火火个人作品集，返回首页">
      <span className="logo-avatar"><img src="/assets/loader-avatar-v2.jpg" alt="" /></span>
      <span className="logo-copy"><strong>HUOHUO / 火火</strong><small>UI / UX DESIGN</small></span>
    </a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="打开菜单">{open ? 'CLOSE' : 'MENU'}</button>
    <nav className={open ? 'is-open' : ''} onClick={() => setOpen(false)}>
      <a href="#home">首页</a><a href="#about">关于我</a><a href="#experience">工作经历</a><a href="#works">作品集</a>
    </nav>
    <a className="header-contact" href="#contact"><span>● AVAILABLE</span> 联系面试 <b>↗</b></a>
  </header>
}

function Hero({ onOpen, ready }) {
  const rail = useRef(null)
  const nudge = direction => rail.current?.scrollBy({ left: direction * 340, behavior: 'smooth' })
  return <section id="home" className={`hero${ready ? ' hero--ready' : ''}`}>
    <Header />
    <div className="hero__atmosphere"><i className="hero__light hero__light--warm"/><i className="hero__light hero__light--cool"/><i className="hero__meteor"/><i className="hero__grain"/><i className="hero__grid"/></div>
    <div className="hero__ghost">PORTFOLIO</div>
    <div className="hero__content shell">
      <div className="hero__copy">
        {ready && <BlurText as="span" className="eyebrow hero-blur hero-blur--eyebrow" text="UI DESIGN · DATA VISUALIZATION · AI DESIGN" animateBy="words" delay={48} stepDuration={0.55} easing={[0.25,0.1,0.25,1]} animationFrom={{filter:'blur(2px)',opacity:0,y:-18}} animationTo={[{filter:'blur(.5px)',opacity:.7,y:2},{filter:'blur(0px)',opacity:1,y:0}]} />}
        <h1>{ready && <><span className="hero__title-line"><small><BlurText as="span" className="hero-blur" text="2026" animateBy="letters" direction="bottom" delay={44} stepDuration={0.62} easing={[0.25,0.1,0.25,1]} animationFrom={{filter:'blur(2px)',opacity:0,y:28}} animationTo={[{filter:'blur(.5px)',opacity:.72,y:3},{filter:'blur(0px)',opacity:1,y:0}]} /></small><b className="hero-title-effect"><BlurText as="span" className="hero-blur" text="UI / UX" animateBy="letters" direction="bottom" delay={52} stepDuration={0.68} easing={[0.25,0.1,0.25,1]} animationFrom={{filter:'blur(2px)',opacity:0,y:30}} animationTo={[{filter:'blur(.5px)',opacity:.74,y:3},{filter:'blur(0px)',opacity:1,y:0}]} />{/* <ShinyText className="hero-shiny-overlay" text="UI / UX" speed={3.2} delay={2.5} spread={118} color="rgba(243,241,235,0)" shineColor="rgba(255,196,105,.78)" /> */}</b></span><em className="hero-title-effect"><BlurText as="span" className="hero-blur" text="设计作品集" animateBy="letters" direction="bottom" delay={60} stepDuration={0.74} easing={[0.25,0.1,0.25,1]} animationFrom={{filter:'blur(2px)',opacity:0,y:32}} animationTo={[{filter:'blur(.5px)',opacity:.76,y:3},{filter:'blur(0px)',opacity:1,y:0}]} />{/* <ShinyText className="hero-shiny-overlay" text="设计作品集" speed={3.5} delay={2.7} spread={118} color="rgba(243,241,235,0)" shineColor="rgba(255,184,86,.72)" /> */}</em></>}</h1>
        <p>用设计连接复杂与直觉，<br />让信息更清晰，让体验更有价值。</p>
        <div className="hero__actions"><a href="#works" className="primary-button">查看作品</a></div>
      </div>
      <div className="hero__mark"><span>DESIGN</span><i>×</i><span>CONNECT</span><i>×</i><span>INSPIRE</span></div>
    </div>
    <div className="hero__rail-wrap shell">
      <div className="hero__rail-head"><div><button onClick={() => nudge(-1)}>←</button><button onClick={() => nudge(1)}>→</button></div></div>
      <div className="hero__rail" ref={rail}>
        <Dock distance={330} magnification={1.045}>
          {heroProjects.map(project => <div key={project.id} className="hero-card-shell">
            <button className="hero-project-v1" onClick={() => onOpen(project)} aria-label={`查看${project.title}`}>
              <img src={project.image} alt="" />
            </button>
            <span className="hero-project-label"><i>{String(project.id).padStart(2,'0')}</i><b>{project.title}</b></span>
          </div>)}
        </Dock>
      </div>
    </div>
  </section>
}

function SectionTitle({ no, label, en, children }) {
  return <div className="section-title"><div className="section-title__label"><span>{no}</span>{en} / {label}</div>{children && <h2>{children}</h2>}</div>
}

function ProfilePhoto3D() {
  return <div className="about__photo-stage">
    <TiltedCard
      className="about__photo about__photo--tilted"
      imageSrc="/assets/loader-avatar-v2.jpg"
      altText="火火头像"
      rotateAmplitude={7}
      scaleOnHover={1.012}
      displayOverlayContent
      overlayContent={<figcaption><span>HUOHUO / 火火</span><b>JINAN · 2026</b></figcaption>}
    />
  </div>
}

function About() {
  return <section id="about" className="about about--redesign section shell">
    <div className="about__transition" aria-hidden="true"><span>SELECTED WORK / 个人档案</span><i /><b>DISCOVER MORE&nbsp;&nbsp;↓</b></div>
    <header className="about__header">
      <div className="about__index"><span>01</span><b>ABOUT ME / 个人简介</b></div>
      <h2>把复杂信息，<br /><em>变成清晰体验。</em></h2>
    </header>
    <div className="about__layout">
      <ProfilePhoto3D />
      <article className="about__copy">
        <div className="about__role"><span>PERSONAL PROFILE / 个人资料</span><b>● AVAILABLE FOR WORK</b></div>
        <p className="about__lead">王同焱 <small>HUOHUO / 火火</small></p>
        <p className="about__detail">UI / UX 设计师 · AI 体验设计师 · 可视化大屏设计师</p>
        <div className="about__facts">
          <div><span>姓名 / NAME</span><b>王同焱</b></div>
          <div><span>性别 / GENDER</span><b>男</b></div>
          <div><span>年龄 / AGE</span><b>26 岁</b></div>
          <div><span>学历 / EDUCATION</span><b>山东科技大学 · 全日制</b></div>
          <div><span>电话 / PHONE</span><b><a href="tel:13563831727">135 6383 1727</a></b></div>
          <div><span>邮箱 / EMAIL</span><b><a href="mailto:2468993903@qq.com">2468993903@qq.com</a></b></div>
        </div>
        <a className="line-link" href="#experience">查看完整工作经历 <b>↘</b></a>
      </article>
    </div>
    <div className="about__numbers">
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900}><i>01</i><strong>04<sup>+</sup></strong><span><b>年设计经验</b><small>YEARS EXPERIENCE</small></span></GlareHover>
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900}><i>02</i><strong>40<sup>+</sup></strong><span><b>项目经历</b><small>PROJECTS</small></span></GlareHover>
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900}><i>03</i><strong>20<sup>+</sup></strong><span><b>合作伙伴</b><small>COLLABORATIONS</small></span></GlareHover>
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900}><i>04</i><strong>98<sup>%</sup></strong><span><b>项目交付</b><small>DELIVERY RATE</small></span></GlareHover>
    </div>
  </section>
}

function Experience() {
  const [activeExperience, setActiveExperience] = useState(0)
  const jumpToExperience = index => { setActiveExperience(index); document.getElementById(`experience-item-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
  return <section id="experience" className="experience experience--redesign section">
    <div className="shell">
      <SectionTitle no="02" label="工作经历" en="EXPERIENCE">时间塑造经验，<br /><em>项目留下方法。</em></SectionTitle>
      <div className="experience__layout">
        <aside className="experience__nav"><span>CAREER TRACK / 2026</span><nav>{experiences.map((item,index)=><button key={item.year} className={activeExperience===index?'is-active':''} onClick={()=>jumpToExperience(index)} onMouseEnter={()=>setActiveExperience(index)}><i>0{index+1}</i><b>{item.year}</b><small>{item.role}</small></button>)}</nav></aside>
        <div className="timeline">
        {experiences.map((item, index) => <article id={`experience-item-${index}`} data-year={item.year} className={`timeline__item${activeExperience===index?' is-active':''}`} key={item.year} onMouseEnter={()=>setActiveExperience(index)}>
          <div className="timeline__year"><span>0{index + 1}</span><b>{item.year.split(' — ').map((part, partIndex) => <React.Fragment key={part}>{partIndex > 0 && <i>—</i>}<em>{part}</em></React.Fragment>)}</b></div>
          <div className="timeline__dot" />
          <div className="timeline__body">
            <span>{item.company} / {item.companyEn}</span>
            <h3><span>{item.role}</span><em>{item.roleFocus}</em></h3>
            <p>{item.description}</p>
            <div className="timeline__meta">
              <div className="timeline__tags">{item.tags.map(tag => <i key={tag}>{tag}</i>)}</div>
              {item.website
                ? <a className="timeline__website" href={item.website} target="_blank" rel="noreferrer">公司官网 <b>↗</b></a>
                : <span className="timeline__website timeline__website--muted">暂无公开官网</span>}
            </div>
          </div>
        </article>)}
        </div>
      </div>
    </div>
  </section>
}

function Works({ onOpen }) {
  const [filter, setFilter] = useState('visual')
  const [visualGroup, setVisualGroup] = useState('power')
  const [active, setActive] = useState(0)
  const visible = useMemo(() => {
    const categoryProjects = projects.filter(project => project.category === filter)
    if (filter !== 'visual') return categoryProjects.filter(project => categoryProjectIds[filter]?.has(project.id)).slice(0, 6)
    return categoryProjects.filter(project => visualGroup === 'power' ? powerProjectIds.has(project.id) : !powerProjectIds.has(project.id)).slice(0, 6)
  }, [filter, visualGroup])
  useEffect(() => setActive(0), [filter, visualGroup])
  const select = index => setActive(index)
  return <section id="works" className="works section shell">
    <div className="works__intro">
      <SectionTitle no="03" label="作品展示" en="SELECTED WORKS">不同屏幕，同一件事：<br /><em>让体验自然发生。</em></SectionTitle>
      <div className="works__toolbar">
        <span className="works__count"><i>PROJECT INDEX</i><b>{String(visible.length ? active + 1 : 0).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</b></span>
        <PillNav items={filters} activeId={filter} onSelect={setFilter} />
      </div>
    </div>
    {filter === 'visual' && <div className="works__subtabs"><PillNav items={visualGroups} activeId={visualGroup} onSelect={setVisualGroup} className="pill-filter-nav--sub" ariaLabel="可视化作品领域" /></div>}
    {visible.length ? <div className="works-fan" key={`${filter}-${visualGroup}`} role="list" aria-label={`${filters.find(item => item.id === filter)?.label || ''}作品折叠画廊`} onMouseLeave={() => setActive(0)}>
      {visible.map((project, index) => <article
        className={`works-fan__card${active === index ? ' is-active' : ''}${project.category === filter ? ' is-category' : ''}`}
        key={project.id}
        role="listitem"
        onMouseEnter={() => select(index)}
        onFocus={() => select(index)}
        tabIndex={0}
      >
        <img src={project.image} alt="" />
        <div className="works-fan__shade" />
        <header><span className="works-fan__index"><small>NO.</small><b>{String(index + 1).padStart(2, '0')}</b></span><i>{project.meta}</i></header>
        <div className={`works-fan__vertical${project.title.length > 12 ? ' is-long' : ''}`}><b>{project.title}</b><small>{project.en}</small></div>
        <div className="works-fan__content">
          {project.type && <strong className="works-fan__content-type">{project.type}</strong>}
          <span>{project.en}</span>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          <button type="button" onClick={() => onOpen(project)}>查看项目</button>
        </div>
      </article>)}
    </div> : filter === 'visual' && visualGroup === 'rural'
      ? <CircularGallery items={ruralGalleryItems} bend={1.35} scrollSpeed={0.48} scrollEase={0.065} onSelect={item => onOpen(item.project)} />
      : <div className="works__empty works__empty--upload"><span>OPERATION DESIGN</span><b>运营设计作品待上传</b><p>相关项目素材将在整理完成后更新至此模块。</p></div>}
  </section>
}

function Ending() {
  return <footer id="contact" className="ending section">
    <div className="ending__grain"/>
    <div className="shell ending__inner">
      <div className="ending__top"><span>04 / CONTACT</span><span>AVAILABLE FOR NEW OPPORTUNITIES</span></div>
      <p>如果你正在寻找一位<br />关注细节，也理解系统的设计师——</p>
      <h2>LET'S CREATE<br /><em>VALUE TOGETHER.</em></h2>
      <div className="ending__actions">
        <a href="mailto:2468993903@qq.com">2468993903@QQ.COM <b>↗</b></a>
        <a className="resume-download" href="#" aria-label="下载王同焱的个人作品集">
          <span className="resume-download__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2"/></svg></span>
          <span className="resume-download__copy"><strong>下载作品集</strong><small>PORTFOLIO / PDF</small></span>
          <b>↘</b>
        </a>
      </div>
      <div className="ending__foot"><div><span>BASED IN</span><b>SHANGHAI · CHINA</b></div><div><span>SOCIAL</span><b>BEHANCE · LINKEDIN · 小红书</b></div><div><span>COPYRIGHT</span><b>© 2026 ALL RIGHTS RESERVED</b></div><a href="#home">BACK TO TOP ↑</a></div>
    </div>
  </footer>
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handler = event => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    document.body.classList.add('modal-open')
    return () => { window.removeEventListener('keydown', handler); document.body.classList.remove('modal-open') }
  }, [onClose])
  const gallery = project.gallery || [{ src: project.image, label: project.title }]
  return <div className="modal project-view" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <article className="modal__panel project-view__panel">
      <button className="modal__close project-view__close" onClick={onClose}><span>CLOSE</span><b>×</b></button>
      <header className="project-view__header">
        <div className="project-view__ghost-no" aria-hidden="true">{project.no || '01'}</div>
        <div className="project-view__index"><span>PROJECT / {project.no || '01'}</span><i>{project.type || 'DESIGN'}</i></div>
        <div className="project-view__title"><small>{project.en}</small><h2>{project.title}</h2><p>{project.desc || '围绕真实业务场景建立清晰、可靠且高效的数字化体验。'}</p></div>
        <div className="project-view__meta"><span>ROLE</span><b>UI / UX DESIGN</b><span>DOMAIN</span><b>{project.type || 'DIGITAL'}</b><span>SCREENS</span><b>{String(gallery.length).padStart(2,'0')}</b></div>
      </header>
      <figure className="project-view__hero"><div className="project-view__screen"><div className="project-view__screenbar"><span/><span/><span/><b>PROJECT VISUAL / {project.no || '01'}</b></div><img src={project.image} alt={`${project.title}项目主视觉`}/></div><figcaption><span>01</span><b>项目主视觉</b><i>KEY VISUAL</i></figcaption></figure>
      <section className="project-view__gallery">
        <div className="project-view__gallery-head"><span>INTERFACE SYSTEM</span><b>{String(gallery.length).padStart(2,'0')} SCREENS</b></div>
        {gallery.map((item,index) => <figure key={item.src} className="project-view__shot"><div><div className="project-view__screenbar"><span/><span/><span/><b>SCREEN / {String(index + 1).padStart(2,'0')}</b></div><img src={item.src} alt={`${project.title} · ${item.label}`}/></div><figcaption><span>{String(index + 2).padStart(2,'0')}</span><b>{item.label}</b><i>{project.meta}</i></figcaption></figure>)}
      </section>
      <footer className="project-view__footer"><span>HUOHUO / 火火</span><b>END OF PROJECT</b><button type="button" onClick={onClose}>返回作品集</button></footer>
    </article>
  </div>
}

function AmbientMusic() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const startAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = .18
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [])

  const stopAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setPlaying(false)
  }, [])

  useEffect(() => {
    startAudio()
    const beginOnFirstInteraction = event => {
      if (event.target instanceof Element && event.target.closest('.ambient-music')) return
      startAudio()
      window.removeEventListener('pointerdown', beginOnFirstInteraction)
      window.removeEventListener('keydown', beginOnFirstInteraction)
    }
    window.addEventListener('pointerdown', beginOnFirstInteraction, { passive: true })
    window.addEventListener('keydown', beginOnFirstInteraction)
    return () => {
      window.removeEventListener('pointerdown', beginOnFirstInteraction)
      window.removeEventListener('keydown', beginOnFirstInteraction)
    }
  }, [startAudio])

  const toggleAudio = () => playing ? stopAudio() : startAudio()

  return <>
    <audio ref={audioRef} src="/assets/background-music.mp3" autoPlay loop preload="auto" playsInline onCanPlay={startAudio} onLoadedData={startAudio} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button className={`ambient-music${playing ? ' is-playing' : ''}`} type="button" onClick={toggleAudio} aria-label={playing ? '关闭背景音乐' : '播放背景音乐'}>
      <span className="ambient-music__disc"><i/><i/><i/><i/></span>
      <span className="ambient-music__copy"><b>{playing ? 'MUSIC ON' : 'MUSIC OFF'}</b><small>{playing ? '背景音乐播放中' : '点击开启背景音乐'}</small></span>
    </button>
  </>
}

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [siteReady, setSiteReady] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [selected, setSelected] = useState(null)
  const revealSite = useCallback(() => setSiteReady(true), [])
  const finishLoader = useCallback(() => setLoaderVisible(false), [])
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0))
    return () => window.cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    if (!siteReady) return undefined
    const selector = [
      '.section-title', '.about__transition', '.about__header', '.about__photo-stage', '.about__copy', '.about__numbers',
      '.timeline__item', '.works__toolbar', '.works-fan',
      '.ending__top', '.ending__inner>p', '.ending h2', '.ending__actions', '.ending__foot'
    ].join(',')
    const elements = [...document.querySelectorAll(selector)]
    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal')
      element.style.setProperty('--reveal-order', index % 4)
    })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-revealed', entry.isIntersecting)
      })
    }, { threshold: 0.16, rootMargin: '-7% 0px -9% 0px' })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [siteReady])
  useEffect(() => {
    if (!siteReady) return undefined
    const timer = window.setTimeout(() => setHeroReady(true), 480)
    return () => window.clearTimeout(timer)
  }, [siteReady])
  return <>
    {loaderVisible && <Loader onReveal={revealSite} onDone={finishLoader} />}
    <main className={`site${siteReady ? ' site--ready' : ''}${heroReady ? ' site--animated' : ''}`}>
      <Hero ready={heroReady} onOpen={setSelected}/><About/><Experience/><Works onOpen={setSelected}/><Ending/>
    </main>
    {selected && <ProjectModal project={selected} onClose={() => setSelected(null)}/>} 
    <AmbientMusic />
    <FluidGlassCursor />
  </>
}

createRoot(document.getElementById('root')).render(<App />)

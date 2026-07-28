import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'motion/react'
import Aurora from './components/Aurora'
import Dock from './components/Dock'
import BlurText from './components/BlurText'
import TextType from './components/TextType'
import FluidGlassCursor from './components/FluidGlassCursor'
import PillNav from './components/PillNav'
import TiltedCard from './components/TiltedCard'
import GlareHover from './components/GlareHover'
import CircularGallery from './components/CircularGallery'
import EvilEye from './components/EvilEye'
import CardSwap, { Card as SwapCard } from './components/CardSwap'
import Masonry from './components/Masonry'
// import ShinyText from './components/ShinyText'
import './styles.css'

const heroProjects = [
  { id: 1, category: 'visual', title: '可视化数据大屏', type: 'DATA VISUALIZATION', tone: 'blue', image: '/assets/card-visualization-thumb.jpg' },
  { id: 2, category: 'pc', title: '后台管理系统', type: 'DEVICE CONSOLE', tone: 'paper', image: '/assets/card-device-console-thumb.jpg' },
  { id: 3, category: 'mobile', title: '移动端', type: 'MOBILE PRODUCT', tone: 'orange', image: '/assets/card-mobile-thumb.jpg' },
  { id: 4, category: 'operation', title: '运营设计', type: 'OPERATION DESIGN', tone: 'violet', image: '/assets/card-operation-thumb.jpg' },
  { id: 5, category: null, title: '其他', type: 'MORE WORKS', tone: 'cyan', image: '/assets/card-other-thumb.jpg' },
]

const experiences = [
  { year: '2024.10 — 至今', company: '积成电子股份有限公司', companyEn: 'IESLAB', role: '界面设计工程师', roleFocus: '大屏可视化设计', description: '参与各类电力可视化系统的界面与体验设计。公司长期深耕电力自动化、公用事业自动化及能源信息化领域，为能源电力业务提供数字化产品与解决方案。', tags: ['电力可视化', '数据大屏', '能源数字化'], details: ['负责电力可视化大屏的界面与体验设计', '梳理调度、配网、集控及仿真业务的信息层级', '建立组件规范并协同研发完成设计验收'], detailSections: [
    { title: '电力数字化可视化大屏驾驶舱设计', content: '公司业务覆盖集控、调度、配网、新能源，以及源网荷储、电磁暂态仿真等能源数字化方向。我主要负责电力调度、配网运维、电磁暂态仿真三条业务线的可视化大屏设计，并支持其他板块。围绕运维监控与仿真分析场景，完成数据驾驶舱、实时监控面板、电网拓扑图、告警看板及仿真页面；统一深色大屏、分级告警、设备状态和实时数据展示规范，兼顾远距离可读性，适配 27 寸显示器与超宽拼接屏，支撑调度、巡检和仿真分析等一线业务。' },
    { title: '政企产品对外宣传视觉物料设计', content: '负责数字化电力产品的对外宣传视觉，独立完成企业画册、产品折页、展会展板及项目汇报 PPT。结合产品定位统一视觉风格，优化数据图表、设备示意与业务流程表达，服务投标汇报、展会展示和政企客户推介，提升产品的专业商务形象。' },
  ], website: 'https://www.ieslab.com.cn/index.php?c=category&id=8' },
  { year: '2023.11 — 2024.10', company: '数字鲸鱼（山东）能源科技有限公司', companyEn: 'DIGITAL WHALE ENERGY', role: 'UI 设计师', roleFocus: 'B 端设计', description: '参与国网新一代设备资产精益管理系统（PMS3.0）设计。该系统是国家电网为提升设备管理效率和资产利用率开发的综合性管理平台，利用现代信息技术，将设备全生命周期管理与精益管理理念结合，实现设备资产的科学管控和优化配置。', tags: ['PMS 3.0', '视觉规范', '专业子系统'], details: ['与设计团队密切配合，明确分工并参与组内评审', '参与 PMS3.0 后半段视觉规范制定、自动布局规范验证及组件库搭建', '依据规范完成输电、变电、配电、直流四大专业相关子系统页面设计'], detailSections: [
    { title: '国网新一代设备资产精益管理系统（PMS3.0）｜项目简介', content: '国家电网集团级设备资产管控平台，聚焦设备全生命周期管理与精益化资产运营，覆盖输电、变电、配电、直流四大专业，实现设备统一台账、运维监控与资产优化调配。' },
    { title: '国网新一代设备资产精益管理系统（PMS3.0）｜工作职责', content: '协同团队拆分模块并组织设计评审，主导视觉规范、自动布局规则校验及通用组件库搭建，为四大专业子系统建立统一设计底座。依据规范独立完成输电、变电、配电、直流后台页面设计，覆盖设备台账、运维统计、资产监控和业务表单，保证全平台视觉、交互与布局一致。' },
    { title: '可视化大屏 + 平面宣传物料设计', content: '独立完成政企数字化驾驶舱界面，以及项目汇报 PPT、宣传画册、线下展板和宣传短片等物料，支持电网、农业、政务项目的投标汇报与线下展示。' },
  ], website: null },
  { year: '2022.07 — 2023.11', company: '上海飞未信息技术有限公司', companyEn: 'FEIWEI', role: 'UI 设计师 / 产品助理', roleFocus: '数字农业产品', description: '参与农业农村宅基地制度改革相关数字化产品，承担 UI 设计并协助产品梳理。公司深耕数字农业农村领域，业务覆盖咨询设计、产品研发、应用推广及运维服务。', tags: ['数字农业', '宅基地改革', 'UI / 产品'], details: ['参与宅基地制度改革类数字化产品设计', '承担 Web 与移动端界面设计及产品原型整理', '配合需求调研、方案梳理与项目交付验收'], detailSections: [
    { title: '农业农村数字化可视化设计', content: '负责农业农村智慧管控大屏，独立完成多套主题驾驶舱；同时承担宅基地改革平台全视觉设计，覆盖 PC 管理后台与移动作业 App，支持一线人员上报进度并监控整改全流程。' },
    { title: '品牌平面宣传物料全链路设计', content: '独立完成宣传画册、折页、线下展板、汇报 PPT 及项目宣传视频，服务政企客户汇报、展会展示与项目申报。' },
    { title: '政务数字化 0-1 项目统筹（嘉兴总工会・嘉里红驿）', content: '担任项目总负责人，统筹管理后台、移动 App、可视化大屏三端设计。对外完成客户需求调研与原型输出；对内建立统一视觉规范，协调设计团队落地三端界面，并把控视觉、交互与交付质量。' },
    { title: '项目成果', content: '项目完整交付并回款，移动 App 上架「浙里办」正式商用；获得浙江省工会数字化大比武省级二等奖，将线下活动迁移至线上，降低运营成本、提升服务效率，并建立工会官方线上服务窗口，优化政务品牌形象。' },
  ], website: 'https://51jianku.com/html/cms/fw/fwkh.html' },
]

const buildProjectGallery = (basePath, files, label = '项目界面') => files.map((file, index) => ({
  src: `${basePath}/${file}`,
  label: `${label} ${String(index + 2).padStart(2, '0')}`,
}))

const projects = [
  // Previous concept covers are retained in each project folder as cover-generated.png.
  { id: 'city', category: 'visual', no: '01', title: '山东电力交易中心可视化大屏', type: '调度', en: 'SHANDONG POWER TRADING CENTER', desc: '面向电力交易调度场景，集中呈现市场运行、交易计划与关键指标。', meta: 'DATA VISUALIZATION', image: '/assets/projects/city/cover-thumb.webp', detailImage: '/assets/projects/city/cover-photo-v2.png', gallery: [{src:'/assets/projects/city/overview.jpg',label:'电力市场概况'},{src:'/assets/projects/city/intra-province.png',label:'省内市场'},{src:'/assets/projects/city/inter-province.png',label:'省间市场'}] },
  { id: 'energy', category: 'visual', no: '02', title: '潍坊调度中心驾驶舱', type: '调度', en: 'WEIFANG DISPATCH COCKPIT', desc: '整合电网运行态势、调度任务与异常告警的综合驾驶舱。', meta: 'DISPATCH CENTER', image: '/assets/projects/energy/cover-thumb.webp', detailImage: '/assets/projects/energy/cover-photo-v2.png', gallery: [{src:'/assets/projects/energy/device-monitor.png',label:'设备监控'},{src:'/assets/projects/energy/satellite.png',label:'卫星云图'},{src:'/assets/projects/energy/collaboration.png',label:'主配协同'},{src:'/assets/projects/energy/power-flow.png',label:'潮流图'}] },
  { id: 'factory', category: 'pc', no: '03', title: '工业数字孪生平台', en: 'INDUSTRIAL DIGITAL TWIN', desc: '连接设备、生产与业务的企业级桌面工作台。', meta: 'PC / WEB · 2024', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=90' },
  { id: 'travel', category: 'mobile', no: '04', title: '城市出行服务', en: 'URBAN MOBILITY APP', desc: '为高频通勤场景设计的一站式移动出行体验。', meta: 'MOBILE APP · 2023', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1800&q=90' },
  { id: 'ai', category: 'ai', no: '05', title: 'AI 数据洞察助手', en: 'AI INSIGHT COPILOT', desc: '将自然语言与数据查询、归因分析连接起来。', meta: 'AI PRODUCT · 2025', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=90' },
  { id: 'console', category: 'operation', no: '06', title: '企业运营工作台', en: 'BUSINESS CONSOLE', desc: '复杂业务流程下的信息架构与效率体验重构。', meta: 'OPERATION DESIGN · 2023', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=90' },
  { id: 'health', category: 'mobile', no: '07', title: '轻量健康记录', en: 'DAILY HEALTH', desc: '关注日常节奏与情绪反馈的轻量移动产品。', meta: 'MOBILE APP · 2022', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1800&q=90' },
  { id: 'grid-command', category: 'visual', no: '03', title: '甘肃一体化值班平台', type: '调度', en: 'GANSU INTEGRATED DUTY PLATFORM', desc: '围绕值班监控、事件处置和协同调度构建一体化可视体验。', meta: 'INTEGRATED DUTY', image: '/assets/projects/grid-command/cover-thumb.webp', detailImage: '/assets/projects/grid-command/cover-photo-v2.png', gallery: [{src:'/assets/projects/grid-command/platform.png',label:'一体化值班平台'}] },
  { id: 'carbon-map', category: 'visual', no: '04', title: 'OCS2.0 新一代电网运行监视系统', type: '配网', en: 'OCS 2.0 GRID MONITORING', desc: '服务配网运行监视、风险识别与异常处置的新一代监控系统。', meta: 'DISTRIBUTION GRID', image: '/assets/projects/carbon-map/cover-thumb.webp', detailImage: '/assets/projects/carbon-map/cover-photo-v2.png', gallery: [{src:'/assets/projects/carbon-map/home.png',label:'系统首页'},{src:'/assets/projects/carbon-map/self-healing.png',label:'自愈服务概览'},{src:'/assets/projects/carbon-map/protection.png',label:'保护定值服务概览'}] },
  { id: 'factory-screen', category: 'visual', no: '05', title: '国网南昌供电公司变电站集中监控系统', type: '集控', en: 'NANCHANG SUBSTATION CONTROL', desc: '集中呈现变电站运行状态、设备告警与监控处置流程。', meta: 'CENTRALIZED CONTROL', image: '/assets/projects/factory-screen/cover-thumb.webp', detailImage: '/assets/projects/factory-screen/cover-photo-v2.png', gallery: [{src:'/assets/projects/factory-screen/control.png',label:'变电站集中监控'}] },
  { id: 'emergency-screen', category: 'visual', no: '06', title: '电磁暂态仿真系统', type: '仿真产品', en: 'ELECTROMAGNETIC TRANSIENT SIMULATION', desc: '面向电力系统电磁暂态计算、结果分析与仿真任务管理。', meta: 'SIMULATION', image: '/assets/projects/emergency-screen/cover-thumb.webp', detailImage: '/assets/projects/emergency-screen/cover-photo-v2.png', gallery: [{src:'/assets/projects/emergency-screen/simulation.png',label:'电磁暂态仿真'}] },
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
  { id: 'pms-30', category: 'pc', no: '01', title: 'PMS 3.0', type: 'B 端系统', en: 'POWER MANAGEMENT SYSTEM', desc: '以统一的 Web 视觉规范支撑电力设备状态评估、停电分析与业务协同。', meta: 'B-END / WEB', image: '/assets/projects/pms-30/cover-thumb.webp', detailImage: '/assets/projects/pms-30/cover-generated-v2.png', document: '/assets/projects/pms-30/pms30-web-guideline.pdf', gallery: [
    { src: '/assets/projects/pms-30/overview.png', label: '二次状态评估 · 首页总览' },
    { src: '/assets/projects/pms-30/detail.png', label: '二次状态评估 · 首页详情' },
    { src: '/assets/projects/pms-30/evaluation.png', label: '装置本体状态评价' },
    { src: '/assets/projects/pms-30/outage-mainline.png', label: '六级停电信息池' },
  ] },
  { id: 'soil-survey', category: 'pc', no: '02', title: '第三次全国土壤普查管理平台', type: '农业 B 端', en: 'NATIONAL SOIL SURVEY', desc: '围绕样点、样品、检测与成果报表建立清晰、可靠的土壤普查业务工作台。', meta: 'B-END / WEB', image: '/assets/projects/soil-survey/cover-thumb.webp', detailImage: '/assets/projects/soil-survey/login.png', gallery: [
    { src: '/assets/projects/soil-survey/batch-list.png', label: '样品分析 · 批次列表' },
    { src: '/assets/projects/soil-survey/sample-report.png', label: '样品报表展示' },
    { src: '/assets/projects/soil-survey/site-condition.png', label: '立地条件' },
    { src: '/assets/projects/soil-survey/soil-bag.png', label: '采土袋管理' },
    { src: '/assets/projects/soil-survey/point-report.png', label: '样点报表展示' },
    { src: '/assets/projects/soil-survey/sampling-photo.png', label: '采样拍摄' },
  ] },
  {
    id: 'kerry-red-station',
    category: 'mobile',
    no: '01',
    title: '嘉里红驿',
    type: '移动端',
    en: 'KERRY RED STATION',
    desc: '围绕工会服务、红色驿站与职工活动构建的数字化服务体验。',
    meta: 'MOBILE APP',
    image: '/assets/projects/mobile/kerry-red-station/cover-thumb.webp',
    detailImage: '/assets/projects/mobile/kerry-red-station/01.png',
    gallery: buildProjectGallery('/assets/projects/mobile/kerry-red-station', ['02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png'], '设计展示'),
  },
  {
    id: 'lover-bay',
    category: 'mobile',
    no: '02',
    title: '恋人湾',
    type: '移动端',
    en: 'LOVER BAY',
    desc: '面向校园恋爱与纪念场景的年轻化社交产品体验设计。',
    meta: 'MOBILE APP',
    image: '/assets/projects/mobile/lover-bay/cover-thumb.webp',
    detailImage: '/assets/projects/mobile/lover-bay/01.png',
    gallery: buildProjectGallery('/assets/projects/mobile/lover-bay', ['02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.jpg'], '设计展示'),
  },
  {
    id: 'homestead-assistant',
    category: 'mobile',
    no: '03',
    title: '宅基地监管助手',
    type: '移动端',
    en: 'HOMESTEAD ASSISTANT',
    desc: '面向巡查任务、问题整改与现场签到的基层移动监管工具。',
    meta: 'MOBILE APP',
    image: '/assets/projects/mobile/homestead-assistant/cover-thumb.webp',
    detailImage: '/assets/projects/mobile/homestead-assistant/cover-generated-v2.png',
    gallery: buildProjectGallery('/assets/projects/mobile/homestead-assistant', ['02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png'], '项目界面'),
  },
  { id: 'warm-reminder', category: 'mobile', title: '暖行叮嘱系统小程序', en: 'WARM REMINDER', desc: '', meta: 'MINI PROGRAM', image: '/assets/projects/generated/warm-reminder-cover.png', gallery: [] },
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
  { text: '全国农村宅基地一张图', en: 'NATIONAL HOMESTEAD MAP', image: '/assets/projects/rural/covers/01.jpg' },
  { text: '云南高原特色现代农业产业大脑', en: 'YUNNAN AGRICULTURE BRAIN', image: '/assets/projects/rural/covers/02.jpg' },
  { text: '兰陵县宅基地管理系统', en: 'LANLING HOMESTEAD', image: '/assets/projects/rural/covers/03.jpg' },
  { text: '山西省谷子产业集群驾驶舱', en: 'MILLET INDUSTRY COCKPIT', image: '/assets/projects/rural/covers/04.jpg' },
  { text: '数字乡村一张图', en: 'DIGITAL VILLAGE MAP', image: '/assets/projects/rural/covers/05.jpg' },
  { text: '乱占耕地建房整治调度平台', en: 'FARMLAND GOVERNANCE', image: '/assets/projects/rural/covers/06.jpg' },
  { text: '数字农田驾驶舱', en: 'DIGITAL FARMLAND', image: '/assets/projects/rural/covers/07.jpg' },
]

const ruralProjectScreens = [
  ['/assets/projects/rural/01/screen-1.png', '/assets/projects/rural/01/screen-2.png'],
  ['/assets/projects/rural/02/screen-1.png', '/assets/projects/rural/02/screen-2.png'],
  ['/assets/projects/rural/04/screen-1.png', '/assets/projects/rural/04/screen-2.png'],
  ['/assets/projects/rural/05/screen-1.png'],
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
  pc: new Set(['pms-30', 'soil-survey']),
  mobile: new Set(['kerry-red-station', 'lover-bay', 'homestead-assistant']),
  operation: new Set(),
}

const operationGroups = [
  { id: 'graphic', label: '平面类', en: 'GRAPHIC' },
  { id: 'campaign', label: '运营设计类', en: 'CAMPAIGN' },
]

const operationProjects = {
  graphic: [
    {
      id: 'graphic-brochure', category: 'operation', no: '01', title: '宅基地宣传三折页', type: '折页设计', en: 'HOMESTEAD BROCHURE',
      desc: '围绕宅基地政策传播梳理内容层级，以折页结构承载高密度信息。',
      meta: 'GRAPHIC / BROCHURE', image: '/assets/projects/operation/graphic/brochure/01.jpg',
      gallery: [{ src: '/assets/projects/operation/graphic/brochure/02.jpg', label: '三折页背面' }],
    },
    {
      id: 'graphic-dingyuan', category: 'operation', no: '02', title: '定远县宅基地试点工作手册', type: '手册设计', en: 'DINGYUAN HOMESTEAD MANUAL',
      desc: '将两项试点工作内容转译为结构清晰、便于汇报与阅读的完整手册。',
      meta: 'GRAPHIC / MANUAL', image: '/assets/projects/operation/graphic/dingyuan/01.jpg',
      gallery: Array.from({ length: 19 }, (_, index) => ({ src: `/assets/projects/operation/graphic/dingyuan/${String(index + 2).padStart(2, '0')}.jpg`, label: `手册内页 ${String(index + 2).padStart(2, '0')}` })),
    },
    {
      id: 'graphic-dispatch', category: 'operation', no: '03', title: '调度系统视觉方案', type: '方案设计', en: 'DISPATCH SYSTEM PROPOSAL',
      desc: '面向调度系统方案汇报，建立统一的视觉叙事与页面节奏。',
      meta: 'GRAPHIC / PROPOSAL', image: '/assets/projects/operation/graphic/dispatch/01.jpg',
      gallery: Array.from({ length: 3 }, (_, index) => ({ src: `/assets/projects/operation/graphic/dispatch/${String(index + 2).padStart(2, '0')}.jpg`, label: `方案页面 ${String(index + 2).padStart(2, '0')}` })),
    },
    {
      id: 'graphic-nanqiao', category: 'operation', no: '04', title: '南谯区乡村振兴产业融合示范区', type: '规划视觉', en: 'NANQIAO RURAL REVITALIZATION',
      desc: '以区域规划、产业分区与空间关系为核心的信息视觉表达。',
      meta: 'GRAPHIC / PLANNING', image: '/assets/projects/operation/graphic/nanqiao/01.png',
      gallery: Array.from({ length: 5 }, (_, index) => ({ src: `/assets/projects/operation/graphic/nanqiao/${String(index + 2).padStart(2, '0')}.png`, label: `规划设计 ${String(index + 2).padStart(2, '0')}` })),
    },
  ],
  campaign: [
    { id: 'campaign-launch', category: 'operation', no: '01', title: '产品启动页', type: '启动视觉', en: 'APP LAUNCH VISUAL', desc: '面向产品启动场景的品牌氛围与视觉记忆设计。', meta: 'CAMPAIGN / APP', image: '/assets/projects/operation/campaign/thumb-01.webp', gallery: [] },
    { id: 'campaign-mid-autumn', category: 'operation', no: '02', title: '中秋佳节', type: '节日运营', en: 'MID-AUTUMN FESTIVAL', desc: '以节日意象构建温暖、克制的品牌运营画面。', meta: 'CAMPAIGN / FESTIVAL', image: '/assets/projects/operation/campaign/thumb-02.webp', gallery: [] },
    { id: 'campaign-winter', category: 'operation', no: '03', title: '冬至', type: '节日运营', en: 'WINTER SOLSTICE', desc: '结合冬至节气氛围完成节日主题传播设计。', meta: 'CAMPAIGN / FESTIVAL', image: '/assets/projects/operation/campaign/thumb-03.webp', gallery: [] },
    { id: 'campaign-art', category: 'operation', no: '04', title: '国际艺术展', type: '展架设计', en: 'INTERNATIONAL ART EXHIBITION', desc: '服务线下展览场景的高识别度主题展架设计。', meta: 'CAMPAIGN / EXHIBITION', image: '/assets/projects/operation/campaign/thumb-04.webp', gallery: [] },
    { id: 'campaign-travel', category: 'operation', no: '05', title: '旅游去哪', type: '活动运营', en: 'TRAVEL CAMPAIGN', desc: '面向旅游活动传播的轻量化运营视觉设计。', meta: 'CAMPAIGN / TRAVEL', image: '/assets/projects/operation/campaign/thumb-05.webp', gallery: [] },
    { id: 'campaign-dragonboat', category: 'operation', no: '06', title: '端午节海报', type: '节日海报', en: 'DRAGON BOAT FESTIVAL', desc: '以传统节日文化为核心的视觉海报创作。', meta: 'CAMPAIGN / POSTER', image: '/assets/projects/operation/campaign/thumb-06.webp', gallery: [] },
  ],
}

const imagePreloadCache = new Map()
const preloadImage = src => {
  if (!src || imagePreloadCache.has(src)) return imagePreloadCache.get(src)
  const image = new Image()
  image.decoding = 'async'
  image.fetchPriority = 'low'
  image.src = src
  image.decode?.().catch(() => {})
  imagePreloadCache.set(src, image)
  return image
}

const warmProjectAssets = project => {
  if (!project) return
  ;[project.detailImage || project.image, ...(project.gallery || []).slice(0, 2).map(item => item.src)].forEach(preloadImage)
}

const portfolioCoverSources = [
  ...heroProjects.map(project => project.image),
  ...projects
    .filter(project => powerProjectIds.has(project.id) || Object.values(categoryProjectIds).some(ids => ids.has(project.id)))
    .map(project => project.image),
  ...Object.values(operationProjects).flat().map(project => project.image),
  ...ruralGalleryCovers.map(project => project.image),
]

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
    <div className="loader-screen__evil-eye" aria-hidden="true"><EvilEye eyeColor="#ff7a2f" intensity={1.08} pupilSize={0.62} irisWidth={0.27} glowIntensity={0.24} scale={0.72} noiseScale={1.08} pupilFollow={0.38} flameSpeed={0.58} backgroundColor="#000000" /></div>
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

function Hero({ onCategorySelect, ready }) {
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
            <button className="hero-project-v1" onClick={project.category ? () => onCategorySelect(project.category) : undefined} aria-label={project.category ? `查看${project.title}` : `${project.title}，内容预留`}>
              <img src={project.image} alt="" decoding="async" />
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
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900} playOnce><i>01</i><strong>04<sup>+</sup></strong><span><b>年设计经验</b><small>YEARS EXPERIENCE</small></span></GlareHover>
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900} playOnce><i>02</i><strong>40<sup>+</sup></strong><span><b>项目经历</b><small>PROJECTS</small></span></GlareHover>
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900} playOnce><i>03</i><strong>20<sup>+</sup></strong><span><b>合作伙伴</b><small>COLLABORATIONS</small></span></GlareHover>
      <GlareHover className="about-stat-glare" width="100%" height="100%" background="transparent" borderRadius="20px" borderColor="transparent" glareColor="#ffd8b2" glareOpacity={0.18} glareAngle={-28} glareSize={240} transitionDuration={900} playOnce><i>04</i><strong>98<sup>%</sup></strong><span><b>项目交付</b><small>DELIVERY RATE</small></span></GlareHover>
    </div>
  </section>
}

function Experience() {
  const [activeExperience, setActiveExperience] = useState(0)
  const [expandedExperience, setExpandedExperience] = useState(null)
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
            {item.website
              ? <a className="timeline__website timeline__website--top" href={item.website} target="_blank" rel="noreferrer"><span>公司官网</span><b>↗</b></a>
              : <span className="timeline__website timeline__website--top timeline__website--muted"><span>暂无公开官网</span></span>}
            <span className="timeline__company">{item.company} / {item.companyEn}</span>
            <h3><span>{item.role}</span><em>{item.roleFocus}</em></h3>
            <p>{item.description}</p>
            <div className="timeline__meta">
              <div className="timeline__tags">{item.tags.map(tag => <i key={tag}>{tag}</i>)}</div>
              <div className="timeline__links">
                <button className={`timeline__detail-trigger${expandedExperience === index ? ' is-open' : ''}`} type="button" aria-expanded={expandedExperience === index} onClick={() => setExpandedExperience(expandedExperience === index ? null : index)}>
                  <span>{expandedExperience === index ? '收起详情' : '工作详情'}</span>
                  <b aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg></b>
                </button>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {expandedExperience === index && <motion.div className="timeline__detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .42, ease: [.22, 1, .36, 1] }}>
                <div className="timeline__detail-inner">
                  <header><span>CORE RESPONSIBILITIES</span><b>我具体做了什么</b></header>
                  {item.detailSections
                    ? <div className="timeline__detail-copy">{item.detailSections.map((section, sectionIndex) => <section key={section.title}><h4><span>{String(sectionIndex + 1).padStart(2, '0')}</span>{section.title}</h4><p>{section.content}</p></section>)}</div>
                    : <ol>{item.details.map((detail, detailIndex) => <li key={detail}><span>{String(detailIndex + 1).padStart(2, '0')}</span><p>{detail}</p></li>)}</ol>}
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>
        </article>)}
        </div>
      </div>
    </div>
  </section>
}

function Works({ onOpen, requestedFilter }) {
  const [filter, setFilter] = useState('visual')
  const [visualGroup, setVisualGroup] = useState('power')
  const [operationGroup, setOperationGroup] = useState('graphic')
  const [active, setActive] = useState(0)
  const [mobileActive, setMobileActive] = useState(0)
  const visible = useMemo(() => {
    if (filter === 'operation') return operationProjects[operationGroup]
    const categoryProjects = projects.filter(project => project.category === filter)
    if (filter !== 'visual') return categoryProjects.filter(project => categoryProjectIds[filter]?.has(project.id)).slice(0, 6)
    return categoryProjects.filter(project => visualGroup === 'power' ? powerProjectIds.has(project.id) : !powerProjectIds.has(project.id)).slice(0, 6)
  }, [filter, visualGroup, operationGroup])
  useEffect(() => { setActive(0); setMobileActive(0) }, [filter, visualGroup, operationGroup])
  useEffect(() => {
    if (!requestedFilter) return
    setFilter(requestedFilter)
    setActive(0)
  }, [requestedFilter])
  const select = index => setActive(index)
  return <section id="works" className="works section shell">
    <div className="works__intro">
      <SectionTitle no="03" label="作品展示" en="SELECTED WORKS"><span>不同屏幕，同一件事：</span><em>让体验自然发生。</em></SectionTitle>
      <div className="works__toolbar">
        <span className="works__count"><i>PROJECT INDEX</i><b>{String(visible.length ? active + 1 : 0).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</b></span>
        <PillNav items={filters} activeId={filter} onSelect={setFilter} />
      </div>
    </div>
    {filter === 'visual' && <div className="works__subtabs"><PillNav items={visualGroups} activeId={visualGroup} onSelect={setVisualGroup} className="pill-filter-nav--sub" ariaLabel="可视化作品领域" /></div>}
    {filter === 'operation' && <div className="works__subtabs works__subtabs--operation"><PillNav items={operationGroups} activeId={operationGroup} onSelect={setOperationGroup} className="pill-filter-nav--sub" ariaLabel="运营设计作品类型" /></div>}
    <AnimatePresence mode="wait" initial={false}>
    <motion.div className="works__stage" key={`${filter}-${visualGroup}-${operationGroup}`}
      initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
      transition={{ duration: .4, ease: [0.2, 0.76, 0.22, 1] }}>
    {filter === 'operation' && visible.length ? <OperationGallery projects={visible} onOpen={onOpen} />
      : filter === 'mobile' && visible.length ? <div className="mobile-swap">
      <div className="mobile-swap__copy">
        <span>MOBILE EXPERIENCE / 03</span>
        <h3><span>三种场景，</span><em>一套清晰体验。</em></h3>
        <p>从职工服务、年轻社交到基层监管，以真实项目素材呈现移动端产品的设计经验。</p>
        <div className="mobile-swap__markers" style={{ '--mobile-active': mobileActive }}>{visible.map((project, index) => <i className={mobileActive === index ? 'is-active' : ''} key={project.id}>{String(index + 1).padStart(2, '0')}</i>)}</div>
      </div>
      <div className="mobile-swap__deck">
        <CardSwap width="min(580px, 42vw)" height="395px" cardDistance={34} verticalDistance={28} delay={5600} skewAmount={1.2} onActiveChange={setMobileActive} onCardClick={index => onOpen(visible[index])}>
          {visible.map((project, index) => <SwapCard key={project.id} data-project={project.id} tabIndex={0} aria-label={`查看${project.title}`} onMouseEnter={() => warmProjectAssets(project)} onFocus={() => warmProjectAssets(project)}>
            <img src={project.image} alt="" decoding="async" />
            <div className="mobile-swap__shade" />
            <header><b>{String(index + 1).padStart(2, '0')}</b><span>{project.meta}</span></header>
            <div className="mobile-swap__card-copy"><small>{project.en}</small><h4>{project.title}</h4><p>{project.desc}</p><span>VIEW PROJECT</span></div>
          </SwapCard>)}
        </CardSwap>
      </div>
    </div> : visible.length ? <div className="works-fan" role="list" aria-label={`${filters.find(item => item.id === filter)?.label || ''}作品折叠画廊`} onMouseLeave={() => setActive(0)}>
      {visible.map((project, index) => <article
        className={`works-fan__card${active === index ? ' is-active' : ''}${project.category === filter ? ' is-category' : ''}`}
        key={project.id}
        data-category={project.category}
        style={{ '--card-order': index }}
        role="listitem"
        onMouseEnter={() => { select(index); warmProjectAssets(project) }}
        onFocus={() => { select(index); warmProjectAssets(project) }}
        tabIndex={0}
      >
        <img src={project.image} alt="" loading="lazy" decoding="async" />
        <div className="works-fan__shade" />
        <header><span className="works-fan__index"><small>NO.</small><b>{String(index + 1).padStart(2, '0')}</b></span><i>{project.meta}</i></header>
        <div className={`works-fan__vertical${project.title.length > 12 ? ' is-long' : ''}`}><b>{project.title}</b><small>{project.en}</small></div>
        <div className="works-fan__content">
          {project.type && <strong className="works-fan__content-type">{project.type}</strong>}
          <span>{project.en}</span>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          <button type="button" onMouseEnter={() => warmProjectAssets(project)} onClick={() => { warmProjectAssets(project); onOpen(project) }}>查看项目</button>
        </div>
      </article>)}
    </div> : filter === 'visual' && visualGroup === 'rural'
      ? <CircularGallery items={ruralGalleryItems} bend={1.35} scrollSpeed={0.48} scrollEase={0.065} onPreview={item => warmProjectAssets(item.project)} onSelect={item => { warmProjectAssets(item.project); onOpen(item.project) }} />
      : <div className="works__empty works__empty--upload"><span>OPERATION DESIGN</span><b>运营设计作品待上传</b><p>相关项目素材将在整理完成后更新至此模块。</p></div>}
    </motion.div>
    </AnimatePresence>
  </section>
}

function OperationGallery({ projects, onOpen }) {
  if (projects.length > 4) {
    return <Masonry
      items={projects.map(project => ({ id: project.id, img: project.image, alt: project.title }))}
      animateFrom="top"
      duration={0.78}
      stagger={0.1}
      blurToFocus
    />
  }
  const groupVariants = { hidden: {}, visible: { transition: { delayChildren: .03, staggerChildren: .1 } } }
  const itemVariants = {
    hidden: { opacity: 0, x: -34, clipPath: 'inset(0 100% 0 0 round 20px)', filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0 round 20px)', filter: 'blur(0px)', transition: { duration: .72, ease: [0.16, 1, 0.3, 1] } }
  }
  return <div className={`operation-gallery operation-gallery--${projects.length > 4 ? 'campaign' : 'graphic'}`}>
    <motion.div className="operation-gallery__grid" variants={groupVariants} initial="hidden" animate="visible">
      {projects.map((project, index) => <motion.button variants={itemVariants} className="operation-piece" type="button" key={project.id} style={{ '--piece-order': index }} onMouseEnter={() => warmProjectAssets(project)} onFocus={() => warmProjectAssets(project)} onClick={() => { warmProjectAssets(project); onOpen(project) }}>
        <img src={project.image} alt="" loading="eager" fetchPriority={index < 2 ? 'high' : 'auto'} decoding="async" />
        <span className="operation-piece__no">{project.no}</span>
        <div className="operation-piece__veil" />
        <div className="operation-piece__copy"><small>{project.type} / {project.en}</small><strong>{project.title}</strong><i>VIEW PROJECT</i></div>
      </motion.button>)}
    </motion.div>
  </div>
}

function Ending() {
  return <footer id="contact" className="ending section">
    <div className="ending__grain"/>
    <div className="shell ending__inner">
      <div className="ending__top"><span>04 / CONTACT</span><span>AVAILABLE FOR NEW OPPORTUNITIES</span></div>
      <p>如果你正在寻找一位<br />关注细节，也理解系统的设计师——</p>
      <h2>LET'S CREATE<br /><em>VALUE TOGETHER.</em></h2>
      <div className="ending__actions">
        <a href="mailto:wangtongyan@ieslab.cn">wangtongyan@ieslab.cn</a>
        <a className="resume-download" href="#" aria-label="下载王同焱的个人作品集">
          <span className="resume-download__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2"/></svg></span>
          <span className="resume-download__copy"><strong>下载作品集</strong><small>PORTFOLIO / PDF</small></span>
        </a>
      </div>
      <div className="ending__foot"><div><span>BASED IN</span><b>JINAN · CHINA</b></div><div><span>SOCIAL</span><b>BEHANCE · LINKEDIN · 小红书</b></div><div><span>COPYRIGHT</span><b>© 2026 ALL RIGHTS RESERVED</b></div><a href="#home">BACK TO TOP ↑</a></div>
    </div>
  </footer>
}

function ProjectModal({ project, onClose }) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useLayoutEffect(() => {
    const scrollTop = window.scrollY
    const body = document.body
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight
    }
    const handler = event => event.key === 'Escape' && onCloseRef.current()

    window.addEventListener('keydown', handler)
    body.classList.add('modal-open')
    body.style.position = 'fixed'
    body.style.top = `-${scrollTop}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    if (scrollbarGap) body.style.paddingRight = `${scrollbarGap}px`

    return () => {
      window.removeEventListener('keydown', handler)
      body.classList.remove('modal-open')
      Object.assign(body.style, previous)
      window.scrollTo(0, scrollTop)
      window.requestAnimationFrame(() => window.scrollTo(0, scrollTop))
    }
  }, [])
  const gallery = project.gallery || [{ src: project.image, label: project.title }]
  return <div className="modal project-view" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <article className="modal__panel project-view__panel">
      <button className="modal__close project-view__close" onClick={onClose}><span>CLOSE</span><b>×</b></button>
      <header className="project-view__header">
        <div className="project-view__aurora" aria-hidden="true">
          <Aurora
            colorStops={['#5b1608', '#ff6426', '#ffc866']}
            amplitude={0.82}
            blend={0.52}
            speed={0.28}
          />
        </div>
        <div className="project-view__ghost-no" aria-hidden="true">{project.no || '01'}</div>
        <div className="project-view__index"><span>PROJECT / {project.no || '01'}</span><i>{project.type || 'DESIGN'}</i></div>
        <div className="project-view__title"><small>{project.en}</small><h2>{project.title}</h2><p>{project.desc || '围绕真实业务场景建立清晰、可靠且高效的数字化体验。'}</p></div>
        <div className="project-view__meta"><span>ROLE</span><b>UI / UX DESIGN</b><span>DOMAIN</span><b>{project.type || 'DIGITAL'}</b><span>SCREENS</span><b>{String(gallery.length).padStart(2,'0')}</b></div>
      </header>
      {project.document && <section className="project-view__document">
        <div className="project-view__document-head"><span>DESIGN SYSTEM / 视觉规范</span><b>FULL DOCUMENT</b></div>
        <div className="project-view__document-frame">
          <iframe src={`${project.document}#view=FitH&toolbar=0&navpanes=0`} title={`${project.title} Web 视觉规范`} loading="lazy" />
        </div>
        <p>完整展示 PMS 3.0 Web 视觉规范，可在文档区域内连续滚动阅读全部页面。</p>
      </section>}
      <section className="project-view__gallery">
        <div className="project-view__gallery-head"><span>INTERFACE SYSTEM</span><b>{String(gallery.length).padStart(2,'0')} SCREENS</b></div>
        <div className={`project-view__gallery-grid${project.id === 'homestead-assistant' ? ' is-compact' : ''}`}>
          {gallery.map((item,index) => <figure key={item.src} className="project-view__shot"><div><div className="project-view__screenbar"><span/><span/><span/><b>SCREEN / {String(index + 1).padStart(2,'0')}</b></div><img src={item.src} alt={`${project.title} · ${item.label}`} loading="lazy" decoding="async"/></div><figcaption><span>{String(index + 1).padStart(2,'0')}</span><b>{item.label}</b><i>{project.meta}</i></figcaption></figure>)}
        </div>
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
  const [requestedFilter, setRequestedFilter] = useState('visual')
  const revealSite = useCallback(() => setSiteReady(true), [])
  const finishLoader = useCallback(() => setLoaderVisible(false), [])
  useEffect(() => {
    if (!siteReady) return undefined
    const preload = () => portfolioCoverSources.forEach(preloadImage)
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1600 })
      return () => window.cancelIdleCallback(idleId)
    }
    const timer = window.setTimeout(preload, 350)
    return () => window.clearTimeout(timer)
  }, [siteReady])
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
      '.experience__nav', '.timeline__item', '.works__toolbar', '.works-fan',
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
  const navigateToWorks = useCallback(category => {
    setRequestedFilter(category)
    window.requestAnimationFrame(() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [])
  return <>
    {loaderVisible && <Loader onReveal={revealSite} onDone={finishLoader} />}
    <main className={`site${siteReady ? ' site--ready' : ''}${heroReady ? ' site--animated' : ''}`}>
      <Hero ready={heroReady} onCategorySelect={navigateToWorks}/><About/><Experience/><Works onOpen={setSelected} requestedFilter={requestedFilter}/><Ending/>
    </main>
    {selected && <ProjectModal project={selected} onClose={() => setSelected(null)}/>} 
    <AmbientMusic />
    <FluidGlassCursor />
  </>
}

createRoot(document.getElementById('root')).render(<App />)

import {
  Shield,
  Bell,
  Dog,
  Gamepad2,
  Users,
  HelpCircle,
  Mail,
  Newspaper,
} from 'lucide-vue-next'

export const quickLinks = [
  { label: '健康護照', icon: Shield, route: '/healthpassport', color: '#445944', bg: '#D4E6D0' },
  { label: '遺失協尋', icon: Bell, route: '/missingreport', color: '#9C6D6D', bg: '#F0D9D9' },
  { label: '領養資訊', icon: Dog, route: '/adopt', color: '#5B7FA0', bg: '#D0E2F3' },
  { label: '遊戲中心', icon: Gamepad2, route: '/game', color: '#A07A3C', bg: '#FAE4AE' },
  { label: '社群首頁', icon: Users, route: '/community-home', color: '#6E5F78', bg: '#D5BFE3' },
  { label: '常見問題', icon: HelpCircle, route: '/faq', color: '#6B6B6B', bg: '#EBEBEB' },
]

export const supportLinks = [
  { label: '聯絡我們', icon: Mail, route: '/qa', desc: '寄信給我們的客服團隊' },
  { label: '常見問題', icon: HelpCircle, route: '/faq', desc: '查閱 FAQ 快速自助' },
  { label: '電子報訂閱', icon: Newspaper, route: '/enewsletter', desc: '取得最新寵物資訊' },
]

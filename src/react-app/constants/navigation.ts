import { 
  Home, 
  BookOpen, 
  Shield, 
  Factory, 
  Settings, 
  DollarSign,
  Truck,
  Building2,
  AlertTriangle,
  MapPin,
  Gavel,
  Globe,
  Crown
} from 'lucide-react';

export const NAVIGATION_MODULES = [
  {
    id: 'home',
    name: 'Command Center',
    icon: Home,
    path: '/',
    description: 'Dashboard executivo e status geral'
  },
  {
    id: 'missao-china-pro',
    name: 'Missão China PRO',
    icon: Globe,
    path: '/missao-china-pro',
    description: 'Programa oficial de imersão empresarial'
  },
  {
    id: 'mentorado-hub',
    name: 'Mentorado Hub',
    icon: Crown,
    path: '/mentorado/login',
    description: 'Acesso exclusivo para mentorados'
  },
  {
    id: 'playbook',
    name: 'Playbook Técnico',
    icon: BookOpen,
    path: '/playbook',
    description: 'Base de SKUs IoT e especificações'
  },
  {
    id: 'regulations',
    name: 'Normas 2025',
    icon: Shield,
    path: '/regulations',
    description: 'Regulamentos e compliance'
  },
  {
    id: 'suppliers',
    name: 'Fornecedores',
    icon: Factory,
    path: '/suppliers',
    description: 'Gestão OEM/ODM'
  },
  {
    id: 'incoterms',
    name: 'Incoterms',
    icon: Gavel,
    path: '/incoterms',
    description: 'Termos comerciais internacionais'
  },
  {
    id: 'logistics',
    name: 'Logística',
    icon: Truck,
    path: '/logistics',
    description: 'Transporte e distribuição'
  },
  {
    id: 'finance',
    name: 'Tributação',
    icon: DollarSign,
    path: '/finance',
    description: 'Impostos e câmbio'
  },
  {
    id: 'wfoe-structure',
    name: 'WFOE',
    icon: Building2,
    path: '/wfoe-structure',
    description: 'Estrutura societária'
  },
  {
    id: 'risk-register',
    name: 'Riscos',
    icon: AlertTriangle,
    path: '/risk-register',
    description: 'Registro de riscos'
  },
  {
    id: 'canton-fair',
    name: 'Canton Fair',
    icon: MapPin,
    path: '/canton-fair',
    description: 'Feira de Canton'
  },
  {
    id: 'spinner-demo',
    name: 'Demos',
    icon: Settings,
    path: '/spinner-demo',
    description: 'Componentes de demonstração'
  },
  {
    id: 'sku-crud',
    name: 'SKU CRUD',
    icon: BookOpen,
    path: '/sku-crud',
    description: 'Sistema de formulários SKU'
  }
];

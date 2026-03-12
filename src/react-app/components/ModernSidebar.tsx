import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Menu, X, Home, Globe2, Users, Calculator, Truck, 
  Building2, AlertTriangle, MapPin, BookOpen, Crown, Gavel, Shield,
  Sparkles
} from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  badge?: string;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-4 hidden md:flex md:flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex-shrink-0 fixed left-0 top-0 z-30",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white/95 backdrop-blur-xl border-b border-slate-200/80 w-full fixed top-0 left-0 z-40"
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-slate-900">China HQ</h2>
        </div>
        <div className="flex justify-end z-20">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="text-neutral-800 dark:text-neutral-200" />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              
              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className={cn(
                  "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-6 z-[100] flex flex-col justify-between overflow-y-auto",
                  className
                )}
              >
                <button
                  className="absolute right-6 top-6 z-50 text-neutral-800 dark:text-neutral-200 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X />
                </button>
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: any;
}) => {
  const { open, animate, setOpen } = useSidebar();
  const location = useLocation();
  const isActive = location.pathname === link.href || 
    (link.href === '/' && location.pathname === '/dashboard');

  const handleClick = () => {
    // Close mobile sidebar when clicking a link
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <Link
      to={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-3 rounded-xl transition-all duration-200",
        isActive 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200" 
          : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
        isActive 
          ? "bg-white/20 shadow-inner" 
          : "bg-slate-100 group-hover/sidebar:bg-white group-hover/sidebar:shadow-sm"
      )}>
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
      {link.badge && open && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto",
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
          )}
        >
          {link.badge}
        </motion.span>
      )}
    </Link>
  );
};

// Navigation sections
interface NavSection {
  title: string;
  links: Links[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: 'Principal',
    links: [
      { 
        label: 'Dashboard', 
        href: '/', 
        icon: <Home className="w-4 h-4" />
      },
      { 
        label: 'Missão China Pro', 
        href: '/missao-china-pro', 
        icon: <Globe2 className="w-4 h-4" />,
        badge: 'PRO'
      },
    ]
  },
  {
    title: 'Gestão',
    links: [
      { 
        label: 'Fornecedores', 
        href: '/suppliers', 
        icon: <Users className="w-4 h-4" />
      },
      { 
        label: 'Playbook', 
        href: '/playbook', 
        icon: <BookOpen className="w-4 h-4" />
      },
      { 
        label: 'Canton Fair', 
        href: '/canton-fair', 
        icon: <MapPin className="w-4 h-4" />
      },
    ]
  },
  {
    title: 'Compliance',
    links: [
      { 
        label: 'Regulamentos', 
        href: '/regulations', 
        icon: <Shield className="w-4 h-4" />
      },
      { 
        label: 'Riscos', 
        href: '/risk-register', 
        icon: <AlertTriangle className="w-4 h-4" />
      },
    ]
  },
  {
    title: 'Operações',
    links: [
      { 
        label: 'Impostos', 
        href: '/finance', 
        icon: <Calculator className="w-4 h-4" />
      },
      { 
        label: 'Logística', 
        href: '/logistics', 
        icon: <Truck className="w-4 h-4" />
      },
      { 
        label: 'Incoterms', 
        href: '/incoterms', 
        icon: <Gavel className="w-4 h-4" />
      },
      { 
        label: 'WFOE', 
        href: '/wfoe-structure', 
        icon: <Building2 className="w-4 h-4" />
      },
    ]
  },
  {
    title: 'Vendas',
    links: [
      { 
        label: 'Cash Out', 
        href: '/cash-out', 
        icon: <Crown className="w-4 h-4" />,
        badge: 'NEW'
      },
    ]
  }
];

export function ModernSidebarDemo() {
  const { open, setOpen } = useSidebar();

  const handleMentoradoClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <SidebarBody>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div
          animate={{
            justifyContent: open ? "flex-start" : "center",
          }}
          className="flex items-center gap-2 py-4 border-b border-slate-200/80"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <motion.span
            animate={{
              display: open ? "inline-block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="font-bold text-slate-900 whitespace-nowrap"
          >
            China HQ
          </motion.span>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <motion.div
                animate={{
                  display: open ? "flex" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="flex items-center gap-2 px-3 mb-3"
              >
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
              </motion.div>

              <div className="space-y-1">
                {section.links.map((link) => (
                  <SidebarLink key={link.href} link={link} />
                ))}
              </div>
            </div>
          ))}

          {/* Mentorado Access */}
          <motion.div
            animate={{
              opacity: open ? 1 : 0,
              display: open ? "block" : "none",
            }}
            className="pt-4"
          >
            <div className="p-4 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 border border-red-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 text-sm">Mentorado Hub</h3>
                  <p className="text-red-700 text-xs">Acesso exclusivo</p>
                </div>
              </div>
              <Link
                to="/mentorado/dashboard"
                onClick={handleMentoradoClick}
                className="block w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                Acessar Sistema
              </Link>
            </div>
          </motion.div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
          <motion.div
            animate={{
              justifyContent: open ? "space-between" : "center",
            }}
            className="flex items-center"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              <motion.p
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-xs font-medium text-slate-600"
              >
                Sistema Ativo
              </motion.p>
            </div>
            <motion.p
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-xs text-slate-400 font-mono"
            >
              v2.0
            </motion.p>
          </motion.div>
        </div>
      </div>
    </SidebarBody>
  );
}

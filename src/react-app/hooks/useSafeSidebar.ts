import { useState, useEffect, useRef, useCallback } from 'react';
import { useEventListener } from '@/react-app/utils/memoryLeakPatterns';

interface UseSafeSidebarOptions {
  breakpoint?: number; // px value for desktop breakpoint
  preventBodyScroll?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

/**
 * Hook seguro para gerenciamento de sidebar com prevenção de vazamentos de memória
 * e cleanup automático de event listeners
 */
export const useSafeSidebar = (options: UseSafeSidebarOptions = {}) => {
  const {
    breakpoint = 1024,
    preventBodyScroll = true,
    closeOnEscape = true,
    closeOnClickOutside = true
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const originalBodyOverflow = useRef<string>('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Restore body scroll on unmount
      if (originalBodyOverflow.current) {
        document.body.style.overflow = originalBodyOverflow.current;
      }
    };
  }, []);

  // Safe open function
  const open = useCallback(() => {
    if (isMountedRef.current) {
      setIsOpen(true);
    }
  }, []);

  // Safe close function
  const close = useCallback(() => {
    if (isMountedRef.current) {
      setIsOpen(false);
    }
  }, []);

  // Safe toggle function
  const toggle = useCallback(() => {
    if (isMountedRef.current) {
      setIsOpen(prev => !prev);
    }
  }, []);

  // Click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!isMountedRef.current || !isOpen || !closeOnClickOutside) return;
    
    const target = event.target as Node;
    
    if (sidebarRef.current && !sidebarRef.current.contains(target)) {
      // Check if it's not clicking on a menu button
      const menuButtons = document.querySelectorAll('[aria-label*="menu" i], [data-menu-trigger]');
      const isMenuButton = Array.from(menuButtons).some(button => button.contains(target));
      
      if (!isMenuButton) {
        setIsOpen(false);
      }
    }
  }, [isOpen, closeOnClickOutside]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;
    
    // Close sidebar on desktop breakpoint
    if (window.innerWidth >= breakpoint && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, breakpoint]);

  // Escape key handler
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (!isMountedRef.current || !closeOnEscape) return;
    
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, closeOnEscape]);

  // Set up event listeners with safe cleanup
  useEventListener<MouseEvent>('mousedown', handleClickOutside, document);
  useEventListener<Event>('resize', handleResize, window);
  useEventListener<KeyboardEvent>('keydown', handleEscape, document);

  // Body scroll management
  useEffect(() => {
    if (!isMountedRef.current || !preventBodyScroll) return;
    
    if (isOpen) {
      // Store original overflow and prevent scroll
      originalBodyOverflow.current = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
      
      return () => {
        if (isMountedRef.current) {
          document.body.style.overflow = originalBodyOverflow.current;
        }
      };
    } else {
      // Restore scroll when closed
      document.body.style.overflow = originalBodyOverflow.current;
    }
  }, [isOpen, preventBodyScroll]);

  return {
    isOpen,
    open,
    close,
    toggle,
    sidebarRef,
    // Utility functions
    setIsOpen: (value: boolean) => {
      if (isMountedRef.current) {
        setIsOpen(value);
      }
    }
  };
};

/**
 * Hook para sidebar responsivo com breakpoints automáticos
 */
export const useResponsiveSidebar = (mobileBreakpoint = 768, desktopBreakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileBreakpoint);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= mobileBreakpoint && window.innerWidth < desktopBreakpoint
  );
  const sidebar = useSafeSidebar({ breakpoint: desktopBreakpoint });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < mobileBreakpoint);
    setIsTablet(width >= mobileBreakpoint && width < desktopBreakpoint);
  }, [mobileBreakpoint, desktopBreakpoint]);

  useEventListener<Event>('resize', handleResize, window);

  return {
    ...sidebar,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    // Auto-close on desktop
    shouldShowOverlay: (isMobile || isTablet) && sidebar.isOpen
  };
};

export default useSafeSidebar;

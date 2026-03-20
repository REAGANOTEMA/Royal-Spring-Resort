/**
 * Responsive Design & Mobile Optimization Guide
 * Royal Springs Hotel - All Devices Perfect Layout
 */

export const responsiveBreakpoints = {
  // Tailwind CSS Breakpoints
  xs: '0px',      // Mobile phones (default)
  sm: '640px',    // Landscape phones, tablets
  md: '768px',    // Tablets (portrait)
  lg: '1024px',   // Tablets (landscape), small laptops
  xl: '1280px',   // Desktops
  '2xl': '1536px', // Large desktops
};

export const mobileOptimizationRules = {
  // 1. TOUCH TARGET SIZES
  touchTarget: {
    minimum: '44px',  // Apple HIG - minimum touch target
    safe: '48px',     // Google Material Design
    comfortable: '56px', // Extra comfortable for UI elements
    buttons: 'h-12 or h-14',
    icons: 'size-6 or size-8',
  },

  // 2. RESPONSIVE TEXT SCALES
  typography: {
    mobile: {
      h1: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
      h2: 'text-2xl md:text-3xl lg:text-4xl',
      h3: 'text-xl md:text-2xl lg:text-3xl',
      body: 'text-base md:text-lg',
      small: 'text-sm',
      tiny: 'text-xs',
    },
  },

  // 3. SPACING & PADDING
  spacing: {
    mobile: 'p-4',        // 16px on mobile
    tablet: 'md:p-6',     // 24px on tablet
    desktop: 'lg:p-8',    // 32px on desktop
    screenPadding: 'px-4 sm:px-6 md:px-8 lg:px-12',
  },

  // 4. GRID LAYOUTS
  grids: {
    single: 'grid-cols-1',
    twoCol: 'grid-cols-1 sm:grid-cols-2',
    threeCol: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    fourCol: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    flexStack: 'flex flex-col sm:flex-row',
  },

  // 5. NAVIGATION ON MOBILE
  navigation: {
    mobileHidden: 'hidden lg:flex',
    mobileMenu: 'lg:hidden fixed top-4 left-4 z-50',
    sheetWidth: 'w-full sm:w-80',
  },

  // 6. INPUT SIZES FOR TOUCH
  inputs: {
    height: 'h-12 md:h-14',
    padding: 'py-3 md:py-4 px-4 md:px-6',
    fontSize: 'text-base md:text-lg',
    borderRadius: 'rounded-xl md:rounded-2xl',
  },

  // 7. CARD & CONTAINER SIZES
  containers: {
    maxWidth: 'max-w-7xl',
    mobileFull: 'w-full',
    tabletContainer: 'md:w-[90%]',
    desktopContainer: 'lg:w-[85%]',
    padding: 'p-4 sm:p-6 md:p-8',
    borderRadius: 'rounded-2xl md:rounded-3xl',
  },

  // 8. SAFE AREAS (For notched devices)
  safeArea: {
    statusBar: 'pt-safe',
    bottomNav: 'pb-safe',
    sides: 'px-safe',
  },

  // 9. VIEWPORT HEIGHT CONSIDERATIONS
  viewportHeight: {
    fullHeight: 'min-h-screen',
    dynamicHeight: 'min-h-[100dvh]', // Dynamic viewport height
    flexHeight: 'flex-1',
  },

  // 10. RESPONSIVE IMAGES
  images: {
    objectFit: 'object-cover',
    containerWidth: 'w-full',
    maxHeight: 'h-auto max-h-96 md:max-h-screen',
    borderRadius: 'rounded-2xl md:rounded-3xl',
  },
};

/**
 * MOBILE-FIRST IMPLEMENTATION PATTERNS
 */

// Pattern 1: Flexible Navigation
export const navPattern = `
<nav className="hidden lg:flex"> {/* Desktop */}
  {desktopNav}
</nav>

<div className="lg:hidden fixed top-4 left-4 z-50"> {/* Mobile */}
  <Sheet>
    <SheetTrigger><Menu /></SheetTrigger>
    <SheetContent side="left">
      {mobileNav}
    </SheetContent>
  </Sheet>
</div>
`;

// Pattern 2: Responsive Grid
export const gridPattern = `
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {items}
</div>
`;

// Pattern 3: Stack vs Row
export const flexPattern = `
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
  {children}
</div>
`;

// Pattern 4: Touch-Friendly Buttons
export const buttonPattern = `
<button className="
  h-12 md:h-14 px-6 md:px-8
  text-base md:text-lg font-bold
  rounded-2xl
  active:scale-[0.98] transition-transform
  min-w-[44px] min-h-[44px]
">
  {label}
</button>
`;

// Pattern 5: Responsive Form
export const formPattern = `
<form className="space-y-4 md:space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input className="h-12 md:h-14 px-4 md:px-6 text-base md:text-lg rounded-2xl" />
  </div>
</form>
`;

/**
 * DEVICE-SPECIFIC OPTIMIZATIONS
 */

export const deviceOptimizations = {
  // iOS Specific
  ios: {
    inputFontSize: '16px', // Prevents zoom on focus
    viewportFitCover: 'viewport-fit=cover', // For notch devices
    touchHighlight: '-webkit-tap-highlight-color: transparent',
    userSelect: '-webkit-user-select: none',
  },

  // Android Specific
  android: {
    hardwareAcceleration: 'transform: translateZ(0)',
    touchAction: 'touch-action: manipulation',
    fontSmoothing: '-webkit-font-smoothing: antialiased',
  },

  // Landscape Mode
  landscape: {
    reducedHeight: 'max-h-[60vh]', // For keyboards
    adjustPadding: 'py-2 md:py-4',
    compactLayout: 'space-y-2',
  },

  // Dark Mode
  darkMode: {
    background: 'bg-slate-950',
    text: 'text-white',
    border: 'border-slate-800',
    hover: 'hover:bg-slate-900',
  },
};

/**
 * PERFORMANCE OPTIMIZATIONS FOR MOBILE
 */

export const performanceChecklist = [
  '✓ Lazy load images (loading="lazy")',
  '✓ Optimize images for mobile (webp, proper sizes)',
  '✓ Minify CSS and JavaScript',
  '✓ Code splitting for routes',
  '✓ Debounce scroll and resize listeners',
  '✓ Use CSS instead of JS for animations where possible',
  '✓ Implement virtual scrolling for long lists',
  '✓ Progressive image loading (blur placeholder)',
  '✓ Service Worker for offline support',
  '✓ Cache strategy: Network First (API), Cache First (assets)',
];

/**
 * TESTING CHECKLIST
 */

export const testingChecklist = {
  devices: [
    'iPhone SE (375px)',
    'iPhone 12/13/14 (390px)',
    'iPhone 14 Pro (393px)',
    'iPhone 14 Pro Max (430px)',
    'Samsung Galaxy S22 (360px)',
    'iPad (768px)',
    'iPad Pro (1024px)',
    'Desktop 1080p (1920px)',
    'Desktop 1440p (2560px)',
  ],
  orientations: [
    'Portrait mode',
    'Landscape mode',
    'Orientation change (dynamic)',
  ],
  interactions: [
    'Touch gestures (tap, swipe, pinch)',
    'Keyboard navigation',
    'Form input on mobile keyboards',
    'Safe area awareness (notches)',
    'App installation prompt',
    'Service Worker caching',
    'Offline functionality',
  ],
  browsers: [
    'Safari (iOS 14+)',
    'Chrome (Android)',
    'Firefox',
    'Edge',
    'Samsung Internet',
  ],
};

/**
 * QUICK AUDIT TEMPLATE
 */

export const auditTemplate = `
ROYAL SPRINGS HOTEL - RESPONSIVE DESIGN AUDIT

📱 Mobile (320px - 640px)
  □ Text is readable (min 16px)
  □ Touch targets are 44px+
  □ Navigation is mobile-friendly (hamburger menu)
  □ Images scale properly
  □ Horizontal scroll is eliminated
  □ Spacing is adequate

📱 Tablet (641px - 1024px)
  □ Layout adapts gracefully
  □ Multi-column layouts work
  □ Touch controls are comfortable
  □ Full viewport width is utilized

💻 Desktop (1025px+)
  □ Layout is optimized for wide screens
  □ Navigation is horizontal
  □ Images are high-quality
  □ Maximum readability
  □ Proper spacing and padding

🔧 Technical
  □ Service Worker is registered
  □ Manifest.json is valid
  □ Icons are properly sized
  □ Offline functionality works
  □ Page load is optimized
  □ No console errors

✅ PWA Features
  □ App can be installed
  □ Works offline
  □ Splash screen appears
  □ App icon displays correctly
  □ Status bar color matches theme
`;

export default {
  responsiveBreakpoints,
  mobileOptimizationRules,
  deviceOptimizations,
  performanceChecklist,
  testingChecklist,
};

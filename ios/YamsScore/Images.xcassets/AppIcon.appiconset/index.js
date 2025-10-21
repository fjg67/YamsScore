<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient principal bleu-vert premium -->
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#5E3AEE;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#50C878;stop-opacity:1" />
    </linearGradient>
    
    <!-- Gradient or pour accents -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
    </linearGradient>
    
    <!-- Gradient blanc pour brillance -->
    <linearGradient id="shineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </linearGradient>
    
    <!-- Ombre portée douce -->
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Glow effect -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Motif de points subtil -->
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)"/>
    </pattern>
  </defs>
  
  <!-- Background circulaire avec gradient -->
  <circle cx="100" cy="100" r="90" fill="url(#mainGradient)" opacity="0.15"/>
  
  <!-- Cercle extérieur décoratif -->
  <circle cx="100" cy="100" r="85" fill="none" stroke="url(#mainGradient)" stroke-width="2" opacity="0.3"/>
  
  <!-- Dé principal 3D ultra-premium -->
  <g transform="translate(100, 85)" filter="url(#softShadow)">
    <!-- Face du dé avec gradient et profondeur -->
    <g transform="rotate(-15)">
      <!-- Ombre du dé pour effet 3D -->
      <rect x="-42" y="-38" width="84" height="84" rx="16" fill="rgba(0,0,0,0.1)" transform="translate(3, 3)"/>
      
      <!-- Face principale -->
      <rect x="-42" y="-38" width="84" height="84" rx="16" fill="url(#mainGradient)"/>
      
      <!-- Overlay de texture -->
      <rect x="-42" y="-38" width="84" height="84" rx="16" fill="url(#dots)"/>
      
      <!-- 5 points du dé (configuration "5") avec effet glow -->
      <g filter="url(#glow)">
        <circle cx="-24" cy="-20" r="7" fill="#FFFFFF"/>
        <circle cx="24" cy="-20" r="7" fill="#FFFFFF"/>
        <circle cx="0" cy="0" r="7" fill="#FFFFFF"/>
        <circle cx="-24" cy="20" r="7" fill="#FFFFFF"/>
        <circle cx="24" cy="20" r="7" fill="#FFFFFF"/>
      </g>
      
      <!-- Reflet brillant sur le dessus -->
      <rect x="-42" y="-38" width="84" height="35" rx="16" fill="url(#shineGradient)" opacity="0.6"/>
      
      <!-- Bordure subtile -->
      <rect x="-42" y="-38" width="84" height="84" rx="16" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    </g>
  </g>
  
  <!-- Badge "Y" premium en bas -->
  <g transform="translate(100, 145)">
    <!-- Cercle du badge avec gradient or -->
    <circle cx="0" cy="0" r="28" fill="url(#goldGradient)" filter="url(#softShadow)"/>
    
    <!-- Cercle intérieur pour profondeur -->
    <circle cx="0" cy="0" r="25" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    
    <!-- Lettre Y stylisée -->
    <text x="0" y="11" 
          font-family="SF Pro Display, Arial Black, sans-serif" 
          font-size="32" 
          font-weight="900" 
          fill="#FFFFFF" 
          text-anchor="middle"
          filter="url(#glow)">Y</text>
    
    <!-- Mini-étoile décorative -->
    <circle cx="15" cy="-15" r="3" fill="#FFD700" opacity="0.8"/>
    <circle cx="15" cy="-15" r="2" fill="#FFFFFF"/>
  </g>
  
  <!-- Éléments décoratifs flottants -->
  <!-- Particules autour du dé -->
  <circle cx="45" cy="60" r="2.5" fill="url(#mainGradient)" opacity="0.6"/>
  <circle cx="155" cy="70" r="2" fill="url(#goldGradient)" opacity="0.5"/>
  <circle cx="50" cy="140" r="1.5" fill="#50C878" opacity="0.4"/>
  <circle cx="150" cy="125" r="2" fill="#4A90E2" opacity="0.5"/>
  
  <!-- Mini-étoiles décoratives -->
  <g opacity="0.6">
    <path d="M 165 50 L 167 52 L 165 54 L 163 52 Z" fill="#FFD700"/>
    <path d="M 40 100 L 42 102 L 40 104 L 38 102 Z" fill="#4A90E2"/>
    <path d="M 160 145 L 162 147 L 160 149 L 158 147 Z" fill="#50C878"/>
  </g>
  
  <!-- Effet de brillance global subtil -->
  <circle cx="100" cy="100" r="90" fill="none" stroke="url(#shineGradient)" stroke-width="3" opacity="0.2"/>
</svg>
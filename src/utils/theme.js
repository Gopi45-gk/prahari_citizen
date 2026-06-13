export const applyTheme = (themeSettings) => {
  const root = document.documentElement;
  
  if (themeSettings.appearance === 'dark' || 
      (themeSettings.appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Simplified version, more complex themes can be handled with CSS vars if needed
};

export const defaultThemeSettings = {
  appearance: "light",
  accentColor: "blue",
  cardStyle: "solidMinimal",
  backgroundStyle: "safetyLight",
  fontSize: "medium",
  reducedMotion: false
};

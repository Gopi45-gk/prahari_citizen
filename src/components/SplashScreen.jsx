import { useEffect, useState } from "react";
import { useTranslation } from '../i18n/useTranslation';

const logoUrl =
  "https://www.image2url.com/r2/default/images/1781337580193-02063940-ebdc-4685-9858-cd2bc0eb30ca.png";

export default function SplashScreen() {
  const { t } = useTranslation();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
      {/* Premium radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_48%)]"></div>

      {/* Soft animated background glows */}
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>

      <div className="relative z-10 text-center px-6">
        {/* Logo reveal */}
        <div className="relative mx-auto flex h-56 w-56 md:h-64 md:w-64 items-center justify-center">
          {/* Soft blue outer glow */}
          <div className="absolute inset-0 rounded-full bg-blue-400/35 blur-3xl animate-pulse"></div>

          {/* Animated ring */}
          <div className="absolute h-52 w-52 md:h-60 md:w-60 rounded-full border border-blue-300/30 animate-ping"></div>

          {/* White badge */}
          <div className="relative z-10 flex h-44 w-44 md:h-52 md:w-52 items-center justify-center rounded-full bg-white shadow-2xl ring-4 ring-blue-300/50">
            <img
              src={logoUrl}
              alt="PRAHARI Logo"
              className="h-36 w-36 md:h-44 md:w-44 object-contain animate-logoZoom"
            />
          </div>
        </div>

        {/* Show text only after logo animation */}
        {showText && (
          <div className="mt-8 animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              PRAHARI <span className="text-blue-400">Citizen</span>
            </h1>

            <p className="mt-4 text-base md:text-xl text-blue-100">
              {t("tagline")}
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <span className="h-3 w-3 rounded-full bg-blue-400 animate-bounce"></span>
              <span className="h-3 w-3 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]"></span>
              <span className="h-3 w-3 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]"></span>
            </div>

            <p className="mt-5 text-sm text-blue-100/70">
              {t("initializing")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

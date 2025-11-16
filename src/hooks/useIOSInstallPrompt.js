import { useEffect, useState } from "react";

export function useIOSInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const standalone = window.navigator.standalone === true;

    setIsIOS(ios);
    setIsInStandaloneMode(standalone);
  }, []);

  // Show banner only if iOS Safari and not already installed
  const shouldShowPrompt = isIOS && !isInStandaloneMode;

  return { shouldShowPrompt };
}
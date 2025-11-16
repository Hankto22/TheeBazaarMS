import React from "react";
import { useIOSInstallPrompt } from "../hooks/useIOSInstallPrompt";

const IOSInstallPrompt = () => {
  const { shouldShowPrompt } = useIOSInstallPrompt();

  if (!shouldShowPrompt) return null;

  return (
    <div className="fixed bottom-0 w-full bg-black text-white p-3 text-center text-sm z-50">
      📲 Install this app: Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
    </div>
  );
};

export default IOSInstallPrompt;
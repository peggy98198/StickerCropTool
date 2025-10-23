import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { AdMob } from "@capacitor-community/admob";
import Home from "@/pages/Home";
import StickerCropTool from "@/pages/StickerCropTool";
import { addInterstitialListeners, removeInterstitialListeners } from "@/lib/admob-interstitial";
import { ADMOB_CONFIG } from "@/lib/admob-config";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kakao" component={() => <StickerCropTool platform="kakao" />} />
      <Route path="/ogq" component={() => <StickerCropTool platform="ogq" />} />
      <Route path="*" component={Home} />
    </Switch>
  );
}

function App() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // 네이티브 플랫폼에서만 실행
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let backButtonHandle: { remove: () => void } | null = null;

    // AdMob 초기화 및 리스너 설정
    const initialize = async () => {
      try {
        // AdMob 초기화
        await AdMob.initialize({
          testingDevices: ADMOB_CONFIG.TEST_MODE ? ['YOUR_TEST_DEVICE_ID'] : [],
        });
        
        // 전면 광고 리스너 등록
        await addInterstitialListeners();
        
        console.log('AdMob 초기화 완료');
      } catch (error) {
        console.error('AdMob 초기화 실패:', error);
      }

      // Android 뒤로가기 버튼 처리
      try {
        backButtonHandle = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (location === '/') {
            // 홈 화면에서는 앱 종료
            CapacitorApp.exitApp();
          } else if (canGoBack) {
            // 이전 페이지로 이동
            window.history.back();
          } else {
            // 홈으로 이동
            setLocation('/');
          }
        });
      } catch (error) {
        console.error('뒤로가기 버튼 리스너 등록 실패:', error);
      }
    };

    initialize();

    // 정리
    return () => {
      if (backButtonHandle) {
        backButtonHandle.remove();
      }
      removeInterstitialListeners();
    };
  }, [location, setLocation]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

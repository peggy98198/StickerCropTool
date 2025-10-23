import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

interface AdMobBannerProps {
  adId: string;
  position?: 'top' | 'bottom';
  testMode?: boolean;
}

export function AdMobBanner({ adId, position = 'bottom', testMode = true }: AdMobBannerProps) {
  const isInitialized = useRef(false);

  useEffect(() => {
    // 웹 환경에서는 광고 표시 안 함
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const showBanner = async () => {
      if (isInitialized.current) return;
      
      try {
        const options: BannerAdOptions = {
          adId: adId,
          adSize: BannerAdSize.BANNER,
          position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
          isTesting: testMode,
        };

        await AdMob.showBanner(options);
        isInitialized.current = true;
      } catch (error) {
        console.error('AdMob 배너 광고 로드 실패:', error);
      }
    };

    showBanner();

    // 컴포넌트 언마운트 시 배너 제거
    return () => {
      if (Capacitor.isNativePlatform() && isInitialized.current) {
        AdMob.removeBanner().catch(err => {
          console.error('AdMob 배너 제거 실패:', err);
        });
      }
    };
  }, [adId, position, testMode]);

  // 웹 환경에서는 플레이스홀더 표시
  if (!Capacitor.isNativePlatform()) {
    return (
      <div 
        className={`h-[60px] bg-white border ${position === 'top' ? 'border-b' : 'border-t'} flex items-center justify-center text-xs text-gray-400`}
        data-testid={`admob-banner-${position}-placeholder`}
      >
        광고 영역 (네이티브 앱에서만 표시됩니다)
      </div>
    );
  }

  // 네이티브 환경에서는 빈 컨테이너만 반환 (AdMob이 네이티브 레이어에 배너를 삽입함)
  return null;
}

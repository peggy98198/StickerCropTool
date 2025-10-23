import { Capacitor } from '@capacitor/core';
import { 
  AdMob, 
  AdOptions, 
  InterstitialAdPluginEvents,
  AdLoadInfo,
  AdMobError 
} from '@capacitor-community/admob';

let interstitialReady = false;
const listeners: Array<{ remove: () => void }> = [];

/**
 * 전면 광고 준비 (미리 로드)
 */
export async function prepareInterstitialAd(adId: string, testMode: boolean = true): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('웹 환경에서는 광고를 표시하지 않습니다');
    return;
  }

  try {
    const options: AdOptions = {
      adId: adId,
      isTesting: testMode,
    };

    await AdMob.prepareInterstitial(options);
    interstitialReady = true;
    console.log('전면 광고 준비 완료');
  } catch (error) {
    console.error('전면 광고 준비 실패:', error);
    interstitialReady = false;
  }
}

/**
 * 전면 광고 표시
 */
export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('웹 환경에서는 광고를 표시하지 않습니다');
    return;
  }

  if (!interstitialReady) {
    console.warn('전면 광고가 준비되지 않았습니다');
    return;
  }

  try {
    await AdMob.showInterstitial();
    interstitialReady = false;
    console.log('전면 광고 표시 완료');
  } catch (error) {
    console.error('전면 광고 표시 실패:', error);
    interstitialReady = false;
  }
}

/**
 * 전면 광고가 준비되었는지 확인
 */
export function isInterstitialReady(): boolean {
  return interstitialReady;
}

/**
 * 전면 광고 리스너 등록
 */
export async function addInterstitialListeners() {
  if (!Capacitor.isNativePlatform()) return;

  // 광고가 로드되었을 때
  const loadedListener = await AdMob.addListener(
    InterstitialAdPluginEvents.Loaded, 
    (info: AdLoadInfo) => {
      console.log('광고 로드됨:', info);
      interstitialReady = true;
    }
  );
  listeners.push(loadedListener);

  // 광고 로드 실패
  const failedToLoadListener = await AdMob.addListener(
    InterstitialAdPluginEvents.FailedToLoad, 
    (error: AdMobError) => {
      console.error('광고 로드 실패:', error);
      interstitialReady = false;
    }
  );
  listeners.push(failedToLoadListener);

  // 광고가 표시되었을 때
  const showedListener = await AdMob.addListener(
    InterstitialAdPluginEvents.Showed, 
    () => {
      console.log('광고 표시됨');
    }
  );
  listeners.push(showedListener);

  // 광고 표시 실패
  const failedToShowListener = await AdMob.addListener(
    InterstitialAdPluginEvents.FailedToShow, 
    (error: AdMobError) => {
      console.error('광고 표시 실패:', error);
      interstitialReady = false;
    }
  );
  listeners.push(failedToShowListener);

  // 광고가 닫혔을 때
  const dismissedListener = await AdMob.addListener(
    InterstitialAdPluginEvents.Dismissed, 
    () => {
      console.log('광고 닫힘');
      interstitialReady = false;
    }
  );
  listeners.push(dismissedListener);
}

/**
 * 전면 광고 리스너 제거
 */
export function removeInterstitialListeners() {
  if (!Capacitor.isNativePlatform()) return;
  
  listeners.forEach(listener => listener.remove());
  listeners.length = 0;
}

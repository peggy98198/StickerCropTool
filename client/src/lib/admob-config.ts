import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();

export const ADMOB_CONFIG = {
  // 테스트 광고 ID (개발용)
  // 출시 전에 실제 AdMob ID로 변경해야 합니다
  TEST_MODE: true,
  
  // 배너 광고 ID
  BANNER_TOP_ID: platform === 'ios' 
    ? 'ca-app-pub-3940256099942544/2934735716'  // iOS 테스트 배너
    : 'ca-app-pub-3940256099942544/6300978111', // Android 테스트 배너
    
  BANNER_BOTTOM_ID: platform === 'ios'
    ? 'ca-app-pub-3940256099942544/2934735716'  // iOS 테스트 배너
    : 'ca-app-pub-3940256099942544/6300978111', // Android 테스트 배너
  
  // 전면 광고 ID
  INTERSTITIAL_ID: platform === 'ios'
    ? 'ca-app-pub-3940256099942544/4411468910'  // iOS 테스트 전면 광고
    : 'ca-app-pub-3940256099942544/1033173712', // Android 테스트 전면 광고
};

// 실제 광고 ID로 변경할 때 사용 (출시 시)
// export const ADMOB_CONFIG = {
//   TEST_MODE: false,
//   
//   BANNER_TOP_ID: platform === 'ios' 
//     ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'
//     : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
//     
//   BANNER_BOTTOM_ID: platform === 'ios'
//     ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'
//     : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
//   
//   INTERSTITIAL_ID: platform === 'ios'
//     ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'
//     : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
// };

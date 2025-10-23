# 앱 아이콘 및 스플래시 스크린 가이드

이 가이드는 "스티커 크롭" 앱의 아이콘과 스플래시 스크린을 준비하고 설정하는 방법을 설명합니다.

## 앱 아이콘 요구사항

### iOS

iOS는 다양한 크기의 아이콘이 필요합니다:

| 용도 | 크기 (px) | 파일명 |
|------|-----------|--------|
| App Store | 1024×1024 | AppIcon-AppStore.png |
| iPhone (3x) | 180×180 | AppIcon-60@3x.png |
| iPhone (2x) | 120×120 | AppIcon-60@2x.png |
| iPad Pro | 167×167 | AppIcon-83.5@2x.png |
| iPad | 152×152 | AppIcon-76@2x.png |
| iPad | 76×76 | AppIcon-76.png |
| Settings | 58×58 | AppIcon-29@2x.png |
| Settings | 87×87 | AppIcon-29@3x.png |
| Spotlight | 80×80 | AppIcon-40@2x.png |
| Spotlight | 120×120 | AppIcon-40@3x.png |

**디자인 가이드라인:**
- PNG 형식 (알파 채널 없음)
- 둥근 모서리는 자동 적용되므로 정사각형으로 제작
- 단순하고 명확한 디자인
- 배경이 투명하지 않아야 함

### Android

Android도 여러 해상도의 아이콘이 필요합니다:

| 밀도 | 크기 (px) | 경로 |
|------|-----------|------|
| xxxhdpi | 192×192 | mipmap-xxxhdpi/ic_launcher.png |
| xxhdpi | 144×144 | mipmap-xxhdpi/ic_launcher.png |
| xhdpi | 96×96 | mipmap-xhdpi/ic_launcher.png |
| hdpi | 72×72 | mipmap-hdpi/ic_launcher.png |
| mdpi | 48×48 | mipmap-mdpi/ic_launcher.png |

**추가로 Adaptive Icon도 필요:**
- Foreground: 108×108dp safe zone (중앙 72×72dp)
- Background: 108×108dp

**디자인 가이드라인:**
- PNG 형식
- Adaptive Icon 권장 (Android 8.0+)
- 다양한 배경에서 잘 보이도록 디자인

## 아이콘 생성 방법

### 1. 원본 아이콘 제작

**권장 크기:** 1024×1024px (가장 큰 크기)

**디자인 아이디어:**
- 스티커/이모티콘을 연상시키는 아이콘
- 절단선이나 그리드 패턴
- 카카오톡 노란색과 네이버 초록색을 조합
- 깔끔하고 전문적인 느낌

**색상 팔레트 제안:**
- Primary: #FFEB3B (카카오톡 노란색)
- Secondary: #10B981 (OGQ 초록색)
- Accent: #8B5CF6 (보라색 - 앱 그라데이션)

### 2. 자동 크기 조정 도구

#### 온라인 도구 (권장)

**AppIcon.co**
- URL: https://www.appicon.co/
- 1024×1024px 이미지 업로드
- iOS와 Android 모든 크기 자동 생성
- ZIP 다운로드 후 프로젝트에 복사

**MakeAppIcon**
- URL: https://makeappicon.com/
- 무료, 모든 플랫폼 지원
- 자동으로 모든 크기 생성

#### 수동 생성 (Photoshop/Figma)

1. 1024×1024px 원본 제작
2. 각 크기별로 리사이즈:
   ```
   - iOS: 위 표 참고
   - Android: xxxhdpi부터 mdpi까지
   ```
3. 파일명 규칙 준수

### 3. iOS 프로젝트에 아이콘 추가

1. Xcode에서 프로젝트 열기:
   ```bash
   npx cap open ios
   ```

2. 네비게이터에서 **App** > **Assets.xcassets** > **AppIcon** 선택

3. 각 크기별로 드래그 앤 드롭으로 이미지 추가

4. 모든 슬롯이 채워졌는지 확인

### 4. Android 프로젝트에 아이콘 추가

#### 기본 아이콘

각 밀도 폴더에 복사:
```bash
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
android/app/src/main/res/mipmap-hdpi/ic_launcher.png
android/app/src/main/res/mipmap-mdpi/ic_launcher.png
```

#### Adaptive Icon (선택사항)

`android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` 생성:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

Foreground와 Background 이미지를 각 밀도 폴더에 추가

## 스플래시 스크린

### iOS 스플래시 스크린

Capacitor는 `capacitor.config.ts`에서 스플래시 설정을 관리합니다 (이미 설정됨):

```typescript
SplashScreen: {
  launchShowDuration: 2000,
  backgroundColor: "#ffffff",
  showSpinner: false,
  androidSpinnerStyle: "large",
  iosSpinnerStyle: "small",
  spinnerColor: "#999999",
  splashFullScreen: true,
  splashImmersive: true
}
```

**iOS 이미지 추가 (선택사항):**

1. Xcode에서 **LaunchScreen.storyboard** 열기
2. 이미지 뷰 추가
3. **Assets.xcassets**에 splash 이미지 추가
4. 스토리보드와 연결

### Android 스플래시 스크린

**`android/app/src/main/res/drawable/splash.png` 생성:**
- 권장 크기: 1080×1920px
- PNG 형식
- 중앙에 로고 배치 (600×600px 영역)

**배경 색상 설정:**

`android/app/src/main/res/values/colors.xml`:
```xml
<resources>
    <color name="colorPrimary">#8B5CF6</color>
    <color name="colorPrimaryDark">#7C3AED</color>
    <color name="colorAccent">#10B981</color>
    <color name="splashBackground">#FFFFFF</color>
</resources>
```

## 디자인 템플릿

### 아이콘 디자인 컨셉 1: 그리드 + 가위

```
배경: 그라데이션 (보라 → 파랑)
중앙: 흰색 그리드 (4×8)
상단 오른쪽: 작은 가위 아이콘
색상: #8B5CF6 → #3B82F6
```

### 아이콘 디자인 컨셉 2: 스티커 모자이크

```
배경: 흰색
중앙: 작은 이모티콘들이 그리드로 배열
테두리: 둥근 사각형 (카카오/OGQ 색상)
색상: #FFEB3B, #10B981 강조
```

### 스플래시 스크린 디자인

```
배경: 흰색 또는 밝은 그라데이션
중앙: 앱 아이콘 (256×256px)
하단: "스티커 크롭" 텍스트
      "by zziraengi" 작은 텍스트
```

## 자동화 스크립트 (선택사항)

iOS 및 Android 아이콘을 자동으로 생성하는 스크립트:

### icon-generator.js

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputIcon = 'assets/icon-1024.png';

const iosSizes = [
  { size: 1024, name: 'AppIcon-AppStore' },
  { size: 180, name: 'AppIcon-60@3x' },
  { size: 120, name: 'AppIcon-60@2x' },
  { size: 167, name: 'AppIcon-83.5@2x' },
  { size: 152, name: 'AppIcon-76@2x' },
  { size: 76, name: 'AppIcon-76' },
];

const androidSizes = [
  { size: 192, folder: 'mipmap-xxxhdpi' },
  { size: 144, folder: 'mipmap-xxhdpi' },
  { size: 96, folder: 'mipmap-xhdpi' },
  { size: 72, folder: 'mipmap-hdpi' },
  { size: 48, folder: 'mipmap-mdpi' },
];

// iOS 아이콘 생성
iosSizes.forEach(({ size, name }) => {
  sharp(inputIcon)
    .resize(size, size)
    .toFile(`ios/App/Assets.xcassets/AppIcon.appiconset/${name}.png`);
});

// Android 아이콘 생성
androidSizes.forEach(({ size, folder }) => {
  sharp(inputIcon)
    .resize(size, size)
    .toFile(`android/app/src/main/res/${folder}/ic_launcher.png`);
});
```

**사용법:**
```bash
npm install sharp
node icon-generator.js
```

## 체크리스트

### iOS
- [ ] 1024×1024px App Store 아이콘 제작
- [ ] 모든 iOS 아이콘 크기 생성
- [ ] Xcode Assets.xcassets에 추가
- [ ] 빌드 후 시뮬레이터에서 확인

### Android
- [ ] 모든 밀도별 아이콘 생성
- [ ] mipmap 폴더에 복사
- [ ] (선택) Adaptive Icon 설정
- [ ] 빌드 후 에뮬레이터에서 확인

### 스플래시 스크린
- [ ] iOS LaunchScreen 설정 확인
- [ ] Android splash.png 생성
- [ ] capacitor.config.ts 설정 확인
- [ ] 실제 기기에서 테스트

## 참고 리소스

- [iOS Human Interface Guidelines - App Icon](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Adaptive Icons](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [AppIcon.co](https://www.appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)
- [Figma App Icon Template](https://www.figma.com/community/file/857262066576215073)

---

아이콘과 스플래시 스크린이 앱의 첫인상을 결정합니다. 전문적이고 매력적인 디자인을 만드세요! 🎨

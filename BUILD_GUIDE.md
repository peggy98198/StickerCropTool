# 스티커 크롭 앱 빌드 가이드

이 가이드는 Mac에서 iOS와 Android 앱을 빌드하는 방법을 설명합니다.

## 사전 준비

### 필수 소프트웨어
- **Node.js** 18 이상
- **Xcode** 15 이상 (iOS 빌드용)
- **Android Studio** (Android 빌드용)
- **CocoaPods** (iOS 의존성 관리)

```bash
# CocoaPods 설치 (iOS용)
sudo gem install cocoapods
```

## 1단계: 프로젝트 클론 및 설정

```bash
# 프로젝트 클론
git clone <your-repo-url>
cd <project-directory>

# 의존성 설치
npm install
```

## 2단계: 웹 앱 빌드

```bash
# Vite로 프론트엔드 빌드
npm run build
```

빌드가 완료되면 `dist/public` 폴더에 정적 파일이 생성됩니다.

## 3단계: iOS 및 Android 플랫폼 추가

```bash
# iOS 플랫폼 추가
npx cap add ios

# Android 플랫폼 추가
npx cap add android
```

이 명령어는 `ios/` 및 `android/` 폴더를 생성합니다.

## 4단계: 네이티브 프로젝트로 웹 코드 동기화

```bash
# 웹 코드를 네이티브 프로젝트로 복사
npx cap sync
```

**주의:** 웹 코드를 변경할 때마다 다시 빌드하고 sync해야 합니다.

```bash
npm run build && npx cap sync
```

## 5단계: iOS 빌드

### Xcode에서 열기

```bash
npx cap open ios
```

### Xcode 설정

1. **Signing & Capabilities** 탭에서:
   - Team 선택 (Apple Developer 계정 필요)
   - Bundle Identifier 확인: `com.zziraengi.stickercrop`

2. **General** 탭에서:
   - Display Name: `스티커 크롭`
   - Version: `1.0.0`
   - Minimum Deployments: iOS 13.0

3. **Build Settings**에서:
   - Swift Language Version: Swift 5

### 시뮬레이터에서 테스트

1. Xcode 상단에서 시뮬레이터 선택 (예: iPhone 15)
2. ▶️ 버튼 클릭하여 실행

### 실제 기기에서 테스트

1. iPhone을 USB로 연결
2. Xcode 상단에서 연결된 기기 선택
3. ▶️ 버튼 클릭
4. 기기에서 "신뢰할 수 없는 개발자" 경고가 나오면:
   - 설정 > 일반 > VPN 및 기기 관리
   - 개발자 앱 신뢰

### App Store 제출용 빌드

1. Xcode 메뉴: **Product** > **Archive**
2. Archive가 완료되면 Organizer 창이 열림
3. **Distribute App** 클릭
4. App Store Connect 업로드 선택
5. 화면 지시에 따라 진행

## 6단계: Android 빌드

### Android Studio에서 열기

```bash
npx cap open android
```

### Android Studio 설정

1. 프로젝트가 로드될 때까지 대기 (Gradle 동기화)

2. **app/build.gradle** 확인:
   - `applicationId`: `com.zziraengi.stickercrop`
   - `versionCode`: 1
   - `versionName`: "1.0.0"

3. SDK 위치 설정 (필요시):
   - File > Project Structure > SDK Location

### 에뮬레이터에서 테스트

1. AVD Manager에서 가상 기기 생성 (예: Pixel 6)
2. ▶️ 버튼 클릭하여 실행

### 실제 기기에서 테스트

1. Android 기기에서 개발자 옵션 활성화:
   - 설정 > 휴대전화 정보 > 빌드 번호를 7번 탭
   - 설정 > 개발자 옵션 > USB 디버깅 활성화

2. USB로 기기 연결

3. Android Studio에서 연결된 기기 선택하고 실행

### Play Store 제출용 APK/AAB 빌드

#### AAB (권장)

```bash
cd android
./gradlew bundleRelease
```

APK 위치: `android/app/build/outputs/bundle/release/app-release.aab`

#### APK (테스트용)

```bash
cd android
./gradlew assembleRelease
```

APK 위치: `android/app/build/outputs/apk/release/app-release.apk`

### 서명 키 생성

Play Store 제출을 위해 앱 서명 필요:

```bash
keytool -genkey -v -keystore sticker-crop-release.keystore -alias sticker-crop -keyalg RSA -keysize 2048 -validity 10000
```

`android/app/build.gradle`에 서명 설정 추가:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('sticker-crop-release.keystore')
            storePassword 'your-password'
            keyAlias 'sticker-crop'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

**주의:** 키스토어 파일과 비밀번호는 안전하게 보관하세요!

## 7단계: AdMob 광고 ID 설정

### 테스트 광고 ID (개발/테스트용)

앱이 현재 테스트 광고 ID를 사용하도록 설정되어 있습니다:
- Android 배너: `ca-app-pub-3940256099942544/6300978111`
- iOS 배너: `ca-app-pub-3940256099942544/2934735716`
- 전면 광고: 테스트 ID 사용

### 실제 광고 ID로 변경 (출시 전 필수)

1. [Google AdMob](https://admob.google.com/)에서 앱 등록
2. 광고 단위 생성:
   - 배너 광고 (상단용)
   - 배너 광고 (하단용)
   - 전면 광고

3. `client/src/lib/admob-config.ts` 파일에서 실제 ID로 변경:

```typescript
export const ADMOB_CONFIG = {
  BANNER_TOP_ID: Platform.OS === 'ios' 
    ? 'ca-app-pub-YOUR_IOS_BANNER_ID'
    : 'ca-app-pub-YOUR_ANDROID_BANNER_ID',
  // ... 나머지 ID들
};
```

4. 재빌드:

```bash
npm run build && npx cap sync
```

## 문제 해결

### iOS 빌드 오류

**"Code Signing Error"**
- Xcode > Signing & Capabilities에서 Team 선택

**"Module not found"**
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

### Android 빌드 오류

**"SDK location not found"**
- Android Studio > File > Project Structure > SDK Location 설정

**"Gradle sync failed"**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### 일반적인 문제

**웹 변경사항이 앱에 반영되지 않음**
```bash
npm run build && npx cap sync
```

**네이티브 플러그인 추가 후**
```bash
npx cap sync
cd ios/App && pod install && cd ../..
```

## 유용한 명령어 요약

```bash
# 웹 앱 빌드 + 네이티브 동기화
npm run build && npx cap sync

# iOS 열기
npx cap open ios

# Android 열기
npx cap open android

# 특정 플랫폼만 동기화
npx cap sync ios
npx cap sync android

# 플랫폼 업데이트 (Capacitor 버전 업그레이드 후)
npx cap update

# 플러그인 목록 확인
npx cap ls
```

## 다음 단계

빌드가 완료되면 [APP_STORE_SUBMISSION.md](./APP_STORE_SUBMISSION.md) 가이드를 참고하여 앱스토어에 제출하세요.

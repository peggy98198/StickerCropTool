# 앱스토어 제출 가이드

이 가이드는 iOS App Store와 Google Play Store에 "스티커 크롭" 앱을 제출하는 방법을 안내합니다.

## 사전 준비사항

### Apple App Store
- **Apple Developer Program** 계정 ($99/년)
- **Xcode** 최신 버전
- Mac 컴퓨터

### Google Play Store
- **Google Play Developer** 계정 (일회성 $25)
- **Android Studio**

---

## iOS App Store 제출

### 1단계: App Store Connect 설정

1. [App Store Connect](https://appstoreconnect.apple.com/)에 로그인

2. **My Apps** → **+ 버튼** → **New App** 클릭

3. 앱 정보 입력:
   - **Platform**: iOS
   - **Name**: 스티커 크롭
   - **Primary Language**: Korean
   - **Bundle ID**: com.zziraengi.stickercrop (Xcode에서 설정한 것과 동일)
   - **SKU**: sticker-crop-001 (고유 식별자)

4. **App Information** 탭에서:
   - **Category**: Graphics & Design (그래픽 및 디자인)
   - **Subcategory**: 선택 사항
   - **Content Rights**: 체크 (귀하가 콘텐츠에 대한 권리 보유)

### 2단계: 앱 스토어 메타데이터 작성

#### 앱 설명 (Description)

```
카카오톡과 네이버 OGQ 이모티콘 제작을 위한 전문 도구입니다.

주요 기능:
• 4000×8000px 이미지를 카카오톡용 360×360px로 자동 절단
• 2960×2840px 이미지를 네이버 OGQ용 740×640px로 변환
• 드래그 앤 드롭으로 간편한 이미지 업로드
• 스티커 순서 재정렬 기능
• 채팅 프리뷰로 실제 사용 모습 확인
• ZIP 파일로 일괄 다운로드

카카오톡 이모티콘 작가와 OGQ 이모티콘 작가를 위한 필수 도구입니다.

제작자: zziraengi
Instagram: @zziraengi
```

#### 키워드 (Keywords)

```
카카오톡,이모티콘,OGQ,네이버,스티커,절단,크롭,이미지,편집,디자인
```

#### 프로모션 텍스트 (Promotional Text)

```
이모티콘 제작이 더 쉬워집니다! 이미지를 업로드하고 자동으로 규격에 맞게 절단하세요.
```

#### 스크린샷 요구사항

- **iPhone (6.7")**: 1290×2796px (최소 3장, 최대 10장)
- **iPhone (6.5")**: 1284×2778px
- **iPhone (5.5")**: 1242×2208px

**권장 스크린샷:**
1. 홈 화면 (플랫폼 선택)
2. 이미지 업로드 화면
3. 절단된 스티커 그리드
4. 채팅 프리뷰 화면
5. 다운로드 완료 화면

### 3단계: 앱 아이콘 및 에셋

1. **App Icon**: 1024×1024px PNG (투명 배경 없음)
   - Xcode에서 Assets.xcassets에 추가

2. **Launch Screen**: capacitor.config.ts에서 설정됨

### 4단계: 빌드 및 업로드

1. Xcode에서 Archive 생성:
   ```
   Product > Archive
   ```

2. Archive Organizer에서:
   - **Distribute App** 클릭
   - **App Store Connect** 선택
   - **Upload** 선택
   - 서명 옵션 확인 후 **Upload**

3. App Store Connect에서 빌드 확인:
   - 업로드 후 5-10분 대기
   - **TestFlight** 탭에서 빌드 확인

### 5단계: 심사 제출

1. **App Information** 완성 확인
2. **Pricing and Availability**: 무료 선택
3. **App Privacy**: 데이터 수집 정보 입력
   - 현재 앱은 개인정보를 수집하지 않음
4. **App Review Information**: 연락처 정보 입력
5. **Submit for Review** 클릭

#### 심사 노트 (App Review Notes)

```
이 앱은 카카오톡과 네이버 OGQ 이모티콘 제작을 위한 이미지 절단 도구입니다.

테스트 방법:
1. 홈 화면에서 "카카오톡" 또는 "네이버 OGQ" 선택
2. 테스트 이미지 업로드 (첨부된 test-image.png 사용)
3. "절단하기" 버튼 클릭
4. 결과 확인 및 다운로드

모든 이미지 처리는 클라이언트 측에서 진행되며 서버로 전송되지 않습니다.
```

### 6단계: 심사 대기

- 평균 심사 시간: 24-48시간
- 상태는 App Store Connect에서 확인 가능
- 거절 시: 피드백 확인 후 수정하여 재제출

---

## Google Play Store 제출

### 1단계: Google Play Console 설정

1. [Google Play Console](https://play.google.com/console)에 로그인

2. **Create app** 클릭

3. 앱 정보 입력:
   - **App name**: 스티커 크롭
   - **Default language**: Korean (ko-KR)
   - **App or game**: App
   - **Free or paid**: Free

4. 개발자 정책 동의 체크

### 2단계: 앱 콘텐츠

#### Main store listing

**Short description** (80자 이하):
```
카카오톡과 네이버 OGQ 이모티콘 제작을 위한 이미지 절단 도구
```

**Full description** (4000자 이하):
```
스티커 크롭은 카카오톡과 네이버 OGQ 이모티콘 제작자를 위한 전문 도구입니다.

🎨 주요 기능

• 카카오톡 이모티콘 제작
  - 4000×8000px 이미지를 360×360px로 자동 절단
  - 32장의 이모티콘을 정확한 규격으로 분할

• 네이버 OGQ 이모티콘 제작
  - 2960×2840px 또는 4000×8000px 이미지 지원
  - 740×640px 규격으로 정확한 변환
  - 메인 이미지 및 탭 이미지 생성

• 편리한 작업 환경
  - 드래그 앤 드롭으로 간편한 이미지 업로드
  - 스티커 순서를 자유롭게 재정렬
  - 실시간 채팅 프리뷰 기능
  - ZIP 파일로 일괄 다운로드

✨ 특징

- 오프라인 작동: 모든 처리는 기기에서 진행
- 개인정보 보호: 이미지가 서버로 전송되지 않음
- 빠른 처리: 즉시 결과 확인 가능
- 직관적인 UI: 누구나 쉽게 사용 가능

📱 사용 방법

1. 카카오톡 또는 네이버 OGQ 선택
2. 이미지 업로드
3. 자동 절단 실행
4. 프리뷰 확인
5. ZIP 파일 다운로드

제작자: zziraengi
Instagram: @zziraengi

이모티콘 제작이 더 쉬워집니다!
```

#### Screenshots

- **Phone**: 최소 2장, 권장 8장
- **Tablet**: 선택 사항
- **크기**: 320px - 3840px (16:9 또는 9:16 비율)

**권장 스크린샷:**
1. 홈 화면
2. 이미지 업로드
3. 절단된 스티커
4. 채팅 프리뷰
5. 다운로드 화면

#### App icon

- **크기**: 512×512px
- **형식**: 32-bit PNG
- **투명 배경**: 없음

#### Feature graphic

- **크기**: 1024×500px
- **형식**: JPG 또는 PNG
- **용도**: Play Store 상단 배너

### 3단계: 앱 카테고리 및 연락처

- **App category**: Tools (도구)
- **Tags**: Image, Sticker, Emoticon
- **Email**: 귀하의 이메일
- **Website**: 선택 사항
- **Privacy Policy**: 필수 (아래 템플릿 참고)

#### 개인정보 처리방침 템플릿

```
개인정보 처리방침

스티커 크롭 앱은 사용자의 개인정보를 수집, 저장 또는 전송하지 않습니다.

1. 데이터 수집
   - 본 앱은 어떠한 개인정보도 수집하지 않습니다.
   - 업로드된 이미지는 사용자의 기기에서만 처리됩니다.
   - 이미지가 외부 서버로 전송되지 않습니다.

2. 광고
   - 본 앱은 Google AdMob을 사용하여 광고를 표시합니다.
   - AdMob 개인정보 처리방침: https://policies.google.com/privacy

3. 연락처
   - 이메일: [귀하의 이메일]
   - Instagram: @zziraengi

최종 업데이트: 2025년 1월
```

### 4단계: Content rating

1. **Start questionnaire** 클릭
2. 카테고리: **Utility, Productivity, Communication, or Other**
3. 질문에 답변:
   - Violence: No
   - Sexual content: No
   - Profanity: No
   - Controlled substances: No
   - Gambling: No

### 5단계: APK/AAB 업로드

1. **Production** > **Create new release**

2. **App signing by Google Play**: 활성화 권장

3. AAB 파일 업로드:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

4. **Release name**: 1.0.0

5. **Release notes** (한국어):
   ```
   첫 출시 버전
   
   • 카카오톡 이모티콘 절단 기능
   • 네이버 OGQ 이모티콘 변환 기능
   • 드래그 앤 드롭 업로드
   • 채팅 프리뷰
   • ZIP 일괄 다운로드
   ```

### 6단계: 심사 제출

1. 모든 섹션 완료 확인 (초록색 체크)
2. **Review release** 클릭
3. **Start rollout to Production** 클릭

#### 심사 대기

- 평균 심사 시간: 3-7일
- 상태는 Play Console에서 확인
- 승인 후 자동 배포 또는 단계별 출시 선택 가능

---

## 앱 업데이트

### iOS 업데이트

1. Xcode에서 버전 번호 증가:
   - **Version**: 1.0.1
   - **Build**: 2

2. Archive 생성 및 업로드

3. App Store Connect에서 새 버전 추가

4. 변경사항 작성 후 제출

### Android 업데이트

1. `android/app/build.gradle` 수정:
   ```gradle
   versionCode 2
   versionName "1.0.1"
   ```

2. AAB 빌드 및 업로드

3. Play Console에서 새 릴리스 생성

---

## 체크리스트

### iOS App Store
- [ ] Apple Developer Program 가입
- [ ] App Store Connect 앱 생성
- [ ] 앱 설명 및 키워드 작성
- [ ] 스크린샷 준비 (최소 3장)
- [ ] 앱 아이콘 (1024×1024px)
- [ ] Archive 빌드 및 업로드
- [ ] 개인정보 처리방침 작성
- [ ] 심사 제출

### Google Play Store
- [ ] Google Play Developer 계정 가입
- [ ] Play Console 앱 생성
- [ ] 앱 설명 작성
- [ ] 스크린샷 준비 (최소 2장)
- [ ] 앱 아이콘 (512×512px)
- [ ] Feature graphic (1024×500px)
- [ ] Content rating 완료
- [ ] AAB 파일 업로드
- [ ] 개인정보 처리방침 URL 등록
- [ ] 심사 제출

---

## 유용한 링크

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [AdMob 정책](https://support.google.com/admob/answer/6128543)

## 문제 해결

### iOS 거절 사유

**2.1 Performance: App Completeness**
- 앱이 충돌하거나 기능이 작동하지 않음
- 해결: 모든 기능 철저히 테스트

**4.3 Spam**
- 유사한 앱이 많음
- 해결: 고유한 기능 강조, 앱 설명 개선

**5.1.2 Legal: Privacy**
- 개인정보 처리방침 누락
- 해결: Privacy Policy URL 제공

### Android 거절 사유

**Violates Google Play policies**
- 광고 정책 위반 가능
- 해결: AdMob 정책 준수 확인

**Metadata policy violation**
- 앱 설명이 부적절하거나 오해의 소지
- 해결: 명확하고 정확한 설명 작성

---

빌드 및 제출에 성공하셨습니다! 🎉

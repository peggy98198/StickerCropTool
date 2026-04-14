import { Link } from 'wouter';
import { ArrowLeft, ExternalLink, Instagram, Scissors, Upload, Grid3x3, ArrowLeftRight, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SiAppstore } from 'react-icons/si';

const APP_STORE_URL = 'https://apps.apple.com/kr/app/%EC%8A%A4%ED%8B%B0%EC%BB%A4-%ED%81%AC%EB%A1%AD/id6754418208';
const INSTAGRAM_URL = 'https://instagram.com/zziraengi';

const techStack = [
  'React', 'TypeScript', 'Capacitor', 'Canvas API', 'Tailwind CSS', 'AdMob',
];

const features = [
  { icon: Upload, label: '드래그 앤 드롭 업로드' },
  { icon: Grid3x3, label: '자동 그리드 감지 및 분할' },
  { icon: ArrowLeftRight, label: '드래그로 스티커 순서 변경' },
  { icon: Eye, label: '채팅 미리보기 모드' },
  { icon: Download, label: 'iOS 네이티브 저장' },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 헤더 */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-portfolio-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">포트폴리오</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* 제작자 소개 */}
        <div className="text-center space-y-2 py-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 mx-auto flex items-center justify-center">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">zziraengi</h2>
          <p className="text-gray-500 text-sm">iOS 앱 개발자 · 스티커 이모티콘 작가</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-pink-500 hover:text-pink-600 transition-colors"
            data-testid="link-instagram"
          >
            <Instagram className="w-4 h-4" />
            @zziraengi
          </a>
        </div>

        {/* 프로젝트 카드 */}
        <Card className="overflow-hidden shadow-sm" data-testid="card-project">
          {/* 운영 중 배지 */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">스티커 크롭</span>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-medium">App Store 운영 중</span>
            </div>
          </div>

          <CardHeader className="pb-3">
            <p className="text-gray-600 text-sm leading-relaxed">
              KakaoTalk & Naver OGQ 플랫폼용 스티커 이미지를 자동으로 분할하고 변환하는 iOS 앱.
              서버 없이 기기 내에서 모든 처리를 완료합니다.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* 지원 플랫폼 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-gray-800 mb-0.5">카카오톡</div>
                <div className="text-xs text-gray-500">360×360 px</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-gray-800 mb-0.5">Naver OGQ</div>
                <div className="text-xs text-gray-500">740×640 px</div>
              </div>
            </div>

            {/* 주요 기능 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">주요 기능</h3>
              <ul className="space-y-2">
                {features.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-500" />
                    </div>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* 기술 스택 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">기술 스택</h3>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs"
                    data-testid={`badge-tech-${tech.toLowerCase()}`}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 앱스토어 버튼 */}
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-appstore"
            >
              <Button className="w-full gap-2 bg-black hover:bg-gray-800 text-white h-12 text-base">
                <SiAppstore className="w-5 h-5" />
                App Store에서 다운로드
                <ExternalLink className="w-4 h-4 opacity-70" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* 개발 포인트 */}
        <Card className="shadow-sm">
          <CardContent className="pt-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">기술적 도전</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="border-l-2 border-purple-300 pl-3">
                <p className="font-medium text-gray-700 mb-0.5">클라이언트 사이드 이미지 처리</p>
                <p>서버 전송 없이 Canvas API만으로 이미지 분할·리사이즈를 처리해 개인정보 유출 위험을 없앴습니다.</p>
              </div>
              <div className="border-l-2 border-blue-300 pl-3">
                <p className="font-medium text-gray-700 mb-0.5">iOS 네이티브 파일 저장</p>
                <p>Filesystem API로 임시 파일을 생성 후 Share API의 files 파라미터로 전달해 공유 시트에서 직접 저장이 가능하도록 구현했습니다.</p>
              </div>
              <div className="border-l-2 border-green-300 pl-3">
                <p className="font-medium text-gray-700 mb-0.5">드래그 충돌 방지</p>
                <p>스와이프 뒤로가기 제스처와 스티커 드래그 앤 드롭이 충돌하지 않도록 touch target 영역을 분리했습니다.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 여백 */}
        <div className="pb-8 text-center">
          <p className="text-xs text-gray-400">© 2025 zziraengi</p>
        </div>
      </div>
    </div>
  );
}

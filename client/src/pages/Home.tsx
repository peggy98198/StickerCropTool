import { Link } from 'wouter';
import { MessageSquare, Hash, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            이모티콘 절단기
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            이미지를 업로드하고 원하는 부분을 잘라서 이모티콘을 만드세요
          </p>
          <p className="text-gray-500">
            플랫폼을 선택해주세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/kakao">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-400 group">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <MessageSquare size={40} className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  카카오톡
                </h2>
                <p className="text-gray-600 mb-4">
                  1000×1000 (32장) → 360×360 축소
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>✓ 자동 그리드 감지</p>
                  <p>✓ 드래그 앤 드롭 업로드</p>
                  <p>✓ 대화창 미리보기</p>
                  <p>✓ ZIP 파일 다운로드</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/ogq">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400 group">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Hash size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  네이버 OGQ
                </h2>
                <p className="text-gray-600 mb-4">
                  1000×1000 (32장) → 메인/탭 생성 → 740×640 변환
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>✓ 자동 그리드 감지</p>
                  <p>✓ 드래그 앤 드롭 업로드</p>
                  <p>✓ 메인/탭 이미지 생성</p>
                  <p>✓ ZIP 파일 다운로드</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Heart size={24} className="text-pink-500" />
                  이 도구가 도움이 되셨나요?
                </h3>
                <p className="text-gray-600">
                  개발을 지원하고 싶으시다면 후원해주세요 ☕
                </p>
              </div>
              <a 
                href="https://ko-fi.com/zziraengi" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="link-support-home"
              >
                <Button 
                  className="gap-2 font-semibold px-6 py-6 text-lg"
                  style={{ backgroundColor: '#FF5E5B', color: 'white' }}
                >
                  <Heart size={20} fill="white" />
                  Ko-fi로 후원하기
                </Button>
              </a>
            </div>
          </Card>
        </div>

        <footer className="mt-12 py-4 text-center text-sm text-gray-500 border-t">
          <p>
            © 2025{' '}
            <a 
              href="https://instagram.com/zziraengi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 hover:underline"
            >
              @zziraengi
            </a>
            . All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

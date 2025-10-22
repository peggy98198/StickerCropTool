import { Link } from 'wouter';
import { MessageCircle, Menu, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      toast({
        title: "피드백을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    // 이메일로 피드백 전송 (mailto 사용)
    const subject = encodeURIComponent('이모티콘 절단기 피드백');
    const body = encodeURIComponent(
      `피드백:\n${feedbackText}\n\n${email ? `이메일: ${email}` : ''}`
    );
    window.location.href = `mailto:feedback@example.com?subject=${subject}&body=${body}`;

    toast({
      title: "피드백 감사합니다!",
      description: "소중한 의견 감사드립니다.",
    });

    setFeedbackText('');
    setEmail('');
    setFeedbackOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 헤더 */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">이모티콘 절단기</h1>
          
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DialogTrigger asChild>
                  <DropdownMenuItem data-testid="menu-feedback">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>피드백 보내기</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>피드백 보내기</DialogTitle>
                <DialogDescription>
                  서비스 개선을 위한 의견을 자유롭게 남겨주세요. 불편한 점, 개선 아이디어, 칭찬 모두 환영합니다!
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback">피드백</Label>
                  <Textarea
                    id="feedback"
                    placeholder="예) 이미지 크기를 자동으로 맞춰주는 기능이 있으면 좋겠어요"
                    className="min-h-[120px]"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    data-testid="textarea-feedback"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 (선택사항)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="답변을 받고 싶으시면 이메일을 남겨주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setFeedbackOpen(false)}
                  data-testid="button-cancel"
                >
                  취소
                </Button>
                <Button
                  onClick={handleFeedbackSubmit}
                  data-testid="button-submit-feedback"
                >
                  보내기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              이모티콘 절단기
            </h2>
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
                    <MessageCircle size={40} className="text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    카카오톡
                  </h2>
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
                    <span className="text-5xl font-bold text-green-600">N</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    네이버 OGQ
                  </h2>
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

          <footer className="mt-12 py-4 text-center text-sm text-gray-500 border-t">
            <p>
              © 2025 zziraengi. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

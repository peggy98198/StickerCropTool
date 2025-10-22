import { Link } from 'wouter';
import { MessageCircle, Menu, Send, Bot, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

type ChatStep = 'welcome' | 'feedback' | 'email' | 'complete';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatOpen && step === 'welcome' && messages.length === 0) {
      // 챗봇 열릴 때 환영 메시지 (한 번만)
      setTimeout(() => {
        addBotMessage('안녕하세요!\n서비스 개선을 위한 의견을 자유롭게 남겨주세요.\n불편한 점, 개선 아이디어, 칭찬 모두 환영합니다!');
      }, 300);
    }
  }, [chatOpen, step, messages.length]);

  useEffect(() => {
    // 입력창에 자동 포커스
    if (chatOpen && (step === 'feedback' || step === 'email')) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [step, chatOpen]);

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const trimmedInput = inputValue.trim();
    addUserMessage(trimmedInput);
    setInputValue('');

    if (step === 'feedback') {
      setFeedbackText(trimmedInput);
      setStep('email');
      setTimeout(() => {
        addBotMessage('소중한 의견 감사합니다!\n\n답변을 원하시면 이메일 주소를 남겨주세요.\n(선택사항이니 부담없이 건너뛰셔도 됩니다)');
      }, 500);
    } else if (step === 'email') {
      setEmail(trimmedInput);
      handleSubmitFeedback(trimmedInput);
    }
  };

  const handleSkipEmail = () => {
    addUserMessage('건너뛰기');
    handleSubmitFeedback('');
  };

  const handleSubmitFeedback = (userEmail: string) => {
    setStep('complete');
    
    // 이메일로 피드백 전송
    const subject = encodeURIComponent('이모티콘 절단기 피드백');
    const body = encodeURIComponent(
      `피드백:\n${feedbackText}\n\n${userEmail ? `이메일: ${userEmail}` : '이메일: 제공 안 함'}`
    );
    window.location.href = `mailto:feedback@example.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      addBotMessage('피드백 감사합니다!\n\n더 나은 서비스로 보답하겠습니다.\n즐거운 하루 보내세요!');
    }, 500);

    toast({
      title: "피드백이 전송되었습니다",
      description: "소중한 의견 감사드립니다!",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setStep('welcome');
    setMessages([]);
    setInputValue('');
    setFeedbackText('');
    setEmail('');
    setTimeout(() => {
      addBotMessage('안녕하세요!\n서비스 개선을 위한 의견을 자유롭게 남겨주세요.\n불편한 점, 개선 아이디어, 칭찬 모두 환영합니다!');
    }, 300);
  };

  const handleOpenChange = (open: boolean) => {
    setChatOpen(open);
    if (open && messages.length === 0) {
      setStep('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 헤더 */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="w-10"></div>
          <h1 className="text-3xl font-bold text-gray-800 flex-1 text-center">이모티콘 절단기</h1>
          
          <Sheet open={chatOpen} onOpenChange={handleOpenChange}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <SheetTrigger asChild>
                  <DropdownMenuItem data-testid="menu-feedback">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>피드백 보내기</span>
                  </DropdownMenuItem>
                </SheetTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-purple-600" />
                  피드백 챗봇
                </SheetTitle>
                <SheetDescription>
                  편하게 대화하듯이 의견을 남겨주세요
                </SheetDescription>
              </SheetHeader>

              {/* 채팅 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#f5f5f5' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${message.type}-${message.id}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'bot' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {message.type === 'bot' ? (
                          <Bot className="w-5 h-5 text-purple-600" />
                        ) : (
                          <User className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.type === 'bot'
                            ? 'bg-white border border-gray-200'
                            : 'bg-blue-500 text-white'
                        }`}
                        data-testid={`text-message-${message.id}`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="border-t bg-white p-4">
                {step === 'welcome' && (
                  <Button
                    onClick={() => {
                      setStep('feedback');
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="w-full"
                    data-testid="button-start-feedback"
                  >
                    피드백 남기기
                  </Button>
                )}

                {step === 'feedback' && (
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="의견을 입력해주세요..."
                      className="flex-1"
                      data-testid="input-feedback"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      size="icon"
                      data-testid="button-send"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {step === 'email' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        type="email"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="example@email.com"
                        className="flex-1"
                        data-testid="input-email"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        size="icon"
                        data-testid="button-send-email"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSkipEmail}
                      variant="outline"
                      className="w-full"
                      data-testid="button-skip-email"
                    >
                      건너뛰기
                    </Button>
                  </div>
                )}

                {step === 'complete' && (
                  <Button
                    onClick={() => {
                      resetChat();
                    }}
                    variant="outline"
                    className="w-full"
                    data-testid="button-new-feedback"
                  >
                    새 피드백 작성
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
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

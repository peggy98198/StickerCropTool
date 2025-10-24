import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpButton() {
  const handleClick = () => {
    // 커스텀 이벤트 발생 - App.tsx에서 리스닝하여 온보딩 표시
    window.dispatchEvent(new Event('show-onboarding'));
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={handleClick}
      className="fixed bottom-6 left-4 z-40 h-12 w-12 rounded-full shadow-lg bg-card/80 backdrop-blur-sm hover:bg-card border border-border"
      data-testid="button-help"
      aria-label="도움말 보기"
    >
      <HelpCircle className="w-5 h-5" />
    </Button>
  );
}

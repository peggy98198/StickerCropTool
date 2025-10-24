import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetOnboarding } from "@/App";

export function HelpButton() {
  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={resetOnboarding}
      className="fixed bottom-4 left-4 z-40 h-12 w-12 rounded-full shadow-lg bg-card/80 backdrop-blur-sm hover:bg-card border border-border"
      data-testid="button-help"
      aria-label="도움말 보기"
    >
      <HelpCircle className="w-5 h-5" />
    </Button>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Upload, Grid3x3, Scissors, X } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Upload,
      title: "이미지 업로드",
      description: "스티커로 만들 이미지를 선택하세요",
      visual: (
        <div className="relative w-full h-64 bg-card border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <Upload className="w-16 h-16 mx-auto text-primary/40" />
            <p className="text-sm text-muted-foreground">이미지를 끌어다 놓거나<br />클릭하여 선택</p>
          </div>
        </div>
      ),
    },
    {
      icon: Grid3x3,
      title: "플랫폼 선택",
      description: "카카오톡 또는 OGQ를 선택하세요",
      visual: (
        <div className="space-y-3 w-full">
          <div className="bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-foreground mb-1">카카오톡</div>
            <div className="text-sm text-muted-foreground">360×360</div>
          </div>
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-foreground mb-1">OGQ</div>
            <div className="text-sm text-muted-foreground">740×640</div>
          </div>
        </div>
      ),
    },
    {
      icon: Scissors,
      title: "스티커 자르기",
      description: "그리드를 설정하고 스티커를 다운로드하세요",
      visual: (
        <div className="space-y-3 w-full">
          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">행</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" disabled>-</Button>
                <span className="text-sm font-medium w-8 text-center">4</span>
                <Button size="icon" variant="outline" className="h-8 w-8" disabled>+</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">열</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" disabled>-</Button>
                <span className="text-sm font-medium w-8 text-center">5</span>
                <Button size="icon" variant="outline" className="h-8 w-8" disabled>+</Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-square bg-primary/5 rounded border border-primary/20" />
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-card border rounded-lg shadow-lg p-6 space-y-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-onboarding-close"
          aria-label="온보딩 건너뛰기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 단계 표시 */}
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
              }`}
              data-testid={`indicator-step-${i}`}
            />
          ))}
        </div>

        {/* 아이콘 */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* 제목 및 설명 */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-onboarding-title">
            {currentStep.title}
          </h2>
          <p className="text-muted-foreground" data-testid="text-onboarding-description">
            {currentStep.description}
          </p>
        </div>

        {/* 시각적 데모 */}
        <div className="flex justify-center">
          {currentStep.visual}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onComplete}
            className="flex-1"
            data-testid="button-onboarding-skip"
          >
            건너뛰기
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
            data-testid="button-onboarding-next"
          >
            {step < steps.length - 1 ? (
              <>
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              "시작하기"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

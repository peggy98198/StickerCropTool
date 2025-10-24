import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Grid3x3, Scissors } from "lucide-react";

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
        <div className="relative w-full h-48 bg-card/50 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <Upload className="w-12 h-12 mx-auto text-primary/40" />
            <p className="text-xs text-muted-foreground">이미지를 끌어다 놓거나<br />클릭하여 선택</p>
          </div>
        </div>
      ),
    },
    {
      icon: Grid3x3,
      title: "플랫폼 선택",
      description: "카카오톡 또는 OGQ를 선택하세요",
      visual: (
        <div className="space-y-2 w-full">
          <div className="bg-[#FFEB3B]/10 border border-[#FFEB3B]/30 rounded-lg p-3 text-center">
            <div className="text-base font-bold text-foreground mb-0.5">카카오톡</div>
            <div className="text-xs text-muted-foreground">360×360</div>
          </div>
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-3 text-center">
            <div className="text-base font-bold text-foreground mb-0.5">OGQ</div>
            <div className="text-xs text-muted-foreground">740×640</div>
          </div>
        </div>
      ),
    },
    {
      icon: Scissors,
      title: "스티커 자르기",
      description: "그리드를 설정하고 스티커를 다운로드하세요",
      visual: (
        <div className="space-y-2 w-full">
          <div className="bg-card/50 border rounded-lg p-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">행</span>
              <div className="flex items-center gap-1.5">
                <Button size="icon" variant="outline" className="h-7 w-7" disabled>-</Button>
                <span className="text-xs font-medium w-6 text-center">4</span>
                <Button size="icon" variant="outline" className="h-7 w-7" disabled>+</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">열</span>
              <div className="flex items-center gap-1.5">
                <Button size="icon" variant="outline" className="h-7 w-7" disabled>-</Button>
                <span className="text-xs font-medium w-6 text-center">5</span>
                <Button size="icon" variant="outline" className="h-7 w-7" disabled>+</Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 15 }).map((_, i) => (
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

  const handleClickAnywhere = () => {
    handleNext();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClickAnywhere}
      data-testid="onboarding-overlay"
    >
      <div 
        className="relative w-full max-w-sm bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
        data-testid="onboarding-card"
      >
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
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* 제목 및 설명 */}
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold text-foreground" data-testid="text-onboarding-title">
            {currentStep.title}
          </h2>
          <p className="text-sm text-muted-foreground" data-testid="text-onboarding-description">
            {currentStep.description}
          </p>
        </div>

        {/* 시각적 데모 */}
        <div className="flex justify-center px-2">
          {currentStep.visual}
        </div>

        {/* 안내 텍스트 */}
        <p className="text-xs text-center text-muted-foreground/80">
          화면을 탭하여 계속
        </p>

        {/* 건너뛰기 버튼 (강조) */}
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="w-full h-11 text-base font-semibold border-2"
          data-testid="button-onboarding-skip"
        >
          건너뛰기
        </Button>
      </div>
    </div>
  );
}

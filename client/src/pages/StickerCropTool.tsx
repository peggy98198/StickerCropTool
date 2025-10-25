import { useState, useRef, useEffect } from 'react';
import { Upload, Download, MessageCircle, ZoomOut, GripVertical, MessageSquare, X, ChevronDown, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HelpButton } from '@/components/HelpButton';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdMobBanner } from '@/components/admob/AdMobBanner';
import { ADMOB_CONFIG } from '@/lib/admob-config';
import { prepareInterstitialAd, showInterstitialAd, isInterstitialReady } from '@/lib/admob-interstitial';
import { downloadImageNative, downloadZipNative } from '@/lib/filesystem-helper';

interface SortableStickerProps {
  id: string;
  dataUrl: string;
  index: number;
  onDownload: () => void;
}

function SortableSticker({ id, dataUrl, index, onDownload }: SortableStickerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50 hover:shadow-md transition relative group"
      data-testid={`card-sticker-${index}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-gray-800 bg-opacity-70 text-white rounded p-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        data-testid={`drag-handle-${index}`}
        aria-label={`Drag sticker ${index + 1}`}
        type="button"
      >
        <GripVertical size={14} />
      </button>
      <div className="text-xs text-gray-500 mb-1 text-center font-semibold">
        #{index + 1}
      </div>
      <img
        src={dataUrl}
        alt={`Sticker ${index + 1}`}
        className="w-full h-auto rounded mb-2"
        data-testid={`img-sticker-${index}`}
        draggable={false}
      />
      <Button
        data-testid={`button-download-${index}`}
        onClick={onDownload}
        className="w-full py-1 px-2 text-xs"
        style={{ backgroundColor: 'hsl(262, 52%, 47%)', color: 'white' }}
      >
        <Download size={12} />
        다운로드
      </Button>
    </div>
  );
}

interface StickerCropToolProps {
  platform?: 'kakao' | 'ogq';
}

export default function StickerCropTool({ platform: fixedPlatform }: StickerCropToolProps = {}) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [currentSize, setCurrentSize] = useState<number | string>(1000);
  const [platform, setPlatform] = useState<'kakao' | 'ogq' | null>(fixedPlatform || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ogqMainImage, setOgqMainImage] = useState<string | null>(null);
  const [ogqTabImage, setOgqTabImage] = useState<string | null>(null);
  const [selectedMainIndex, setSelectedMainIndex] = useState(0);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [gridRows, setGridRows] = useState(8);
  const [gridCols, setGridCols] = useState(4);
  const [autoDetectGrid, setAutoDetectGrid] = useState(true);
  const [showChatPreview, setShowChatPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCroppedImages((items) => {
        const oldIndex = items.findIndex((_, i) => `sticker-${i}` === active.id);
        const newIndex = items.findIndex((_, i) => `sticker-${i}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 스와이프 제스처로 뒤로가기 (DnD와 충돌 방지)
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let shouldIgnoreSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      
      // 터치가 스티커 그리드 영역이나 인터랙티브 요소에서 시작되었는지 확인
      const target = e.target as HTMLElement;
      
      // 스티커 그리드 영역만 제외 (data-testid="sticker-grid"를 가진 요소 또는 그 자식)
      const isInStickerGrid = target.closest('[data-testid="sticker-grid"]') !== null;
      
      // 버튼, 인풋 등 인터랙티브 요소 제외
      const isInteractiveElement = target.closest('button') !== null ||
                                   target.closest('input') !== null ||
                                   target.closest('textarea') !== null ||
                                   target.closest('a') !== null;
      
      shouldIgnoreSwipe = isInStickerGrid || isInteractiveElement;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // 스티커 그리드나 DnD 요소에서 시작된 터치는 무시
      if (shouldIgnoreSwipe) {
        return;
      }

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // 오른쪽으로 스와이프 (왼쪽 가장자리에서 시작, 100px 이상 이동, 수평 방향이 우세)
      if (
        startX < 50 && // 왼쪽 가장자리에서 시작
        deltaX > 100 && // 오른쪽으로 100px 이상
        Math.abs(deltaX) > Math.abs(deltaY) * 2 && // 수평 이동이 수직 이동의 2배 이상
        deltaTime < 500 // 0.5초 이내
      ) {
        // 뒤로가기
        if (window.history.length > 1) {
          window.history.back();
        } else {
          setLocation('/');
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [setLocation]);

  const detectGridSize = (img: HTMLImageElement, width: number, height: number) => {
    if (width === 4000 && height === 8000) {
      return { cols: 4, rows: 8 };
    }
    
    if (width === 2960 && height === 2840) {
      return { cols: 4, rows: 4 };
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      const stickerSize = 1000;
      const detectedCols = Math.floor(width / stickerSize);
      const detectedRows = Math.floor(height / stickerSize);
      return detectedCols > 0 && detectedRows > 0 ? { cols: detectedCols, rows: detectedRows } : { cols: 4, rows: 8 };
    }
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let detectedCols = 0;
    let detectedRows = 0;
    
    const scanInterval = Math.floor(width / 100);
    const threshold = 30;
    
    for (let x = scanInterval; x < width - scanInterval; x += scanInterval) {
      let verticalEdgeCount = 0;
      for (let y = 1; y < height - 1; y++) {
        const idx = (y * width + x) * 4;
        const prevIdx = ((y - 1) * width + x) * 4;
        
        const currentBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const prevBrightness = (data[prevIdx] + data[prevIdx + 1] + data[prevIdx + 2]) / 3;
        
        if (Math.abs(currentBrightness - prevBrightness) > threshold) {
          verticalEdgeCount++;
        }
      }
      
      if (verticalEdgeCount > height * 0.3) {
        detectedCols++;
      }
    }
    
    for (let y = scanInterval; y < height - scanInterval; y += scanInterval) {
      let horizontalEdgeCount = 0;
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const prevIdx = (y * width + (x - 1)) * 4;
        
        const currentBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const prevBrightness = (data[prevIdx] + data[prevIdx + 1] + data[prevIdx + 2]) / 3;
        
        if (Math.abs(currentBrightness - prevBrightness) > threshold) {
          horizontalEdgeCount++;
        }
      }
      
      if (horizontalEdgeCount > width * 0.3) {
        detectedRows++;
      }
    }
    
    detectedCols = Math.max(1, Math.round(detectedCols / 10));
    detectedRows = Math.max(1, Math.round(detectedRows / 10));
    
    if (detectedCols < 2 || detectedRows < 2 || detectedCols > 10 || detectedRows > 20) {
      const stickerSize = 1000;
      const fallbackCols = Math.floor(width / stickerSize);
      const fallbackRows = Math.floor(height / stickerSize);
      return fallbackCols > 0 && fallbackRows > 0 ? { cols: fallbackCols, rows: fallbackRows } : { cols: 4, rows: 8 };
    }
    
    return { cols: detectedCols, rows: detectedRows };
  };

  const loadImageFromFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setCroppedImages([]);
        setOgqMainImage(null);
        setOgqTabImage(null);
        setPlatform(null);
        
        if (autoDetectGrid) {
          const detected = detectGridSize(img, img.width, img.height);
          setGridCols(detected.cols);
          setGridRows(detected.rows);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFromFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImageFromFile(file);
    }
  };

  const cropKakaoStickers = () => {
    if (!image) return;
    
    setIsProcessing(true);
    const newCroppedImages: string[] = [];
    
    const stickerWidth = Math.floor(image.width / gridCols);
    const stickerHeight = Math.floor(image.height / gridRows);
    const stickerSize = Math.min(stickerWidth, stickerHeight);
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stickerSize;
        tempCanvas.height = stickerSize;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(
            image,
            col * stickerWidth,
            row * stickerHeight,
            stickerWidth,
            stickerHeight,
            0,
            0,
            stickerSize,
            stickerSize
          );
        }
        
        const croppedDataUrl = tempCanvas.toDataURL('image/png');
        newCroppedImages.push(croppedDataUrl);
      }
    }
    
    setCroppedImages(newCroppedImages);
    setCurrentSize(stickerSize);
    setPlatform('kakao');
    setIsProcessing(false);
    
    // 전면 광고 준비 (절단 완료 후)
    prepareInterstitialAd(ADMOB_CONFIG.INTERSTITIAL_ID, ADMOB_CONFIG.TEST_MODE).catch(err => {
      console.error('전면 광고 준비 실패:', err);
    });
  };

  const cropOGQStickers = () => {
    if (!image) return;
    
    setIsProcessing(true);
    const newCroppedImages: string[] = [];
    
    const stickerWidth = Math.floor(image.width / gridCols);
    const stickerHeight = Math.floor(image.height / gridRows);
    
    const is2960x2840 = image.width === 2960 && image.height === 2840;
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const tempCanvas = document.createElement('canvas');
        
        if (is2960x2840) {
          tempCanvas.width = 740;
          tempCanvas.height = 640;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            const sourceX = col * stickerWidth;
            const sourceY = row * stickerHeight;
            const cropY = (stickerHeight - 640) / 2;
            
            tempCtx.drawImage(
              image,
              sourceX,
              sourceY + cropY,
              740,
              640,
              0,
              0,
              740,
              640
            );
          }
        } else {
          const stickerSize = Math.min(stickerWidth, stickerHeight);
          tempCanvas.width = stickerSize;
          tempCanvas.height = stickerSize;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(
              image,
              col * stickerWidth,
              row * stickerHeight,
              stickerWidth,
              stickerHeight,
              0,
              0,
              stickerSize,
              stickerSize
            );
          }
        }
        
        const croppedDataUrl = tempCanvas.toDataURL('image/png');
        newCroppedImages.push(croppedDataUrl);
      }
    }
    
    setCroppedImages(newCroppedImages);
    setCurrentSize(is2960x2840 ? '740×640' : Math.min(stickerWidth, stickerHeight));
    setPlatform('ogq');
    setIsProcessing(false);
    
    // 전면 광고 준비 (절단 완료 후)
    prepareInterstitialAd(ADMOB_CONFIG.INTERSTITIAL_ID, ADMOB_CONFIG.TEST_MODE).catch(err => {
      console.error('전면 광고 준비 실패:', err);
    });
  };

  const createOgqMainImage = () => {
    if (croppedImages.length === 0) return;
    
    const is740x640 = currentSize === '740×640';
    
    const selectedImage = croppedImages[selectedMainIndex];
    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 240;
      tempCanvas.height = 240;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        tempCtx.drawImage(img, 0, 0, 240, 240);
      }
      
      const resizedDataUrl = tempCanvas.toDataURL('image/png');
      setOgqMainImage(resizedDataUrl);
    };
    img.src = selectedImage;
  };

  const createOgqTabImage = () => {
    if (croppedImages.length === 0) return;
    
    const selectedImage = croppedImages[selectedTabIndex];
    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 96;
      tempCanvas.height = 74;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        const targetWidth = 96;
        const targetHeight = 74;
        
        const sourceAspect = sourceWidth / sourceHeight;
        const targetAspect = targetWidth / targetHeight;
        
        let sx = 0, sy = 0, sw = sourceWidth, sh = sourceHeight;
        
        if (sourceAspect > targetAspect) {
          sw = sourceHeight * targetAspect;
          sx = (sourceWidth - sw) / 2;
        } else {
          sh = sourceWidth / targetAspect;
          sy = (sourceHeight - sh) / 2;
        }
        
        tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      }
      
      const resizedDataUrl = tempCanvas.toDataURL('image/png');
      setOgqTabImage(resizedDataUrl);
    };
    img.src = selectedImage;
  };

  const convertToOGQSize = async () => {
    if (croppedImages.length === 0) return;
    
    const is740x640 = currentSize === '740×640';
    if (is740x640) return;
    
    setIsProcessing(true);
    
    const ogqWidth = 740;
    const ogqHeight = 640;
    
    const convertPromises = croppedImages.map((dataUrl) => {
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = ogqWidth;
          tempCanvas.height = ogqHeight;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, ogqWidth, ogqHeight);
          }
          
          const convertedDataUrl = tempCanvas.toDataURL('image/png');
          resolve(convertedDataUrl);
        };
        img.src = dataUrl;
      });
    });
    
    const convertedImages = await Promise.all(convertPromises);
    setCroppedImages(convertedImages);
    setCurrentSize('740×640');
    setIsProcessing(false);
  };

  const resizeTo360 = async () => {
    if (croppedImages.length === 0) return;
    
    setIsProcessing(true);
    
    const resizePromises = croppedImages.map((dataUrl) => {
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 360;
          tempCanvas.height = 360;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, 360, 360);
          }
          
          const resizedDataUrl = tempCanvas.toDataURL('image/png');
          resolve(resizedDataUrl);
        };
        img.src = dataUrl;
      });
    });
    
    const resizedImages = await Promise.all(resizePromises);
    setCroppedImages(resizedImages);
    setCurrentSize(360);
    setIsProcessing(false);
  };

  const downloadImage = async (dataUrl: string, index: number) => {
    try {
      let sizeLabel = '';
      if (currentSize === 360) {
        sizeLabel = '_360';
      } else if (currentSize === '740×640') {
        sizeLabel = '_ogq';
      }
      const filename = `sticker_${String(index + 1).padStart(2, '0')}${sizeLabel}.png`;
      await downloadImageNative(dataUrl, filename);
      toast({
        title: "다운로드 완료",
        description: `${filename}이(가) 저장되었습니다.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "다운로드 실패",
        description: "파일 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const downloadAll = async () => {
    try {
      toast({
        title: "ZIP 파일 생성 중...",
        description: "잠시만 기다려주세요.",
      });

      const zip = new JSZip();
      
      let sizeLabel = '';
      if (currentSize === 360) {
        sizeLabel = '_360';
      } else if (currentSize === '740×640') {
        sizeLabel = '_ogq';
      }
      
      for (let i = 0; i < croppedImages.length; i++) {
        const dataUrl = croppedImages[i];
        const base64Data = dataUrl.split(',')[1];
        const filename = `sticker_${String(i + 1).padStart(2, '0')}${sizeLabel}.png`;
        zip.file(filename, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const zipFilename = `stickers${sizeLabel}.zip`;
      await downloadZipNative(content, zipFilename);
      
      toast({
        title: "다운로드 완료",
        description: `${zipFilename}이(가) 저장되었습니다.`,
      });
    } catch (error) {
      console.error('Download all error:', error);
      toast({
        title: "다운로드 실패",
        description: "ZIP 파일 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
    
    // 전면 광고 표시 (다운로드 완료 후)
    if (isInterstitialReady()) {
      setTimeout(() => {
        showInterstitialAd().catch(err => {
          console.error('전면 광고 표시 실패:', err);
        });
      }, 500); // 다운로드 완료 후 0.5초 뒤 광고 표시
    }
  };

  const handleDownloadOgqMain = async () => {
    if (!ogqMainImage) return;
    try {
      await downloadImageNative(ogqMainImage, 'ogq_main_240x240.png');
      toast({
        title: "다운로드 완료",
        description: "ogq_main_240x240.png이(가) 저장되었습니다.",
      });
    } catch (error) {
      console.error('OGQ Main download error:', error);
      toast({
        title: "다운로드 실패",
        description: "파일 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadOgqTab = async () => {
    if (!ogqTabImage) return;
    try {
      await downloadImageNative(ogqTabImage, 'ogq_tab_96x74.png');
      toast({
        title: "다운로드 완료",
        description: "ogq_tab_96x74.png이(가) 저장되었습니다.",
      });
    } catch (error) {
      console.error('OGQ Tab download error:', error);
      toast({
        title: "다운로드 실패",
        description: "파일 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const isKakaoMode = fixedPlatform === 'kakao' || (!fixedPlatform && platform === 'kakao');
  const isOgqMode = fixedPlatform === 'ogq' || (!fixedPlatform && platform === 'ogq');

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 도움말 버튼 */}
      <HelpButton />
      
      {/* AdMob 상단 배너 */}
      <AdMobBanner 
        adId={ADMOB_CONFIG.BANNER_TOP_ID} 
        position="top" 
        testMode={ADMOB_CONFIG.TEST_MODE}
      />
      
      <div className="p-4 md:p-8 pb-[80px]">
        <div className="max-w-6xl mx-auto">
        {fixedPlatform && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="gap-2" 
              data-testid="button-back"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  setLocation('/');
                }
              }}
            >
              <ArrowLeft size={18} />
              뒤로가기
            </Button>
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {fixedPlatform === 'kakao' && '카카오톡 이모티콘 절단기'}
            {fixedPlatform === 'ogq' && '네이버 OGQ 이모티콘 절단기'}
            
          </h1>
          <p className="text-gray-700 mb-2">
            이미지를 업로드하고 원하는 부분을 잘라서 이모티콘을 만드세요
          </p>
          {fixedPlatform === 'kakao' && (
            <div className="text-sm">
              <p className="text-gray-600">권장 이미지: 4000×8000px</p>
            </div>
          )}
          {fixedPlatform === 'ogq' && (
            <div className="text-sm">
              <p className="text-gray-600">권장 이미지: 4000×8000px 또는 2960×2840px</p>
            </div>
          )}
          {!fixedPlatform && (
            <div className="text-sm space-y-1">
              <p className="text-gray-600">카카오톡 권장: 4000×8000px</p>
              <p className="text-gray-600">네이버 OGQ 권장: 4000×8000px / 2960×2840px</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <Card className="rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="mb-4">
              <input
                data-testid="input-image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                data-testid="dropzone-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <Upload size={48} className={`mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-gray-700 font-semibold mb-1">
                  {isDragging ? '이미지를 여기에 놓으세요' : '이미지를 드래그하거나 클릭하여 업로드'}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF 지원</p>
              </div>
            </div>

            {image && (
              <>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">그리드 설정</h3>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={autoDetectGrid}
                        onChange={(e) => setAutoDetectGrid(e.target.checked)}
                        className="rounded"
                        data-testid="checkbox-auto-detect"
                      />
                      <span className="text-gray-700">자동 감지</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">열 (Columns)</label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          data-testid="button-decrease-cols"
                          onClick={() => setGridCols(Math.max(1, gridCols - 1))}
                          disabled={autoDetectGrid || gridCols <= 1}
                          className="px-3 py-2 font-bold text-lg min-w-[44px]"
                          variant="outline"
                        >
                          −
                        </Button>
                        <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-center font-semibold text-gray-900">
                          {gridCols}
                        </div>
                        <Button
                          type="button"
                          data-testid="button-increase-cols"
                          onClick={() => setGridCols(Math.min(20, gridCols + 1))}
                          disabled={autoDetectGrid || gridCols >= 20}
                          className="px-3 py-2 font-bold text-lg min-w-[44px]"
                          variant="outline"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">행 (Rows)</label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          data-testid="button-decrease-rows"
                          onClick={() => setGridRows(Math.max(1, gridRows - 1))}
                          disabled={autoDetectGrid || gridRows <= 1}
                          className="px-3 py-2 font-bold text-lg min-w-[44px]"
                          variant="outline"
                        >
                          −
                        </Button>
                        <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-center font-semibold text-gray-900">
                          {gridRows}
                        </div>
                        <Button
                          type="button"
                          data-testid="button-increase-rows"
                          onClick={() => setGridRows(Math.min(20, gridRows + 1))}
                          disabled={autoDetectGrid || gridRows >= 20}
                          className="px-3 py-2 font-bold text-lg min-w-[44px]"
                          variant="outline"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    이미지 크기: {image.width}×{image.height}px | 총 {gridCols}×{gridRows} = {gridCols * gridRows}개 스티커
                  </p>
                </div>

                <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={image.src} 
                    alt="Uploaded" 
                    className="w-full h-auto"
                    data-testid="img-uploaded-preview"
                  />
                </div>

                {(!fixedPlatform || fixedPlatform === 'kakao') && (
                  <Button
                    data-testid="button-crop-kakao"
                    onClick={cropKakaoStickers}
                    disabled={isProcessing}
                    className="w-full mt-2 py-4 px-6 font-semibold text-base min-h-[56px]"
                    style={{ backgroundColor: 'hsl(45, 93%, 58%)', color: '#1f2937' }}
                  >
                    <MessageCircle size={24} />
                    {isProcessing ? '처리 중...' : `${fixedPlatform ? '스티커 자르기' : '카카오톡'} (${gridCols}×${gridRows} = ${gridCols * gridRows}장)`}
                  </Button>
                )}

                {(!fixedPlatform || fixedPlatform === 'ogq') && (
                  <Button
                    data-testid="button-crop-ogq"
                    onClick={cropOGQStickers}
                    disabled={isProcessing}
                    className="w-full mt-2 py-4 px-6 font-semibold text-base min-h-[56px]"
                    style={{ backgroundColor: 'hsl(142, 71%, 45%)', color: 'white' }}
                  >
                    <MessageCircle size={24} />
                    {isProcessing ? '처리 중...' : `${fixedPlatform ? '스티커 자르기' : '네이버 OGQ'} (${gridCols}×${gridRows} = ${gridCols * gridRows}장)`}
                  </Button>
                )}

                {platform === 'kakao' && croppedImages.length > 0 && typeof currentSize === 'number' && (
                  <>
                    <div className="border-t-2 border-gray-200 my-4"></div>

                    <Button
                      data-testid="button-resize-360"
                      onClick={resizeTo360}
                      disabled={isProcessing}
                      className="w-full mt-2 py-4 px-6 font-semibold text-base min-h-[56px]"
                      style={{ backgroundColor: 'hsl(262, 52%, 47%)', color: 'white' }}
                    >
                      <ZoomOut size={24} />
                      {isProcessing ? '처리 중...' : '360×360으로 축소하기'}
                    </Button>
                  </>
                )}

                {platform === 'ogq' && croppedImages.length > 0 && (
                  <>
                    <div className="border-t-2 border-gray-200 my-4"></div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-2">
                      <h3 className="font-semibold text-blue-900 mb-3">OGQ 메인 이미지 (240×240)</h3>
                      <div className="flex gap-2 items-center">
                        <select
                          data-testid="select-main-sticker"
                          value={selectedMainIndex}
                          onChange={(e) => setSelectedMainIndex(parseInt(e.target.value))}
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          {croppedImages.map((_, index) => (
                            <option key={index} value={index}>
                              #{index + 1} 번 이미지
                            </option>
                          ))}
                        </select>
                        <Button
                          data-testid="button-create-main"
                          onClick={createOgqMainImage}
                          className="font-semibold py-2 px-4 whitespace-nowrap"
                          style={{ backgroundColor: 'hsl(217, 91%, 60%)', color: 'white' }}
                        >
                          생성
                        </Button>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 mb-2">
                      <h3 className="font-semibold text-green-900 mb-3">OGQ 탭 이미지 (96×74)</h3>
                      <div className="flex gap-2 items-center">
                        <select
                          data-testid="select-tab-sticker"
                          value={selectedTabIndex}
                          onChange={(e) => setSelectedTabIndex(parseInt(e.target.value))}
                          className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          {croppedImages.map((_, index) => (
                            <option key={index} value={index}>
                              #{index + 1} 번 이미지
                            </option>
                          ))}
                        </select>
                        <Button
                          data-testid="button-create-tab"
                          onClick={createOgqTabImage}
                          className="font-semibold py-2 px-4 whitespace-nowrap"
                          style={{ backgroundColor: 'hsl(142, 71%, 45%)', color: 'white' }}
                        >
                          생성
                        </Button>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 my-4"></div>

                    {currentSize === '740×640' ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                        <p className="text-green-800 font-semibold">✓ 이미 740×640 크기입니다</p>
                      </div>
                    ) : (
                      <Button
                        data-testid="button-convert-740x640"
                        onClick={convertToOGQSize}
                        disabled={isProcessing}
                        className="w-full mt-2 py-4 px-6 font-semibold text-base min-h-[56px]"
                        style={{ backgroundColor: 'hsl(24, 95%, 53%)', color: 'white' }}
                      >
                        <ZoomOut size={24} />
                        {isProcessing ? '처리 중...' : '740×640으로 변환하기'}
                      </Button>
                    )}
                  </>
                )}
              </>
            )}

          </Card>

          <Card className="rounded-2xl shadow-lg p-4 sm:p-6">
            {platform === 'ogq' && (ogqMainImage || ogqTabImage) && (
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  OGQ 메인/탭 이미지
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {ogqMainImage && (
                    <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
                      <div className="text-sm font-semibold text-blue-700 mb-2 text-center">
                        메인 (240×240) - #{selectedMainIndex + 1}
                      </div>
                      <img
                        src={ogqMainImage}
                        alt="OGQ Main"
                        className="w-full h-auto rounded mb-2"
                        data-testid="img-ogq-main"
                      />
                      <Button
                        data-testid="button-download-main"
                        onClick={handleDownloadOgqMain}
                        className="w-full py-2 px-3 text-sm"
                        style={{ backgroundColor: 'hsl(217, 91%, 60%)', color: 'white' }}
                      >
                        <Download size={14} />
                        다운로드
                      </Button>
                    </div>
                  )}
                  {ogqTabImage && (
                    <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50">
                      <div className="text-sm font-semibold text-green-700 mb-2 text-center">
                        탭 (96×74) - #{selectedTabIndex + 1}
                      </div>
                      <img
                        src={ogqTabImage}
                        alt="OGQ Tab"
                        className="w-full h-auto rounded mb-2"
                        data-testid="img-ogq-tab"
                      />
                      <Button
                        data-testid="button-download-tab"
                        onClick={handleDownloadOgqTab}
                        className="w-full py-2 px-3 text-sm"
                        style={{ backgroundColor: 'hsl(142, 71%, 45%)', color: 'white' }}
                      >
                        <Download size={14} />
                        다운로드
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-800">
                잘라낸 이미지 ({croppedImages.length})
                {croppedImages.length > 0 && (
                  <span className="text-sm font-normal text-purple-600 ml-2">
                    [{typeof currentSize === 'string' ? `${currentSize}px` : `${currentSize}×${currentSize}px`}]
                  </span>
                )}
              </h2>
              {croppedImages.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    data-testid="button-chat-preview"
                    onClick={() => setShowChatPreview(!showChatPreview)}
                    className="py-2 px-4 flex items-center gap-2"
                    style={{ backgroundColor: showChatPreview ? 'hsl(142, 71%, 45%)' : 'hsl(217, 91%, 60%)', color: 'white' }}
                  >
                    <MessageSquare size={18} />
                    <span>카카오톡 대화창 미리보기</span>
                    <ChevronDown 
                      size={18} 
                      className={`transform transition-transform duration-200 ${showChatPreview ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </Button>
                  <Button
                    data-testid="button-download-all"
                    onClick={downloadAll}
                    className="py-2 px-4"
                    style={{ backgroundColor: 'hsl(262, 52%, 47%)', color: 'white' }}
                  >
                    <Download size={18} />
                    전체 다운로드
                  </Button>
                </div>
              )}
            </div>

            {showChatPreview && croppedImages.length > 0 && (
              <div className="mb-6 p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800">카카오톡 대화창 미리보기</h3>
                </div>
                
                <div 
                  className="rounded-lg p-4 max-h-[500px] overflow-y-auto"
                  style={{ backgroundColor: '#9FBFD6' }}
                  data-testid="chat-preview-container"
                >
                  <div className="space-y-3">
                    {croppedImages.slice(0, 6).map((dataUrl, index) => (
                      <div key={index}>
                        {index % 2 === 0 ? (
                          <div className="flex justify-start">
                            <div className="max-w-xs">
                              <div className="text-xs text-gray-600 mb-1">친구</div>
                              <img 
                                src={dataUrl} 
                                alt={`Chat sticker ${index + 1}`}
                                className="w-28 h-28"
                                data-testid={`chat-sticker-${index}`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <div className="max-w-xs">
                              <div className="text-xs text-gray-600 mb-1 text-right">나</div>
                              <img 
                                src={dataUrl} 
                                alt={`Chat sticker ${index + 1}`}
                                className="w-28 h-28"
                                data-testid={`chat-sticker-${index}`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    {croppedImages.length > 6 ? `처음 6개 스티커만 미리보기로 표시됩니다 (총 ${croppedImages.length}개)` : `총 ${croppedImages.length}개 스티커`}
                  </p>
                </div>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={croppedImages.map((_, i) => `sticker-${i}`)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 gap-3 max-h-[600px] overflow-y-auto" data-testid="sticker-grid">
                  {croppedImages.map((dataUrl, index) => (
                    <SortableSticker
                      key={`sticker-${index}`}
                      id={`sticker-${index}`}
                      dataUrl={dataUrl}
                      index={index}
                      onDownload={() => downloadImage(dataUrl, index)}
                    />
                  ))}
                  {croppedImages.length === 0 && (
                    <div className="col-span-3 text-center text-gray-400 py-12">
                      <p className="font-semibold mb-2">잘라낸 이미지가 여기에 표시됩니다</p>
                      {(!fixedPlatform || fixedPlatform === 'kakao') && (
                        <p className="text-sm mt-3">🟡 카카오톡: 1000×1000 (32장) → 360×360 축소</p>
                      )}
                      {(!fixedPlatform || fixedPlatform === 'ogq') && (
                        <p className="text-sm mt-3">🟢 네이버 OGQ: 1000×1000 (32장) → 메인/탭 생성 → 740×640 변환</p>
                      )}
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </Card>
        </div>
        
        <footer className="mt-8 py-4 text-center text-xs text-gray-500 border-t">
          <p>
            © 2025 zziraengi. All rights reserved.
          </p>
        </footer>
        </div>
      </div>
      
      {/* AdMob 하단 배너 */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AdMobBanner 
          adId={ADMOB_CONFIG.BANNER_BOTTOM_ID} 
          position="bottom" 
          testMode={ADMOB_CONFIG.TEST_MODE}
        />
      </div>
    </div>
  );
}

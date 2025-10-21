import { useState, useRef } from 'react';
import { Upload, Download, MessageCircle, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function StickerCropTool() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [currentSize, setCurrentSize] = useState<number | string>(1000);
  const [platform, setPlatform] = useState<'kakao' | 'ogq' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ogqMainImage, setOgqMainImage] = useState<string | null>(null);
  const [ogqTabImage, setOgqTabImage] = useState<string | null>(null);
  const [selectedMainIndex, setSelectedMainIndex] = useState(0);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const stickerSize = 1000;
    const cols = 4;
    const rows = 8;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stickerSize;
        tempCanvas.height = stickerSize;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(
            image,
            col * stickerSize,
            row * stickerSize,
            stickerSize,
            stickerSize,
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
    setCurrentSize(1000);
    setPlatform('kakao');
    setIsProcessing(false);
  };

  const cropOGQStickers = () => {
    if (!image) return;
    
    setIsProcessing(true);
    const newCroppedImages: string[] = [];
    
    const stickerSize = 1000;
    const cols = 4;
    const rows = 8;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stickerSize;
        tempCanvas.height = stickerSize;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(
            image,
            col * stickerSize,
            row * stickerSize,
            stickerSize,
            stickerSize,
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
    setCurrentSize(1000);
    setPlatform('ogq');
    setIsProcessing(false);
  };

  const createOgqMainImage = () => {
    if (croppedImages.length === 0 || currentSize !== 1000) return;
    
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
    if (croppedImages.length === 0 || currentSize !== 1000) return;
    
    const selectedImage = croppedImages[selectedTabIndex];
    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 96;
      tempCanvas.height = 74;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        const sourceSize = 1000;
        const targetWidth = 96;
        const targetHeight = 74;
        
        const sourceAspect = sourceSize / sourceSize;
        const targetAspect = targetWidth / targetHeight;
        
        let sx = 0, sy = 0, sw = sourceSize, sh = sourceSize;
        
        if (sourceAspect > targetAspect) {
          sw = sourceSize * targetAspect;
          sx = (sourceSize - sw) / 2;
        } else {
          sh = sourceSize / targetAspect;
          sy = (sourceSize - sh) / 2;
        }
        
        tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      }
      
      const resizedDataUrl = tempCanvas.toDataURL('image/png');
      setOgqTabImage(resizedDataUrl);
    };
    img.src = selectedImage;
  };

  const convertToOGQSize = async () => {
    if (croppedImages.length === 0 || currentSize !== 1000) return;
    
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
    setCurrentSize('740x640');
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

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    let sizeLabel = '';
    if (currentSize === 360) {
      sizeLabel = '_360';
    } else if (currentSize === '740x640') {
      sizeLabel = '_ogq';
    }
    link.download = `sticker_${String(index + 1).padStart(2, '0')}${sizeLabel}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    croppedImages.forEach((dataUrl, index) => {
      setTimeout(() => downloadImage(dataUrl, index), index * 200);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            이모티콘 절단기
          </h1>
          <p className="text-gray-700 mb-2">
            이미지를 업로드하고 원하는 부분을 잘라서 이모티콘을 만드세요
          </p>
          <div className="text-sm font-semibold space-y-1">
            <p className="text-yellow-600">🟡 카카오톡: 1000×1000 (32장) → 360×360 축소</p>
            <p className="text-green-600">🟢 네이버 OGQ: 1000×1000 (32장) → 메인/탭 생성 → 740×640 변환</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-lg p-6">
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
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={image.src} 
                    alt="Uploaded" 
                    className="w-full h-auto"
                    data-testid="img-uploaded-preview"
                  />
                </div>

                <Button
                  data-testid="button-crop-kakao"
                  onClick={cropKakaoStickers}
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 px-6 font-semibold"
                  style={{ backgroundColor: 'hsl(45, 93%, 58%)', color: '#1f2937' }}
                >
                  <MessageCircle size={20} />
                  {isProcessing ? '처리 중...' : '카카오톡 (1000×1000 32장)'}
                </Button>

                <Button
                  data-testid="button-crop-ogq"
                  onClick={cropOGQStickers}
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 px-6 font-semibold"
                  style={{ backgroundColor: 'hsl(142, 71%, 45%)', color: 'white' }}
                >
                  <MessageCircle size={20} />
                  {isProcessing ? '처리 중...' : '네이버 OGQ (1000×1000 32장)'}
                </Button>

                {platform === 'kakao' && croppedImages.length > 0 && currentSize === 1000 && (
                  <>
                    <div className="border-t-2 border-gray-200 my-4"></div>

                    <Button
                      data-testid="button-resize-360"
                      onClick={resizeTo360}
                      disabled={isProcessing}
                      className="w-full mt-2 py-3 px-6 font-semibold"
                      style={{ backgroundColor: 'hsl(262, 52%, 47%)', color: 'white' }}
                    >
                      <ZoomOut size={20} />
                      {isProcessing ? '처리 중...' : '360×360으로 축소하기'}
                    </Button>
                  </>
                )}

                {platform === 'ogq' && croppedImages.length > 0 && currentSize === 1000 && (
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

                    <Button
                      data-testid="button-convert-740x640"
                      onClick={convertToOGQSize}
                      disabled={isProcessing}
                      className="w-full mt-2 py-3 px-6 font-semibold"
                      style={{ backgroundColor: 'hsl(24, 95%, 53%)', color: 'white' }}
                    >
                      <ZoomOut size={20} />
                      {isProcessing ? '처리 중...' : '740×640으로 변환하기'}
                    </Button>
                  </>
                )}
              </>
            )}

          </Card>

          <Card className="rounded-2xl shadow-lg p-6">
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
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = 'ogq_main_240x240.png';
                          link.href = ogqMainImage;
                          link.click();
                        }}
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
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = 'ogq_tab_96x74.png';
                          link.href = ogqTabImage;
                          link.click();
                        }}
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
                    [{currentSize === '740x640' ? '740×640px' : `${currentSize}×${currentSize}px`}]
                  </span>
                )}
              </h2>
              {croppedImages.length > 0 && (
                <Button
                  data-testid="button-download-all"
                  onClick={downloadAll}
                  className="py-2 px-4"
                  style={{ backgroundColor: 'hsl(262, 52%, 47%)', color: 'white' }}
                >
                  <Download size={18} />
                  전체 다운로드
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
              {croppedImages.map((dataUrl, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50 hover:shadow-md transition"
                  data-testid={`card-sticker-${index}`}
                >
                  <div className="text-xs text-gray-500 mb-1 text-center font-semibold">
                    #{index + 1}
                  </div>
                  <img
                    src={dataUrl}
                    alt={`Cropped ${index + 1}`}
                    className="w-full h-auto rounded"
                    data-testid={`img-sticker-${index}`}
                  />
                  <Button
                    data-testid={`button-download-${index}`}
                    onClick={() => downloadImage(dataUrl, index)}
                    className="w-full mt-2 py-1 px-2 text-xs"
                    style={{ backgroundColor: 'hsl(217, 91%, 60%)', color: 'white' }}
                  >
                    <Download size={12} />
                    다운로드
                  </Button>
                </div>
              ))}
              {croppedImages.length === 0 && (
                <div className="col-span-3 text-center text-gray-400 py-12">
                  <p className="font-semibold mb-2">잘라낸 이미지가 여기에 표시됩니다</p>
                  <p className="text-sm mt-3">🟡 카카오톡: 1000×1000 (32장) → 360×360 축소</p>
                  <p className="text-sm">🟢 네이버 OGQ: 1000×1000 (32장) → 메인/탭 생성 → 740×640 변환</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

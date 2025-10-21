import React, { useState, useRef } from 'react';
import { Upload, Download, MessageCircle, ZoomOut } from 'lucide-react';

export default function StickerCropTool() {
  const [image, setImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [currentSize, setCurrentSize] = useState(1000);
  const [platform, setPlatform] = useState(null); // 'kakao' or 'ogq'
  const [isProcessing, setIsProcessing] = useState(false);
  const [ogqMainImage, setOgqMainImage] = useState(null);
  const [ogqTabImage, setOgqTabImage] = useState(null);
  const [selectedMainIndex, setSelectedMainIndex] = useState(0);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const cropKakaoStickers = () => {
    if (!image) return;
    
    setIsProcessing(true);
    const newCroppedImages = [];
    
    const stickerSize = 1000;
    const cols = 4;
    const rows = 8;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stickerSize;
        tempCanvas.height = stickerSize;
        const tempCtx = tempCanvas.getContext('2d');
        
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
    const newCroppedImages = [];
    
    const stickerSize = 1000;
    const cols = 4;
    const rows = 8;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stickerSize;
        tempCanvas.height = stickerSize;
        const tempCtx = tempCanvas.getContext('2d');
        
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
      
      tempCtx.drawImage(img, 0, 0, 240, 240);
      
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
      
      // 1000x1000을 96x74로 축소하되, 비율 맞추기
      const sourceSize = 1000;
      const targetWidth = 96;
      const targetHeight = 74;
      
      // 중앙 크롭을 위한 계산
      const sourceAspect = sourceSize / sourceSize;
      const targetAspect = targetWidth / targetHeight;
      
      let sx = 0, sy = 0, sw = sourceSize, sh = sourceSize;
      
      if (sourceAspect > targetAspect) {
        // 가로가 더 길면 좌우 자르기
        sw = sourceSize * targetAspect;
        sx = (sourceSize - sw) / 2;
      } else {
        // 세로가 더 길면 상하 자르기
        sh = sourceSize / targetAspect;
        sy = (sourceSize - sh) / 2;
      }
      
      tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      
      const resizedDataUrl = tempCanvas.toDataURL('image/png');
      setOgqTabImage(resizedDataUrl);
    };
    img.src = selectedImage;
  };

  const convertToOGQSize = () => {
    if (croppedImages.length === 0 || currentSize !== 1000) return;
    
    setIsProcessing(true);
    const convertedImages = [];
    
    const ogqWidth = 740;
    const ogqHeight = 640;
    const sourceSize = 1000;
    const cropX = (sourceSize - ogqWidth) / 2;
    const cropY = (sourceSize - ogqHeight) / 2;
    
    croppedImages.forEach((dataUrl) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = ogqWidth;
        tempCanvas.height = ogqHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(
          img,
          cropX,
          cropY,
          ogqWidth,
          ogqHeight,
          0,
          0,
          ogqWidth,
          ogqHeight
        );
        
        const convertedDataUrl = tempCanvas.toDataURL('image/png');
        convertedImages.push(convertedDataUrl);
        
        if (convertedImages.length === croppedImages.length) {
          setCroppedImages(convertedImages);
          setCurrentSize('740x640');
          setIsProcessing(false);
        }
      };
      img.src = dataUrl;
    });
  };

  const resizeTo360 = () => {
    if (croppedImages.length === 0) return;
    
    setIsProcessing(true);
    const resizedImages = [];
    
    croppedImages.forEach((dataUrl) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 360;
        tempCanvas.height = 360;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(img, 0, 0, 360, 360);
        
        const resizedDataUrl = tempCanvas.toDataURL('image/png');
        resizedImages.push(resizedDataUrl);
        
        if (resizedImages.length === croppedImages.length) {
          setCroppedImages(resizedImages);
          setCurrentSize(360);
          setIsProcessing(false);
        }
      };
      img.src = dataUrl;
    });
  };

  const downloadImage = (dataUrl, index) => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            이모티콘 절단기
          </h1>
          <p className="text-gray-600">
            이미지를 업로드하고 원하는 부분을 잘라서 이모티콘을 만드세요<br/>
            <span className="text-sm font-semibold">
              <span className="text-yellow-600">🟡 카카오톡: 1000×1000 (32장) → 360×360 축소</span>
              {' | '}
              <span className="text-green-600">🟢 네이버 OGQ: 1000×1000 (32장) → 메인/탭 생성 → 740×640 변환</span>
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Upload size={20} />
                이미지 업로드
              </button>
            </div>

            {image && (
              <>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={image.src} 
                    alt="Uploaded" 
                    className="w-full h-auto"
                  />
                </div>

                <button
                  onClick={cropKakaoStickers}
                  disabled={isProcessing}
                  className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={20} />
                  {isProcessing ? '처리 중...' : '카카오톡 (1000×1000 32장)'}
                </button>

                <button
                  onClick={cropOGQStickers}
                  disabled={isProcessing}
                  className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={20} />
                  {isProcessing ? '처리 중...' : '네이버 OGQ (1000×1000 32장)'}
                </button>

                {platform === 'kakao' && croppedImages.length > 0 && currentSize === 1000 && (
                  <>
                    <div className="border-t-2 border-gray-200 my-4"></div>

                    <button
                      onClick={resizeTo360}
                      disabled={isProcessing}
                      className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ZoomOut size={20} />
                      {isProcessing ? '처리 중...' : '360×360으로 축소하기'}
                    </button>
                  </>
                )}

                {platform === 'ogq' && croppedImages.length > 0 && currentSize === 1000 && (
                  <>
                    <div className="border-t-2 border-gray-200 my-4"></div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-2">
                      <h3 className="font-semibold text-blue-900 mb-3">OGQ 메인 이미지 (240×240)</h3>
                      <div className="flex gap-2 items-center">
                        <select
                          value={selectedMainIndex}
                          onChange={(e) => setSelectedMainIndex(parseInt(e.target.value))}
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {croppedImages.map((_, index) => (
                            <option key={index} value={index}>
                              #{index + 1} 번 이미지
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={createOgqMainImage}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition whitespace-nowrap"
                        >
                          생성
                        </button>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 mb-2">
                      <h3 className="font-semibold text-green-900 mb-3">OGQ 탭 이미지 (96×74)</h3>
                      <div className="flex gap-2 items-center">
                        <select
                          value={selectedTabIndex}
                          onChange={(e) => setSelectedTabIndex(parseInt(e.target.value))}
                          className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {croppedImages.map((_, index) => (
                            <option key={index} value={index}>
                              #{index + 1} 번 이미지
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={createOgqTabImage}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition whitespace-nowrap"
                        >
                          생성
                        </button>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 my-4"></div>

                    <button
                      onClick={convertToOGQSize}
                      disabled={isProcessing}
                      className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ZoomOut size={20} />
                      {isProcessing ? '처리 중...' : '740×640으로 변환하기'}
                    </button>
                  </>
                )}
              </>
            )}

            {!image && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p>이미지를 업로드하여 시작하세요</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
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
                      />
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = 'ogq_main_240x240.png';
                          link.href = ogqMainImage;
                          link.click();
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition"
                      >
                        <Download size={14} />
                        다운로드
                      </button>
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
                      />
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = 'ogq_tab_96x74.png';
                          link.href = ogqTabImage;
                          link.click();
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition"
                      >
                        <Download size={14} />
                        다운로드
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                잘라낸 이미지 ({croppedImages.length})
                {croppedImages.length > 0 && (
                  <span className="text-sm font-normal text-purple-600 ml-2">
                    [{currentSize === '740x640' ? '740×640px' : `${currentSize}×${currentSize}px`}]
                  </span>
                )}
              </h2>
              {croppedImages.length > 0 && (
                <button
                  onClick={downloadAll}
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition"
                >
                  <Download size={18} />
                  전체 다운로드
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
              {croppedImages.map((dataUrl, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="text-xs text-gray-500 mb-1 text-center font-semibold">
                    #{index + 1}
                  </div>
                  <img
                    src={dataUrl}
                    alt={`Cropped ${index + 1}`}
                    className="w-full h-auto rounded"
                  />
                  <button
                    onClick={() => downloadImage(dataUrl, index)}
                    className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Download size={12} />
                    다운로드
                  </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
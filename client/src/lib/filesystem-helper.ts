import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export async function downloadImageNative(dataUrl: string, filename: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return;
  }

  try {
    // iOS/Android 네이티브: Share API 사용
    const base64Data = dataUrl.split(',')[1];
    
    // Capacitor 3.0+에서는 Share.share()에 파일을 직접 전달
    await Share.share({
      title: filename,
      text: filename,
      url: dataUrl,
      dialogTitle: '이미지 저장',
    });
    
    console.log('Share sheet opened for:', filename);
  } catch (error) {
    console.error('Share error:', error);
    throw error; // 에러를 상위로 전파하여 toast 메시지 표시
  }
}

export async function downloadZipNative(blob: Blob, filename: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  try {
    // Blob을 base64 data URL로 변환
    const reader = new FileReader();
    
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('Failed to read blob'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // iOS/Android 네이티브: Share API 사용
    await Share.share({
      title: filename,
      text: filename,
      url: dataUrl,
      dialogTitle: 'ZIP 파일 저장',
    });
    
    console.log('Share sheet opened for:', filename);
  } catch (error) {
    console.error('ZIP share error:', error);
    throw error; // 에러를 상위로 전파하여 toast 메시지 표시
  }
}

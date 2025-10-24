import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera } from '@capacitor/camera';
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
    const base64Data = dataUrl.split(',')[1];
    
    await Camera.checkPermissions();
    const permissionStatus = await Camera.requestPermissions({ permissions: ['photos'] });
    
    if (permissionStatus.photos === 'denied') {
      alert('사진 라이브러리 접근 권한이 필요합니다');
      return;
    }
    
    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    });
    
    const savedFile = await Filesystem.readFile({
      path: filename,
      directory: Directory.Cache,
    });
    
    await Share.share({
      title: '스티커 저장',
      text: filename,
      url: result.uri,
      dialogTitle: '스티커 공유 또는 저장',
    });
    
  } catch (error) {
    console.error('File save error:', error);
    alert('저장 실패');
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
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    
    await new Promise<void>((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          const result = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.Cache,
          });

          await Share.share({
            title: 'ZIP 파일 저장',
            text: filename,
            url: result.uri,
            dialogTitle: 'ZIP 파일 공유 또는 저장',
          });
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
    });
  } catch (error) {
    console.error('ZIP save error:', error);
    alert('ZIP 저장 실패');
  }
}
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

export async function downloadImageNative(dataUrl: string, filename: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    // 웹/맥: 기본 브라우저 다운로드
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return;
  }

  try {
    // iOS/Android: 임시 파일 생성 후 Share API로 공유
    const base64Data = dataUrl.split(',')[1];
    
    // 1. 임시 파일 저장 (encoding 생략 시 기본적으로 base64로 처리됨)
    await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    });
    
    // 2. 저장된 파일의 전체 URI 가져오기
    const fileUri = await Filesystem.getUri({
      path: filename,
      directory: Directory.Cache,
    });
    
    console.log('File saved to:', fileUri.uri);
    
    // 3. Share API로 파일 공유 (files 파라미터 사용)
    // 공유 시트가 뜨고 사용자가 저장 위치 선택 가능
    await Share.share({
      title: '스티커 저장',
      text: filename,
      files: [fileUri.uri],
      dialogTitle: '이미지 저장',
    });
    
    console.log('Share sheet opened for:', filename);
  } catch (error) {
    console.error('Share error:', error);
    throw error;
  }
}

export async function downloadZipNative(blob: Blob, filename: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    // 웹/맥: 기본 브라우저 다운로드
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  try {
    // Blob을 base64로 변환
    const reader = new FileReader();
    
    const base64Data = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.result) {
          // data:application/zip;base64, 부분 제거
          const result = (reader.result as string).split(',')[1];
          resolve(result);
        } else {
          reject(new Error('Failed to read blob'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 1. iOS/Android: 임시 파일 생성
    // encoding 생략 시 기본적으로 base64로 처리됨
    await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    });
    
    // 2. 저장된 파일의 전체 URI 가져오기
    const fileUri = await Filesystem.getUri({
      path: filename,
      directory: Directory.Cache,
    });
    
    console.log('ZIP file saved to:', fileUri.uri);
    
    // 3. Share API로 파일 공유 (files 파라미터 사용)
    await Share.share({
      title: '스티커 묶음 저장',
      text: filename,
      files: [fileUri.uri],
      dialogTitle: 'ZIP 파일 저장',
    });
    
    console.log('Share sheet opened for ZIP:', filename);
  } catch (error) {
    console.error('ZIP share error:', error);
    throw error;
  }
}

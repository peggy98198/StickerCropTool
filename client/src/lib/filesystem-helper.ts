import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
    
    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Documents,
    });

    console.log('File saved to:', result.uri);
    alert(`저장 완료: ${filename}`);
  } catch (error) {
    console.error('File save error:', error);
    alert('파일 저장 실패');
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
            directory: Directory.Documents,
          });

          console.log('ZIP file saved to:', result.uri);
          alert(`ZIP 파일 저장 완료: ${filename}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
    });
  } catch (error) {
    console.error('ZIP save error:', error);
    alert('ZIP 파일 저장 실패');
  }
}

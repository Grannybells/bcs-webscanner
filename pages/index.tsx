import React, { useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    (async () => {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (selectedDeviceId && videoRef.current) {
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error, controls) => {
              if (result) {
                console.log('Scanned result:', result.getText());
              }
              // No need to handle "error" unless for debug
            }
          );
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    })();

    return () => {
      // Stop the video stream properly
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return <video ref={videoRef} style={{ width: 200 , height:200}} />;
}

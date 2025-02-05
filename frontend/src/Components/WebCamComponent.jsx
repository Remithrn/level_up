import React from 'react'
import Webcam from 'react-webcam';
import { BsWebcam } from 'react-icons/bs';
import { Button } from '@nextui-org/react';
const WebCamComponent = ({ webcamEnabled, setWebcamEnabled,webcamSize,handleDisableWebcam,handleEnableWebcam }) => {

  return (
    <div className="p-4 flex flex-col items-center">
      
      {webcamEnabled ? (
        <div className="flex flex-col items-center">
          <div>
          <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
  <p class="font-bold">Alert</p>
  <p>Webcam is turned on for your convenience. This is not being recorded and is just for you to monitor your speaking..</p>
</div>
          
          </div>
          <div
            className="flex flex-col items-center space-y-4 bg-gray-200 p-6 rounded-lg shadow-md"
            style={{ width: webcamSize, height: webcamSize }}
          >
            <Webcam
              mirrored={true}
              className="rounded-lg border-4 border-blue-500"
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              style={{ width: '100%', height: '100%' }}
            />
            <Button onClick={handleDisableWebcam} color="danger" className="w-full">
              Disable Webcam
            </Button>
          </div>
        </div>
    ) : (
      <div
        className="flex flex-col items-center justify-center space-y-4 bg-slate-300 p-4 rounded-lg"
        style={{ width: webcamSize, height: webcamSize }}
      >
        <BsWebcam size={96} className="text-black" />
        <Button onClick={handleEnableWebcam} color="primary">
          Enable Webcam and Microphone
        </Button>
      </div>
    )}
    
  </div>
  )
}

export default WebCamComponent
"use client";

import { useState } from "react";

import {
  Cam,
  Microphone,
  OffCam,
  OffMicrophone,
  OffScreen,
  Phone,
  Screen,
} from "@/Icons";
import Container from "./Container";

export default function Footer() {
  const [isMuted, setIsMuted] = useState(true);
  const [isCamOff, setIsCamOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <div className="fixed bottom-0 bg-black py-6 w-full">
      <Container>
        <div className="grid grid-cols-3 items-center">
          <span className="text-xl">{hours + ":" + minutes}</span>

          <div className="flex space-x-4 justify-center">
            {isMuted ? (
              <OffMicrophone
                className="h-12 w-14 text-white p-2 bg-gray rounded-md cursor-pointer"
                onClick={() => setIsMuted(false)}
              />
            ) : (
              <Microphone
                className="h-12 w-14 text-white p-2 bg-cyan rounded-md cursor-pointer"
                onClick={() => setIsMuted(true)}
              />
            )}

            {isCamOff ? (
              <OffCam
                className="h-12 w-14 text-white p-2 bg-gray rounded-md cursor-pointer"
                onClick={() => setIsCamOff(false)}
              />
            ) : (
              <Cam
                className="h-12 w-14 text-white p-2 bg-cyan rounded-md cursor-pointer"
                onClick={() => setIsCamOff(true)}
              />
            )}

            {!isScreenSharing ? (
              <OffScreen
                className="h-12 w-14 text-white p-2 bg-gray rounded-md cursor-pointer"
                onClick={() => setIsScreenSharing(true)}
              />
            ) : (
              <Screen
                className="h-12 w-14 text-white p-2 bg-cyan rounded-md cursor-pointer"
                onClick={() => setIsScreenSharing(false)}
              />
            )}

            <Phone className="h-12 w-14 text-white p-2 bg-red-500  hover:bg-red-700 rounded-md cursor-pointer" />
          </div>
        </div>
      </Container>
    </div>
  );
}

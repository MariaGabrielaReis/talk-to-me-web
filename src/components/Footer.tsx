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

type FooterProps = {
  userCam: HTMLVideoElement | null;
  localStream: MediaStream | null;
  peerConnections: Record<string, RTCPeerConnection>;
};

export default function Footer({
  userCam,
  localStream,
  peerConnections,
}: FooterProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  function toggleMuted() {
    localStream?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);

    Object.values(peerConnections).forEach(peerConnection => {
      peerConnection.getSenders().forEach(sender => {
        if (sender.track?.kind === "audio") {
          sender.replaceTrack(
            localStream
              ?.getAudioTracks()
              .find(track => track.kind === "audio") ?? null,
          );
        }
      });
    });
  }

  function toggleVideo() {
    localStream?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsCamOff(!isCamOff);

    Object.values(peerConnections).forEach(peerConnection => {
      peerConnection.getSenders().forEach(sender => {
        if (sender.track?.kind === "video") {
          sender.replaceTrack(
            localStream
              ?.getVideoTracks()
              .find(track => track.kind === "video") ?? null,
          );
        }
      });
    });
  }

  async function toggleShareScreen() {
    setIsScreenSharing(!isScreenSharing);

    if (!isScreenSharing) {
      const videoShareScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (userCam) userCam.srcObject = videoShareScreen;

      Object.values(peerConnections).forEach(peerConnection => {
        peerConnection.getSenders().forEach(sender => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(videoShareScreen?.getVideoTracks()[0] ?? null);
          }
        });
      });
    } else {
      Object.values(peerConnections).forEach(peerConnection => {
        peerConnection.getSenders().forEach(sender => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(localStream?.getVideoTracks()[0] ?? null);
          }
        });
      });
      if (userCam) userCam.srcObject = localStream;
    }
  }

  return (
    <div className="fixed bottom-0 bg-black py-6 w-full">
      <Container>
        <div className="grid grid-cols-3 items-center">
          <span className="text-xl">{hours + ":" + minutes}</span>

          <div className="flex space-x-4 justify-center">
            {isMuted ? (
              <OffMicrophone
                className="h-12 w-14 text-white p-2 bg-gray rounded-md cursor-pointer"
                onClick={toggleMuted}
              />
            ) : (
              <Microphone
                className="h-12 w-14 text-white p-2 bg-cyan rounded-md cursor-pointer"
                onClick={toggleMuted}
              />
            )}

            {isCamOff ? (
              <OffCam
                className="h-12 w-14 text-white p-2 bg-gray rounded-md cursor-pointer"
                onClick={toggleVideo}
              />
            ) : (
              <Cam
                className="h-12 w-14 text-white p-2 bg-cyan rounded-md cursor-pointer"
                onClick={toggleVideo}
              />
            )}

            {!isScreenSharing ? (
              <OffScreen
                className="h-12 w-14 text-white p-2 bg-gray rounded-md cursor-pointer"
                onClick={toggleShareScreen}
              />
            ) : (
              <Screen
                className="h-12 w-14 text-white p-2 bg-cyan rounded-md cursor-pointer"
                onClick={toggleShareScreen}
              />
            )}

            <Phone className="h-12 w-14 text-white p-2 bg-red-500  hover:bg-red-700 rounded-md cursor-pointer" />
          </div>
        </div>
      </Container>
    </div>
  );
}

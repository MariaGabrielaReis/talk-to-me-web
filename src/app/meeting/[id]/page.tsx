"use client";

import { useEffect, useRef } from "react";

import { useSocketContext } from "../../../contexts/SocketContext";

import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

type AnswerProps = { description: RTCSessionDescription; sender: string };

export default function Meeting({ params }: { params: { id: string } }) {
  const { socket } = useSocketContext();

  const userCam = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    socket?.on("connect", async () => {
      socket?.emit("subscribe", { meetingId: params.id, socketId: socket.id });
      await initCamera();
    });

    // create user
    socket?.on("new user", data => {
      createPeerConnection(data.socketId);
      socket.emit("new user connected", {
        to: data.socketId,
        sender: socket.id,
      });
    });

    // user connected to meeting
    socket?.on("new user connected", data =>
      createPeerConnection(data.sender, true),
    );

    // user send or receive an offer to participate
    socket?.on("sdp", data => handleAnswer(data));
  }, [socket]);

  async function createPeerConnection(socketId: string, createOffer?: boolean) {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:1902" }] };
    const peer = new RTCPeerConnection(config);
    peerConnections.current[socketId] = peer;

    if (createOffer) {
      const peerConnection = peerConnections.current[socketId];
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // send offer to participate
      socket?.emit("sdp", {
        to: socketId,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    }
  }

  async function handleAnswer(data: AnswerProps) {
    const peerConnection = peerConnections.current[data.sender];

    // receive offer to participate
    if (data.description.type === "offer") {
      await peerConnection.setRemoteDescription(data.description);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket?.emit("sdp", {
        to: data.sender,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    }

    // accept offer to participate
    if (data.description.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.description),
      );
    }
  }

  async function initCamera() {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { noiseSuppression: true, echoCancellation: true },
    });
    if (userCam.current) userCam.current.srcObject = video;
  }

  return (
    <div className="h-screen">
      <Header />

      <div className="flex h-[75%] w-full max-w-[1400px] px-8 m-auto">
        <div className="h-full w-full m-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative bg-gray w-full rounded-md p-2">
            <video
              className="h-full w-full -scale-x-100"
              ref={userCam}
              autoPlay
              playsInline
            />
            <span className="absolute bottom-2">Maby Reis</span>
          </div>

          <div className="relative bg-gray w-full rounded-md p-2">
            <video className="h-full w-full"></video>
            <span className="absolute bottom-2">Wallace Felipe</span>
          </div>

          <div className="relative bg-gray w-full rounded-md p-2">
            <video className="h-full w-full"></video>
            <span className="absolute bottom-2">Marcia Cristina</span>
          </div>

          <div className="relative bg-gray w-full rounded-md p-2">
            <video className="h-full w-full"></video>
            <span className="absolute bottom-2">Renato Garcia</span>
          </div>
        </div>

        <Chat meetingId={params.id} />
      </div>
      <Footer />
    </div>
  );
}

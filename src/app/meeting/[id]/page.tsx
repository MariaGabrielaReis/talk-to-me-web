"use client";

import { useEffect, useRef, useState } from "react";

import { useSocketContext } from "../../../contexts/SocketContext";

import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

type AnswerProps = { description: RTCSessionDescription; sender: string };

type IceCandidateProps = { candidate: RTCIceCandidate; sender: string };

type DataStreamProps = {
  id: string;
  stream: MediaStream;
  username: string;
};

export default function Meeting({ params }: { params: { id: string } }) {
  const { socket } = useSocketContext();

  const userCam = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const [remoteStreams, setRemoteStreams] = useState<DataStreamProps[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    socket?.on("connect", async () => {
      socket?.emit("subscribe", {
        meetingId: params.id,
        socketId: socket.id,
        username: sessionStorage.getItem("@talktome:username"),
      });
      await initLocalCamera();
    });

    // create user
    socket?.on("new user", data => {
      createPeerConnection(data.socketId, false, data.username);
      socket.emit("new user connected", {
        to: data.socketId,
        sender: socket.id,
        username: data.username,
      });
    });

    // user connected to meeting
    socket?.on("new user connected", data =>
      createPeerConnection(data.sender, true),
    );

    // user send or receive an offer to participate
    socket?.on("sdp", data => handleAnswer(data));

    // user send or receive an offer to participate
    socket?.on("ice candidates", data => handleIceCandidates(data));
  }, [socket]);

  async function createPeerConnection(
    socketId: string,
    createOffer?: boolean,
    username?: string,
  ) {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:1902" }] };
    const peer = new RTCPeerConnection(config);
    peerConnections.current[socketId] = peer;

    const peerConnection = peerConnections.current[socketId];

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    } else {
      const video = await initRemoteCamera();
      video.getTracks().forEach(track => {
        peerConnection.addTrack(track, video);
      });
    }

    if (createOffer) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // send offer to participate
      socket?.emit("sdp", {
        to: socketId,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    }

    peerConnection.ontrack = event => {
      const remoteStream = event.streams[0];
      const dataStream = {
        id: socketId,
        stream: remoteStream,
        username: username ?? "",
      };
      setRemoteStreams(prev => {
        return !prev.some(stream => stream.id === socketId)
          ? [...prev, dataStream]
          : prev;
      });
    };

    // add "ice server"
    peer.onicecandidate = event => {
      if (event.candidate) {
        socket?.emit("ice candidates", {
          to: socketId,
          sender: socket.id,
          candidate: event.candidate,
        });
      }
    };

    // disconnect when connection is closed
    peer.onsignalingstatechange = event => {
      if (peerConnection.signalingState === "closed")
        setRemoteStreams(prev => prev.filter(stream => stream.id !== socketId));
    };

    // disconnect when connection is closed
    peerConnection.onconnectionstatechange = event => {
      const statuses = ["closed", "disconnected", "failed"];
      if (statuses.includes(peerConnection.connectionState))
        setRemoteStreams(prev => prev.filter(stream => stream.id !== socketId));
    };
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

  async function handleIceCandidates(data: IceCandidateProps) {
    const peerConnection = peerConnections.current[data.sender];
    if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  async function initLocalCamera() {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { noiseSuppression: true, echoCancellation: true },
    });
    setLocalStream(video);
    if (userCam.current) userCam.current.srcObject = video;
  }

  async function initRemoteCamera() {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { noiseSuppression: true, echoCancellation: true },
    });
    return video;
  }

  function logout() {
    localStream?.getTracks().forEach(track => track.stop());
    Object.values(peerConnections.current).forEach(peerConnection =>
      peerConnection.close(),
    );
    socket?.disconnect();
    window.location.href = `/`;
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
            <span className="absolute bottom-2">
              {sessionStorage.getItem("@talktome:username")}
            </span>
          </div>

          {remoteStreams.map((remoteStream, index) => {
            return (
              <div
                key={index}
                className="relative bg-gray w-full rounded-md p-2"
              >
                <video
                  className="h-full w-full"
                  autoPlay
                  ref={video => {
                    if (video && video.srcObject !== remoteStream.stream)
                      video.srcObject = remoteStream.stream;
                  }}
                ></video>
                <span className="absolute bottom-2">
                  {remoteStream.username}
                </span>
              </div>
            );
          })}
        </div>

        <Chat meetingId={params.id} />
      </div>

      <Footer
        userCam={userCam.current}
        localStream={localStream}
        peerConnections={peerConnections.current}
        logout={logout}
      />
    </div>
  );
}

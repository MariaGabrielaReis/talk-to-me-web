"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

import { useSocketContext } from "@/contexts/SocketContext";
import { getHours } from "@/utils/getHours";

type ChatMessage = {
  text: string;
  username: string;
  meetingId: string;
  time: string;
};

export default function Chat({ meetingId }: { meetingId: string }) {
  const { socket } = useSocketContext();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const currentMessage = useRef<HTMLInputElement>(null);
  const myUsername = sessionStorage.getItem("@talktome:username");

  useEffect(() => {
    socket?.on("chat", data => setChatMessages(prev => [...prev, data]));
  }, [socket]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentMessage.current?.value) {
      const messageData = {
        text: currentMessage.current.value,
        username: myUsername ?? "",
        meetingId,
        time: getHours(),
      };

      socket?.emit("chat", messageData);
      setChatMessages(prev => [...prev, messageData]);
      currentMessage.current.value = "";
    }
  }

  return (
    <div className="h-full bg-dark-gray px-4 pt-4 w-[30%] rounded-md m-3 hidden md:flex">
      <div className="relative h-full w-full space-y-2">
        {chatMessages.map((message, index) => (
          <div key={index} className="bg-gray rounded-sm p-2">
            <div
              className={`flex items-center ${
                myUsername === message.username ? "text-cyan" : "text-blue-400"
              }  space-x-2`}
            >
              <span className="text-sm">{message.time}</span>
              <span className="font-bold">{message.username}</span>
            </div>
            <p>{message.text}</p>
          </div>
        ))}

        <form onSubmit={sendMessage} className="absolute bottom-2 w-full">
          <div className="flex relative">
            <input
              ref={currentMessage}
              className="px-3 py-2 bg-gray rounded-md w-full"
            />

            <button type="submit">
              <Image
                className="absolute right-2 top-2.5 cursor-pointer"
                alt="Enviar"
                src="/send.png"
                width={20}
                height={20}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

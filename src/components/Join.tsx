"use client";

import { FormEvent, useRef } from "react";

import Button from "./Button";
import { Input } from "./Input";

export default function Join() {
  const name = useRef<HTMLInputElement>(null);
  const meetingId = useRef<HTMLInputElement>(null);

  function handleJoinMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.current?.value && meetingId.current?.value) {
      sessionStorage.setItem("@talktome:username", name.current.value);
      window.location.href = `/meeting/${meetingId.current.value}`;
    }
  }

  return (
    <form onSubmit={handleJoinMeeting} className="space-y-6">
      <Input type="text" placeholder="Seu nome" ref={name} />
      <Input type="text" placeholder="ID da reunião" ref={meetingId} />
      <Button type="submit" title="Entrar" />
    </form>
  );
}

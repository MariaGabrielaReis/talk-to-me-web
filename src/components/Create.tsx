"use client";

import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";

import Button from "./Button";
import { Input } from "./Input";

export default function Create() {
  const name = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleCreateMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.current?.value) {
      sessionStorage.setItem("username", name.current.value);
      router.push(`/meeting/${generateRandomId()}`);
    }
  }

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 7);
  }

  return (
    <form onSubmit={handleCreateMeeting} className="space-y-6">
      <Input type="text" placeholder="Seu nome" ref={name} />
      <Button type="submit" title="Criar" />
    </form>
  );
}

"use client";

import { useRef } from "react";
import Button from "./Button";
import { Input } from "./Input";

export default function Join() {
  const name = useRef<HTMLInputElement>(null);
  const meetingId = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input type="text" placeholder="Seu nome" ref={name} />
      <Input type="text" placeholder="ID da reunião" ref={meetingId} />
      <Button title="Entrar" />
    </>
  );
}

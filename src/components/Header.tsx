import Image from "next/image";
import Container from "./Container";

export default function Header() {
  return (
    <div className=" bg-dark-gray px-8 py-4">
      <Container>
        <Image alt="Talk to Me!" src="/logo.svg" height={100} width={160} />
      </Container>
    </div>
  );
}

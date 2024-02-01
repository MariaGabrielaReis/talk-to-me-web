import Image from "next/image";

export default function Chat() {
  return (
    <div className="h-full bg-dark-gray px-4 pt-4 w-[30%] rounded-md m-3 hidden md:flex">
      <div className="relative h-full w-full">
        <div className="bg-gray rounded-sm p-2">
          <div className="flex items-center text-cyan space-x-2">
            <span className="text-sm">18:45</span>
            <span className="font-bold">name</span>
          </div>

          <p>text</p>
        </div>

        <form action="" className="absolute bottom-2 w-full">
          <div className="flex relative">
            <input className="px-3 py-2 bg-gray rounded-md w-full" />

            <Image
              className="absolute right-2 top-2.5 cursor-pointer"
              alt="Enviar"
              src="/send.png"
              width={20}
              height={20}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

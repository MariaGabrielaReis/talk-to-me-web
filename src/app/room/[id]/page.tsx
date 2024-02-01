import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Room({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen">
      <Header />

      <div className="flex h-[75%] w-full max-w-[1400px] px-8 m-auto">
        <div className="h-full w-full m-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative bg-gray w-full rounded-md p-2">
            <video className="h-full w-full"></video>
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

        <Chat />
      </div>
      <Footer />
    </div>
  );
}

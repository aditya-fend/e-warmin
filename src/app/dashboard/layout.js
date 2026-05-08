import Navbar from "@/components/Navbar";

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR UTAMA */}
      <Navbar />

      {/* AREA KONTEN */}
      <main className="flex-1 max-w-screen-xl w-full mx-auto border-x-2 border-black border-opacity-5">
        {children}
      </main>
    </div>
  );
}

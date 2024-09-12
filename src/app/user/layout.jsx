"use client";
import { Dock, DockIcon } from "@/components/magicui/dock"; // Named import
import { Separator } from "@/components/ui/separator";
import { AiOutlineSchedule } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

export default function UserLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-gradient-to-b from-[#FBEC5D] to-[#FFFFFF]">
      {/* Custom top navigation */}
      <Dock
        magnification={75}
        distance={100}
        direction="middle"
        className="fixed left-1/2 transform -translate-x-1/2 bg-transparent backdrop-blur-md border border-white/20 shadow-xl rounded-xl overflow-hidden z-40"
      >
        {/* Profile icon with routing to /user */}
        <DockIcon route="/user">
          <CgProfile className="text-3xl" />
        </DockIcon>

        <Separator orientation="vertical" className="h-full" />

        {/* Schedule icon with routing to /user/schedule */}
        <DockIcon route="/user/schedule">
          <AiOutlineSchedule className="text-3xl" />
        </DockIcon>
      </Dock>

      <main className="flex-1 overflow-auto mt-20">{children}</main>
    </div>
  );
}

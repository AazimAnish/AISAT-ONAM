import React from 'react';
import { Dock, DockIcon } from "@/components/magicui/dock";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSchedule } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";

export default function UserLayout({ children }) {
    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            <main className="flex-1 overflow-auto">
                {children}
            </main>
            <Dock
                magnification={75}
                distance={100}
                direction="middle"
                className="fixed left-1/2 transform -translate-x-1/2 bottom-8 bg-white/25 backdrop-blur-md border border-white/20 shadow-xl rounded-xl overflow-hidden z-40"
            >
                <DockIcon>
                    <CgProfile className="size-6" />
                </DockIcon>
                <Separator orientation="vertical" className="h-full" />
                <DockIcon>
                    <AiOutlineSchedule className="size-6" />
                </DockIcon>
            </Dock>
        </div>
    );
}
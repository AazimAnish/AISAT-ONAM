import { Dock, DockIcon } from "@/components/magicui/dock";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSchedule } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";

export default function UserLayout({
    children, // will be a page or nested layout
}) {
    return (
        <section className="h-screen w-full relative">
            {children}
            <Dock magnification={75} distance={100} direction="middle" className="absolute inset-x-0 bottom-8 z-10">
                <DockIcon>
                    <CgProfile className="size-6" />
                </DockIcon>

                <Separator orientation="vertical" className="h-full" />

                <DockIcon>
                    <AiOutlineSchedule className="size-6" />
                </DockIcon>
            </Dock>
        </section>
    )
}
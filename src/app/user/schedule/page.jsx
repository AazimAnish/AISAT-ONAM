import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import pookalam from "../../../../public/images/pookalam.gif"
import chenda from "../../../../public/images/chenda.gif"
import dance1 from "../../../../public/images/dance1.gif"
import thiruvathira from "../../../../public/images/thiruvathira.webp"
import clgdance2 from "../../../../public/images/clgdance2.gif"
import song from "../../../../public/images/song.gif"
import sing from "../../../../public/images/sing.gif"
import clgdance3 from "../../../../public/images/clgdance3.gif"
import sree from "../../../../public/images/sree.gif"
import sadhya from "../../../../public/images/sadhya.gif"
import chair from "../../../../public/images/chair.gif"
import lemon from "../../../../public/images/lemon.gif"
import appam from "../../../../public/images/appam.gif"
import pottu from "../../../../public/images/pottu.gif"
import bottle from "../../../../public/images/bottle.gif"
import chakku from "../../../../public/images/chakku.gif"
import uri from "../../../../public/images/uri.gif"
import pillow from "../../../../public/images/pillow.gif"
import vadam from "../../../../public/images/vadam.gif"
import kottu from "../../../../public/images/kottu.gif"





const page = () => {
  const data = [
    {
      title: "7:00 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm mb-4 ">
        പൂക്കളം
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={pookalam}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "9:00 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        മേലം കാവടി
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={chenda}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "10:00 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        നൃത്തം
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={clgdance2}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "10:10 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        തിരുവാതിര
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={song}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "10:30 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        ഓണം പാട്ട്
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={sing}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      
      
      ),
    },
   
    {
      title: "10:45 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        നൃത്തം
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={clgdance3}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "11:00 AM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        കേരള ശ്രീമാന്‍ മലയാളി മംഗ
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={sree}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "12:00 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        സദ്യ
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={sadhya}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "12:00 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Musical Chair
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={chair}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    
    {
      title: "12:15 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        അപ്പം കടി
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={appam}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "12:30 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        സുന്ദരിക്ക് പൊട്ട് തൊടല്
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={pottu}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "12:45 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        നാരങ്ങ സ്പൂൺ റേസ്
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={lemon}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "01:15 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        വെള്ളം കുപ്പി നിറയ്ക്കല്
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={bottle}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "01:30 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        ചക്കിൽ ചാട്ടം
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={chakku}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "02:00 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        ഉറിയടി
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={uri}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "02:20 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        ഓണത്തല്ലു
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={pillow}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "03:15 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        വടംവലി
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={vadam}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
    {
      title: "03:35 PM",
      content: (
        <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
        കലാശ കൊട്ട് 
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-xs mx-auto p-4 bg-gray-800 bg-opacity-20 backdrop-blur-sm border border-gray-10 border-opacity-50 rounded-2xl shadow-xl">
            <Image
              src={kottu}
              alt="Thiruvathira"
              className="rounded-2xl object-cover"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          </div>
        </div>
      </div>
      ),
    },
  ];
  return (
    
          
              <div className="w-full bg-black-300">
              <Timeline data={data} />
              </div>
            
    
  );
}
export default page

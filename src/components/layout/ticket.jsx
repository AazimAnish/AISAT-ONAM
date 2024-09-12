//working

"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import QRCodeGenerator from "./qrgenerator";
import "./ticket.css";

const Ticket = ({ name, phoneNumber, department, year, token }) => {
  const appRef = useRef(null);
  const ticketRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  console.log("Token", token);

  useEffect(() => {
    if (!appRef.current || !ticketRef.current) return;

    const speed = 7;
    const r = gsap.timeline({ repeat: -1 });
    const o = gsap.timeline({ repeat: -1 });
    const h = gsap.timeline({ repeat: -1 });

    r.to(appRef.current, {
      "--r": "180deg",
      "--p": "0%",
      duration: speed,
      ease: "sine.in",
    }).to(appRef.current, {
      "--r": "360deg",
      "--p": "100%",
      duration: speed,
      ease: "sine.out",
    });

    o.to(appRef.current, {
      "--o": 1,
      duration: speed / 2,
      ease: "power1.in",
    }).to(appRef.current, {
      "--o": 0,
      duration: speed / 2,
      ease: "power1.out",
    });

    h.to(appRef.current, {
      "--h": "100%",
      duration: speed / 2,
      ease: "sine.in",
    })
      .to(appRef.current, {
        "--h": "50%",
        duration: speed / 2,
        ease: "sine.out",
      })
      .to(appRef.current, {
        "--h": "0%",
        duration: speed / 2,
        ease: "sine.in",
      })
      .to(appRef.current, {
        "--h": "50%",
        duration: speed / 2,
        ease: "sine.out",
      });

    const handleMouseEnter = () => {
      r.pause();
      o.pause();
      h.pause();
    };

    const handleMouseLeave = () => {
      r.play();
      o.play();
      h.play();
    };

    ticketRef.current.addEventListener("mouseenter", handleMouseEnter);
    ticketRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (ticketRef.current) {
        ticketRef.current.removeEventListener("mouseenter", handleMouseEnter);
        ticketRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      r.kill();
      o.kill();
      h.kill();
    };
  }, []);

  const handleFlip = (direction) => {
    setIsFlipped((prev) => !prev);
    gsap.to(ticketRef.current, {
      rotationY: isFlipped ? 0 : direction === "left" ? -180 : 180,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <main
      id="app"
      ref={appRef}
      className="flex items-center justify-center min-h-screen"
    >
      <button
        onClick={() => handleFlip("left")}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 p-2 rounded-full shadow-md hover:bg-opacity-75 transition-all duration-300"
      >
        <FaArrowLeftLong size={24} />
      </button>
      <section className="ticket relative" ref={ticketRef}>
        <header className="front flex flex-col items-center justify-center">
          <div className="holo absolute inset-0"></div>
          <div className="flex flex-col items-center justify-center w-full h-full -mt-28">
            <h3 className="text-lg font-semibold">Token Number</h3>
            <p className="text-xl mb-8">{token}</p>
            <QRCodeGenerator mess_id={token} />
          </div>
          <aside className="divider absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2">
            <div>
              <span className="usernum text-sm font-medium">Sadhya-Fi</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">GoHopp</span>
              <span className="text-sm font-medium mt-2">NoTime</span>
            </div>
          </aside>
        </header>

        <section className="back">
          <div className="holo absolute inset-0"></div>
          <div className="data z-10 relative">
            <h3 className="text-lg font-semibold">Department</h3>
            <p className="text-xl mb-2">{department}</p>
            <h3 className="text-lg font-semibold">Year</h3>
            <p className="text-xl mb-2">{year}</p>
            <h3 className="text-lg font-semibold">Name</h3>
            <p className="text-xl mb-2">{name}</p>
            <h3 className="text-lg font-semibold">Phone Number</h3>
            <p className="text-xl">{phoneNumber}</p>
          </div>

          <aside className="divider absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2">
            <div>
              <span className="usernum text-sm font-medium">Sadhya-Fi</span>
            </div>
            <span className="text-sm font-medium">GoHopp</span>
          </aside>
        </section>
      </section>
      <button
        onClick={() => handleFlip("right")}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 p-2 rounded-full shadow-md hover:bg-opacity-75 transition-all duration-300"
      >
        <FaArrowRightLong size={24} />
      </button>
    </main>
  );
};

export default Ticket;

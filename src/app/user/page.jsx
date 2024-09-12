"use client";

import { db } from "@/app/firebase/firebaseConfig.js";
import Ticket from "@/components/layout/ticket.jsx";
import confetti from "canvas-confetti";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [pnum, setPnum] = useState("");
  const [dep, setDep] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encodedToken = localStorage.getItem("sys_bio");
        if (encodedToken) {
          const decodedToken = Buffer.from(encodedToken, "base64").toString(
            "utf8"
          );
          const fetched = JSON.parse(decodedToken);
          setEmail(fetched.email);

          const q = query(
            collection(db, "paid"),
            where("email", "==", fetched.email)
          );
          const snapshot = await getDocs(q);

          snapshot.forEach((doc) => {
            const docData = doc.data();
            setName(docData.name);
            setPnum(docData.phoneNumber);
            setDep(docData.branch);
            setYear(docData.yearOfStudy);
            setToken(docData.tokenNumber);
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Confetti effect
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);

  return (
    // <BackgroundGradientAnimation
    //   gradientBackgroundStart={"#FBEC5D"}
    //   gradientBackgroundEnd={"#FFFFFF"}
    //   firstColor={"#FBEC5D"}
    //   pointerColor={"#FFFAA0"}
    // >
    <div className="h-full w-full flex justify-center items-center overflow-hidden">
      <Ticket
        name={name}
        phoneNumber={pnum}
        department={dep}
        year={year}
        token={token}
      />
    </div>
    // </BackgroundGradientAnimation>
  );
};

export default Profile;

"use client";

import { db } from "@/app/firebase/firebaseConfig.js";
import Ticket from "@/components/layout/ticket.jsx";
import Confetti from "@/components/magicui/confetti";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation.jsx";

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

                    console.log("FETCHED EMAIL", fetched.email);

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
    }, []);

    return (
        <BackgroundGradientAnimation
            gradientBackgroundStart={"#FBEC5D"}
            gradientBackgroundEnd={"#FFFFFF"}
            firstColor={"#FBEC5D"}
            pointerColor={"#FFFAA0"}
        >
            <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
                <Confetti className="absolute left-0 top-0 z-0 size-full" />
                <Ticket
                    name={name}
                    phoneNumber={pnum}
                    department={dep}
                    year={year}
                    token={token}
                />
            </div>
        </BackgroundGradientAnimation>
    );
};

export default Profile;

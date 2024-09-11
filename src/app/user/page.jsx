"use client";

import React from 'react'
import Confetti from "@/components/magicui/confetti";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation.jsx";
import Ticket from '@/components/layout/ticket.jsx';

const Profile = () => {
    return (
        <BackgroundGradientAnimation
            gradientBackgroundStart={"#FBEC5D"}
            gradientBackgroundEnd={"#FFFFFF"}
            firstColor={"#FBEC5D"}
            pointerColor={"#FFFAA0"}
        >
            <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
                <Confetti
                    className="absolute left-0 top-0 z-0 size-full"
                />
                <Ticket
                    name="Aazim Anish"
                    phoneNumber="9562037068"
                    department="Information Technology"
                    year="4"
                />
            </div>
        </BackgroundGradientAnimation>
    )
}

export default Profile
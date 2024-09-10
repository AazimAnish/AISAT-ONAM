"use client";

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { BackgroundGradient } from "../../components/ui/background-gradient.jsx";
// import { BackgroundLines } from "@/components/ui/background-lines";
import Confetti from "@/components/magicui/confetti";
import FlickeringGrid from "@/components/magicui/flickering-grid";

const Profile = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center overflow-hidden">

            <FlickeringGrid
                className="z-0 absolute inset-0 size-full"
                squareSize={8}
                gridGap={6}
                color="#FABC3F"
                maxOpacity={0.7}
                flickerChance={0.1}
            />
            {/* <BackgroundLines className="flex items-center justify-center w-full flex-col px-4"> */}
                <Confetti
                    className="absolute left-0 top-0 z-0 size-full"
                />
                <BackgroundGradient className="max-w-sm rounded-xl p-2 sm:p-10 bg-transparent relative z-10">
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl overflow-hidden">
                        <CardHeader className="text-center">
                            <CardDescription>
                                <video autoPlay muted loop className="w-full h-auto object-cover rounded-lg">
                                    <source src="../../../sadyaKayicho.mp4" />
                                </video>
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="text-center">
                            <h2 className="mt-4 text-2xl font-semibold" style={{ color: '#FF4C4C' }}>John Doe</h2>
                            <p className="mt-2 text-lg text-slate-800/80" style={{ color: '#EE4E4E' }}>Software Engineer</p>
                            <div className="mt-5 space-y-2">
                                <p className="text-slate-800/60" style={{ color: '#F24C3D' }}>San Francisco, CA</p>
                                <p className="text-slate-800/60" style={{ color: '#F24C3D' }}>johndoe@example.com</p>
                            </div>
                        </CardContent>
                    </Card>
                </BackgroundGradient>
            {/* </BackgroundLines> */}

        </div>
    )
}

export default Profile
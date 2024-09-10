"use client";

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { BackgroundGradient } from "../../components/ui/background-gradient.jsx";
import { BackgroundLines } from "@/components/ui/background-lines";
import FlowerConfetti from '../../components/layout/flowerConfetti.jsx';

const Profile = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <FlowerConfetti />
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
                            <h2 className="mt-4 text-2xl font-semibold text-slate-400">John Doe</h2>
                            <p className="mt-2 text-lg text-slate-400/80">Software Engineer</p>
                            <div className="mt-5 space-y-2">
                                <p className="text-slate-400/60">San Francisco, CA</p>
                                <p className="text-slate-400/60">johndoe@example.com</p>
                            </div>
                        </CardContent>
                    </Card>
                </BackgroundGradient>
            </BackgroundLines>
        </div>
    )
}

export default Profile
"use client";
import HeroSection from "@/components/HeroSection/HeroSection";
import MarkDownMD from "@/components/MarkDownMD/MarkDownMD";
import { NavBar } from "@/components/NavBar/NavBar";
import { useState } from "react";

export default function Home() {


  return (
    <>
    <div className="w-[100vw] h-[100vh]">

      <div className="flex flex-col items-center justify-evenly h-[100vh]">
      <NavBar />
        <div className="max-w-screen-lg w-full">
          <HeroSection />
        </div>
      </div>
      
      </div>
    </>
  );
}



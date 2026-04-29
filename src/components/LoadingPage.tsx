import React from "react";
import { Logo } from "./Logo";

export function LoadingPage() {
  return (
    <div className="flex min-h-[90vh] grow items-center justify-center">
      <div className="flex flex-row gap-5">
        <video
          src="/loading.webm"
          autoPlay
          loop
          muted
          className="animate-spin-slow h-25 w-25 rounded-full"
        />
        <Logo />
      </div>
    </div>
  );
}

"use client";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function FabScroll() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight * 0.8;
      setIsVisible(scrollPosition < threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onScrollToBottom = () => {
    const scrollPosition = document.documentElement.scrollHeight * 0.75 - window.innerHeight;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center animate-bounce">
      <Button
        onClick={onScrollToBottom}
        aria-label="Scroll to bottom"
        className="border bg-transparent border-green-800 backdrop-blur-sm text-green-800 font-bold py-2 px-12 rounded-full shadow-lg">
        <DoubleArrowDownIcon />
      </Button>
    </div>
  );
}

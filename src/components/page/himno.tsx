"use client";
import ReactAudioPlayer from "react-audio-player";

export default function Himno() {
  return (
    <ReactAudioPlayer
      src='/page/himno.mp3'
      controls
      className='background-transparent h-12 w-full'
    />
  );
}
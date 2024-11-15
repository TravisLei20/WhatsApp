import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveFormRef = useRef(null);
  const waveform = useRef(null);

  useEffect(() => {
    if (audioMessage instanceof HTMLAudioElement) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const handlePauseAudio = () => {
    if (waveform.current) {
      waveform.current.stop();
    }
    if (audioMessage) {
      audioMessage.pause();
    }
    setIsPlaying(false);
  };

  const handlePlayAudio = () => {
    if (audioMessage) {
      if (waveform.current) {
        waveform.current.stop();
        waveform.current.play();
      }
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);

    const initializeWaveformAndLoad = () => {
      if (waveform.current && waveFormRef.current) {
        waveform.current.load(audioURL);
        waveform.current.on("ready", () => {
          setTotalDuration(waveform.current.getDuration());
        });
      }
    };

    // Create waveform if it doesn't exist
    if (!waveform.current && waveFormRef.current) {
      waveform.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#CCC",
        progressColor: "#4A9EFF",
        cursorColor: "#7AE3C3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });

      waveform.current.on("finish", () => {
        setIsPlaying(false);
      });

      initializeWaveformAndLoad();
    } else {
      initializeWaveformAndLoad();
    }

    return () => {
      if (waveform.current) {
        waveform.current.destroy();
        waveform.current = null; // Reset for next render
      }
    };
  }, [message.message]);

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "00:00";
    }
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className={`flex items-center gap-5 text-white px-4 py-4 text-sm rounded-md ${
        message.senderId === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div>
        <Avatar
          type="lg"
          image={
            message.senderId === currentChatUser.id
              ? currentChatUser?.profilePicture
              : userInfo?.profileImage
          }
        />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef}></div>
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;

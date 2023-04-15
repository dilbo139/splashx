import { Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

interface Props {
  videoUrl: string;
}

const VideoPlayer: React.FC<Props> = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const rate = 0.01; // $0.01 per second of video watched

  // simulate a 2 second delay before video starts playing
  useEffect(() => {
    setTimeout(() => {
      setIsPlaying(true);
    }, 2000);
  }, []);

  useEffect(() => {
    let intervalId: any;
    // if (isPlaying) {
    intervalId = setInterval(() => {
      setTimeSpent(timeSpent + 1);
      setMoneyEarned(timeSpent * rate);
    }, 1000); // update time spent and money earned every second
    // }

    return () => clearInterval(intervalId);
  }, [isPlaying, timeSpent]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLVideoElement>) => {
    if (event.key === " ") {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <video
        src={videoUrl}
        controls={true}
        onClick={handlePlay}
        onKeyDown={handleKeyDown}
      />
      {isPlaying ? (
        <button onClick={handlePause}>Pause</button>
      ) : (
        <button onClick={handlePlay}>Play</button>
      )}

      {/* <p>Time Spent: {timeSpent} seconds</p>
      <p>Money Earned: ${moneyEarned.toFixed(2)}</p> */}
    </div>
  );
};

export default VideoPlayer;

import LivepeerPlayer from "@/components/LivepeerPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import React, { useEffect, useState } from "react";

type Props = {};

const playbackIds: string[] = [
  "0b71y791z0b1fobx",
  "c93am2dgf19jh5r6",
  "3952s8oa25gk57sw",
];

const VideoDetail = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const rate = 0.01; // $0.01 per second of video watched

  useEffect(() => {
    let intervalId: any;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setTimeSpent(timeSpent + 1);
        setMoneyEarned(timeSpent * rate);
      }, 1000); // update time spent and money earned every second
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, timeSpent]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-48 text-white">
      <LivepeerPlayer />
      {/* <VideoPlayer
        videoUrl={"https://lp-playback.com/hls/c93am2dgf19jh5r6/index.m3u8"}
      /> */}

      <div className="flex items-center justify-between ">
        <p>Time Spent: {timeSpent} seconds</p>
        <p>Money Earned: ${moneyEarned.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default VideoDetail;

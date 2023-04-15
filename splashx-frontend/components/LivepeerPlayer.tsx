import React from "react";
import { Player } from "@livepeer/react";

import Image from "next/image";
// import blenderPoster from "../../public/images/video-camera.svg";

type Props = {};

const playbackId =
  "bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy";

const PosterImage = () => {
  return (
    <Image
      src={"/images/video-camera.svg"}
      layout="fill"
      objectFit="cover"
      priority
      // placeholder="blur"
      alt={""}
    />
  );
};

const LivepeerPlayer = (props: Props) => {
  return (
    <Player
      title="Waterfalls"
      playbackId={playbackId}
      showPipButton
      showTitle={false}
      aspectRatio="16to9"
      poster={<PosterImage />}
      controls={{
        autohide: 3000,
      }}
      theme={{
        borderStyles: { containerBorderStyle: "solid" },
        radii: { containerBorderRadius: "10px" },
      }}
    />
  );
};

export default LivepeerPlayer;

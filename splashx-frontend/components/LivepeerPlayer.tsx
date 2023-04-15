import { Player } from "@livepeer/react";
import Image from "next/image";
import * as React from "react";

import rickRollPoster from "../public/images/rick.jpeg";

const PosterImage = () => {
  return (
    <Image src={rickRollPoster} priority placeholder="blur" alt="waterfall" />
  );
};

const playbackId =
  "bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe";

export default function LivepeerPlayer() {
  return (
    <Player
      title="Waterfalls"
      playbackId={"c93am2dgf19jh5r6"}
      loop
      autoPlay
      showTitle={false}
      muted
      poster={<PosterImage />}
    />
  );
}

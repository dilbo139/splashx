import LivepeerPlayer from "@/components/LivepeerPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import { Button, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import hmacSHA256 from "crypto-js/hmac-sha256";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { Client } from "urql";
import { useRouter } from "next/router";

type Props = {};

const playbackIds: string[] = [
  "0b71y791z0b1fobx",
  "c93am2dgf19jh5r6",
  "3952s8oa25gk57sw",
];

const VideoDetail = (props: Props) => {
  const router = useRouter();
  const { playbackId } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const rate = 0.01; // $0.01 per second of video watched
  const address = useAddress();

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

  const viewCount = 40;
  const ipfsHash = "QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG";
  const fromAddress = address;
  const toAddress = "0x4e35fF1872A720695a741B00f2fA4D1883440baC";
  const flowRate = ((1 / 3600) * 24).toString();
  const superTokenAddress = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";

  const toast = useToast();

  const { contract } = useContract(superTokenAddress);

  const {
    mutateAsync: mutateAsyncUpdateFlow,
    isLoading: isLoadingUpdate,
    error: isErrorUpdate,
  } = useContractWrite(contract, "updateFlow");

  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "createFlow"
  );

  async function handleClaim() {
    //1. Check if they are among the first 100 viewers
    if (viewCount > 100) {
      toast({
        title: "Sorry, you are too late",
        description:
          "You can only claim the stream if you are among the first 100 viewers",
        status: "error",
        duration: 5000,
      });
    } else {
      //2. Check if they have already watched the video once
      const value = hmacSHA256(
        ipfsHash,
        process.env.NEXT_PUBLIC_HASH_SECRET!
      ).toString();
      const localStorageValue = localStorage.getItem("prev");
      if (localStorageValue === value) {
        toast({
          title: "You have already watched this video",
          description:
            "You can only claim the stream when you watch the video for the first time",
          status: "error",
          duration: 5000,
        });
      } else {
        localStorage.setItem("prev", value);
        //3. Create / update the stream from the creator's lens handle to the viewer's lens handle

        // TODO: Replace with metamask provider
        // const provider = new ethers.providers.InfuraProvider(
        //     "x",
        //     "c72c423442fa4e36aaa6a1d45f4a5edb"
        //   );

        // get provider from connect thirdweb address
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const sf = await Framework.create({
          chainId: 80001, //this is for matic - enter your own chainId here
          provider,
        });

        const params = {
          sender: fromAddress,
          receiver: toAddress, //tradeable cashflow address
          flowRate,
          // userData: ethers.utils.hexZeroPad(ethers.utils.hexlify(ipfsHash), 32),
          superToken: superTokenAddress,
        };

        console.log(params);

        const variables = {
          sender: fromAddress,
          receiver: toAddress,
        };

        const tokensQuery = `
                      query {
                          tokens {
                          id
                          tokenID
                          contentURI
                          metadataURI
                          }
                      }
                  `;

        const client = new Client({
          exchanges: [],
          url: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai",
        });
        const { data: query } = await client
          .query(tokensQuery, variables)
          .toPromise();
        console.log({ streams: query.streams, variables });
        const createFlowOperation =
          query.streams.length > 0
            ? mutateAsyncUpdateFlow({
                args: [
                  // fromAddress,
                  // toAddress,
                  // flowRate,
                  // ethers.utils.hexZeroPad(ethers.utils.hexlify(ipfsHash), 32),
                  // superTokenAddress,
                  Object.values(params),
                ],
              })
            : mutateAsync({
                args: [
                  // fromAddress,
                  // toAddress,
                  // flowRate,
                  // ethers.utils.hexZeroPad(ethers.utils.hexlify(ipfsHash), 32),
                  // superTokenAddress,
                  Object.values(params),
                ],
              });

        console.log("createFlowOperation: ", createFlowOperation);
        // const createFlowOperation =
        //   query.streams.length > 0
        //     ? sf.cfaV1.updateFlow(params)
        //     : sf.cfaV1.createFlow(params);

        // const tx1 = await createFlowOperation.forwarderPopulatedPromise;
        // const tx2 = await createFlowOperation.populateTransactionPromise;
        // console.log(tx1);
        // console.log(tx2);

        // TODO: Call the send transaction provider
        // const hash = await provider.sendTransaction({
        //     method: "eth_sendTransaction",
        //     params: [
        //         {
        //             from: fromAddress,
        //             to: (tx1 ?? tx2).to,
        //             value: "0",
        //             data: (tx1 ?? tx2).data,
        //         },
        //     ],
        // });

        // console.log(hash)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-48 text-white">
      <LivepeerPlayer
        posterImage={"/images/deathnote-poster.jpeg"}
        playbackId={playbackId as string}
      />
      {/* <VideoPlayer
        videoUrl={"https://lp-playback.com/hls/c93am2dgf19jh5r6/index.m3u8"}
      /> */}

      <div className="flex items-center justify-between ">
        {/* <p>Time Spent: {timeSpent} seconds</p>
        <p>Money Earned: ${moneyEarned.toFixed(2)}</p> */}
        {/* TODO: add view count + claim button */}

        <Button
          onClick={handleClaim}
          display={{ base: "end", md: "inline-flex" }}
          fontSize={"sm"}
          fontWeight={600}
          color={"white"}
          bg={"brand.brightBlue"}
          _hover={{
            opacity: 0.8,
          }}
        >
          Claim
        </Button>
      </div>
    </div>
  );
};

export default VideoDetail;

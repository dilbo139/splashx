import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import Script from "next/script";
import {
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "@/graphql/generated";

export default function Home() {
  const {
    isLoading,
    error,
    data: publicationsData,
  } = useExplorePublicationsQuery(
    {
      request: {
        sortCriteria: PublicationSortCriteria.Latest,
        limit: 3,
      },
    },
    {
      // Don't refetch the user comes back
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  console.log("publicationsData: ", publicationsData);

  const playbackIds: string[] = [
    "0b71y791z0b1fobx",
    "c93am2dgf19jh5r6",
    "3952s8oa25gk57sw",
  ];

  const thumbnailUrls = [
    {
      id: 1,
      title: "Death Note",
      url: "/images/deathnote-poster.jpeg",
    },
    {
      id: 2,
      title: "Attack On Titan",
      url: "/images/attack-on-titan.jpeg",
    },
    {
      id: 3,
      title: "One Piece",
      url: "/images/one-piece.jpeg",
    },
  ];
  return (
    <div>
      <Head>
        <title>Splash X</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-col bg-gradient-to-b from-gray-900 to-slate-800 text-white">
        <Layout>
          <h1 className="shadow-md-secondary mb-6 text-center text-5xl font-bold text-error drop-shadow-[3px_3px_3px_#dc2626]">
            Splash X
          </h1>
          <main>
            <section className="text-center">
              <Flex justify={"center"} align={"center"} flexWrap={"wrap"}>
                {publicationsData?.explorePublications.items.map((pub, i) => {
                  return (
                    <VideoCard
                      thumbnailUrl={thumbnailUrls[i].url}
                      key={i}
                      author={pub.profile.handle}
                      playbackId={playbackIds[i]}
                      videoTitle={thumbnailUrls[i].title}
                    />
                  );
                })}
                {/* <VideoCard />
                <VideoCard /> */}
              </Flex>
            </section>
          </main>
        </Layout>
      </div>
      <footer className="flex items-start justify-center border-t border-gray-800 px-8 py-12 font-medium text-white">
        <span>Made with ❤️ by Team SplashX</span>
      </footer>
      <Script src="https://buttons.github.io/buttons.js" />
    </div>
  );
}

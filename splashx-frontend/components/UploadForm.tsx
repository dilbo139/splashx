import React, { useState } from "react";
import {
  Flex,
  Text,
  Container,
  Box,
  Avatar,
  Image,
  useDisclosure,
  Button,
  Input,
  Collapse,
  Textarea,
  VisuallyHiddenInput,
  VisuallyHidden,
} from "@chakra-ui/react";

import useLensUser from "@/lib/auth/useLensUser";
import { useMutation } from "@tanstack/react-query";
import { useAddress, useStorageUpload, Web3Button } from "@thirdweb-dev/react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "@/utils/constants";
import { useCreatePost } from "@/lib/useCreatePost";
import Layout from "./Layout";

const UploadForm: React.FC = () => {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const [video, setVideo] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { isSignedInQuery, profileQuery } = useLensUser();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const { mutateAsync: createPost } = useCreatePost();

  const address = useAddress();

  const handlePost = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    // reset error and message
    setError("");
    setMessage("");

    // fields check
    if (!title || !description) return setError("All fields are required");
    try {
      // upload video to IPFS
      const videoIpfsUrl = (await uploadToIpfs({ data: [video] }))[0];

      // post structure
      let post = {
        title,
        description,
        content,
        author: profileQuery?.data?.defaultProfile?.handle || address,
        published: false,
        createdAt: new Date().toISOString(),
        videoIpfsUrl,
      };
      // save the post
      let response = await fetch("/api/videos", {
        method: "POST",
        body: JSON.stringify(post),
      });

      // get the data
      let data = await response.json();
      setLoading(false);

      setTitle("");
      setContent("");
      setDescription("");
      // set the message
      return setMessage(data.message);
    } catch (err: any) {
      // set the error
      return setError(err);
    }
  };

  const {
    data,
    error: postError,
    isError,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: handlePost,
    onSuccess: async () => {
      console.log("sucessfully mutated posts...");
    },
  });

  return (
    <Layout>
      <Box
        borderRadius={"13px"}
        width={"80vw"}
        height={"auto"}
        // background="linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)"
        background="none"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
        gap={"5"}
        paddingY={"10"}
        marginY={{ base: "4", md: "10" }}
        marginX={"auto"}
        color={"white"}
      >
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          paddingBottom={"5"}
          gap={9}
        >
          <Text fontSize={"2xl"} fontWeight={"500"} onClick={handleToggle}>
            Upload Video
          </Text>
        </Flex>

        <Flex
          display={"flex"}
          mt={9}
          flexDirection={{ base: "column" }}
          width={"100%"}
          justifyContent={"center"}
          paddingX={{ base: "5", md: "unset" }}
          gap={"10"}
          height={{ base: "440px", md: "250px" }}
        >
          <Box
            background={"gray.900"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={5}
            // flexDirection={{ base: "row", md: "column" }}
            paddingY={{ base: "4px", md: "30px" }}
            mt={"30px"}
            borderRadius={"8px"}
            borderStyle={"dashed"}
            borderWidth={"1px"}
            borderColor={"rgba(117, 84, 250, 0.5)"}
          >
            <Image src="/images/upload-video.svg" alt="Upload Video" />
            <Input
              id="upload"
              type="file"
              placeholder="Upload a video"
              accept="video/mp4,video/x-m4v,video/*"
              onChange={(e) => {
                if (e.target.files) {
                  setVideo(e.target.files[0]);
                }
              }}
              border="none"
              size={"md"}
              opacity={0}
              width={"60px"}
              height={"60px"}
              p={6}
              cursor={"pointer"}
            />
            <Text fontWeight={"500"} fontSize={"xl"}>
              Drag & Drop
            </Text>
            {video && <Text color={"white"}>{video.name}</Text>}
          </Box>
          <Box
            // width={{ base: "100%", md: "45%" }}
            display={"flex"}
            flexDirection={"column"}
            gap={"5"}
            paddingX={{ base: "5", md: "unset" }}
          >
            <Text fontSize={""} fontWeight={"500"}>
              Title
            </Text>
            <Input
              placeholder="Add a title that describes your video"
              borderRadius={"13px"}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <Text fontSize={"xl"} fontWeight={"500"}>
              {" "}
              Description
            </Text>
            <Textarea
              borderRadius={"13px"}
              fontSize={"lg"}
              placeholder="Tell viewers about your video"
              size="sm"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </Box>
        </Flex>
        {/* stake box */}
        {/* <form onSubmit={handlePost}> */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            width={{ base: "100%", md: "100%" }}
            justifyContent={"center"}
            paddingX={{ base: "10", md: "10" }}
            paddingY={{ base: "5", md: "10" }}
            marginY={"10"}
            borderRadius={"13px"}
            mt={{ base: "10" }}
          >
            <Flex gap={"10"} flexDirection={{ base: "column", md: "row" }}>
              <Box
                display={"flex"}
                alignItems={{ base: "center", md: "center" }}
              >
                {/* <Button
                    bg={"brand.purple"}
                    borderRadius={"13px"}
                    fontSize={"xl"}
                    paddingY={"2"}
                    type="submit"
                  >
                    {loading ? "Loading..." : "Stake and Upload"}
                  </Button> */}
                <Web3Button
                  accentColor="#7554FA"
                  contractAddress={LENS_CONTRACT_ADDRESS}
                  contractAbi={LENS_CONTRACT_ABI}
                  action={async () => {
                    if (!video) return;

                    return await createPost({
                      video,
                      title,
                      description,
                      content,
                    });
                  }}
                >
                  Create Post
                </Web3Button>
                {error ? <Text color={"red"}>{error}</Text> : null}
                {message ? <Text color={"brand.purple"}>{message}</Text> : null}
              </Box>
            </Flex>
          </Box>
        </form>
      </Box>
    </Layout>
  );
};

export default UploadForm;

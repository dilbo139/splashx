import {
  Card,
  CardBody,
  Image,
  Stack,
  Divider,
  CardFooter,
  Button,
  ButtonGroup,
  Text,
  Heading,
  Container,
} from "@chakra-ui/react";
import React from "react";
import LivepeerPlayer from "./LivepeerPlayer";

type Props = {
  author: string;
  playbackId: string;
};

const VideoCard = (props: Props) => {
  return (
    <Card
      maxW="sm"
      bg="none"
      rounded={"md"}
      className="ml-12 mt-6 bg-slate-800"
    >
      <CardBody color={"white"}>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        {/* <LivepeerPlayer playbackId={props.playbackId} /> */}
        <Stack mt="6" spacing="3">
          <Heading size="sm">{props.author}</Heading>
          <Text>
            This sofa is perfect for modern tropical spaces, baroque inspired
            spaces, earthy toned spaces and for people who love a chic design
            with a sprinkle of vintage design.
          </Text>
          <Text color="blue.600" fontSize="2xl">
            $450
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          variant="solid"
          bg="brand.brightBlue"
          _hover={{ opacity: 0.8 }}
          flex={1}
          color="white"
        >
          Watch
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
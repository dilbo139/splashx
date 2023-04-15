import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Image,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import React, { useEffect } from "react";
import useMetamask from "@/hooks/useMetamask";
import { useListen } from "@/hooks/useListen";
import MetaMaskSDK from "@metamask/sdk";

export default function Navbar() {
  const listen = useListen();

  const { isOpen, onToggle } = useDisclosure();

  const {
    connectMetamask,
    loading: loadingMetamask,
    disconnectMetamask,
    address,
  } = useMetamask();

  // const {
  //   dispatch,
  //   state: { status, isMetaMaskInstalled, wallet },
  // } = useMetamask();

  // can be passed to an onclick handler
  // const connectMetamask = async () => {
  //   console.log("connectingMetamask...");
  //   const hasWindow = typeof window !== "undefined";
  //   if (!hasWindow) return;

  //   if (hasWindow) {
  //     dispatch({ type: "loading" });
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //       params: []
  //     });

  //     if (accounts.length > 0) {
  //       const balance = await window.ethereum!.request({
  //         method: "eth_getBalance",
  //         params: [accounts[0], "latest"],
  //       });
  //       dispatch({ type: "connect", wallet: accounts[0], balance });

  //       // we can register an event listener for changes to the users wallet
  //       listen();
  //     }
  //   }
  // };

  // can be passed to an onclick handler

  return (
    <Box>
      <Flex
        bg={"#111827"}
        color={"white"}
        minH={"76px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={"center"}
        position={"fixed"}
        width={"100%"}
        zIndex={"99"}
        top={"0"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 7 }}
          justify={{ base: "center", md: "start" }}
          paddingX={{ base: "none", md: "3" }}
        >
          {/*
           */}
          {/* <Link href="/" _hover={{ opacity: 0.7 }}>
            <Image width={"80%"} src="/images/splash-logo.svg" alt="Splash" />
          </Link> */}
          <Link
            href="/"
            className="shadow-md-secondary mb-6 text-center text-5xl font-bold text-primary drop-shadow-[3px_3px_3px_#dc2626]"
          >
            SplashX&nbsp;.
          </Link>

          {/* <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex> */}
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          align={"center"}
        >
          {/* Display current user's address */}

          {address ? (
            <Button
              bgColor="brand.purple"
              textColor="white"
              // TODO: add disconnect handler
              onClick={() => disconnectMetamask()}
              _hover={{
                opacity: 0.8,
              }}
            >
              Disconnect Wallet
            </Button>
          ) : (
            <Button
              bgColor="brand.purple"
              textColor="white"
              onClick={connectMetamask}
              _hover={{
                opacity: 0.8,
              }}
              disabled={loadingMetamask}
            >
              {loadingMetamask ? <Spinner /> : "Connect Wallet"}
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
      {/* Left Menu Bar */}
      <Flex
        display={{ base: "none", md: "flex" }}
        ml={10}
        left={0}
        width={"240px"}
        height={"full"}
        // bg={"#111827"}
        marginLeft={"none"}
        top={"76px"}
        paddingX={"8"}
        position={"fixed"}
        className="bg-gradient-to-b from-gray-900  to-slate-700"
      >
        <DesktopNav />
      </Flex>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("white", "white");
  const linkHoverColor = useColorModeValue("brand.lightPurple", "lightPurple");
  // const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"column"} spacing={6} height={"full"}>
      {NAV_ITEMS.map((navItem: NavItem, idx: number) => (
        <Box key={idx}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                <Flex
                  flexDirection={"row"}
                  width={"full"}
                  gap={"15px"}
                  fontSize={"1.3em"}
                  fontWeight={"Bold"}
                >
                  <Image src={navItem.icon} alt="Nav Icon" />
                  {navItem.label}
                </Flex>
              </Link>
            </PopoverTrigger>
            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              ></PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack bg={"white"} p={4} display={{ md: "none" }} marginTop={"76px"}>
      {NAV_ITEMS.map((navItem: NavItem, idx) => (
        <MobileNavItem key={idx} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  icon: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
    icon: "/images/home.svg",
  },
  {
    label: "My Profile",
    href: "/MyProfile",
    icon: "/images/user-circle.svg",
  },
  {
    label: "Earnings",
    href: "/Earnings",
    icon: "/images/currency-dollar.svg",
  },
  {
    label: "DAO",
    href: "#",
    icon: "/images/view-grid.svg",
  },
  {
    label: "Your Videos",
    href: "/YourVideo",
    icon: "/images/video-camera.svg",
  },
];

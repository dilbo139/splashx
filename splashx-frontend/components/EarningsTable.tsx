import {
  Button,
  Flex,
  SimpleGrid,
  Stack,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

type Props = {};

const data = [
  {
    name: "Segun Adebayo",
    balance: "sage@chakra.com",
  },
  {
    name: "Josef Nikolas",
    balance: "Josef@mail.com",
  },
  {
    name: "Lazar Nikolov",
    balance: "Lazar@mail.com",
  },
  {
    name: "Abraham",
    balance: "abraham@anu.com",
  },
];

const Table = (props: Props) => {
  const dataColor = useColorModeValue("gray.600", "gray.800");
  const bg = useColorModeValue("gray.700", "gray.800");
  const bg2 = useColorModeValue("gray.700", "gray.900");
  return (
    <Flex
      w="80vw"
      h={"full"}
      // bg="#edf3f8"
      // _dark={{
      //   bg: "#3e3e3e",
      // }}
      p={50}
      alignItems="center"
      justifyContent="center"
      mx={"auto"}
      mt={9}
    >
      <Stack
        direction={{
          base: "column",
        }}
        w="full"
        bg={{
          md: bg,
        }}
        shadow="lg"
      >
        {data.map((person, pid) => {
          return (
            <Flex
              direction={{
                base: "row",
                md: "column",
              }}
              bg={dataColor}
              key={pid}
            >
              <SimpleGrid
                spacingY={3}
                columns={{
                  base: 1,
                  md: 3,
                }}
                w={{
                  base: 120,
                  md: "full",
                }}
                textTransform="capitalize"
                bg={bg2}
                color={"gray.500"}
                py={{
                  base: 1,
                  md: 4,
                }}
                px={{
                  base: 2,
                  md: 10,
                }}
                fontSize="md"
                fontWeight="hairline"
              >
                <span>Token Name</span>
                <span>Token Balance</span>
                <chakra.span
                  textAlign={{
                    md: "right",
                  }}
                >
                  Actions
                </chakra.span>
              </SimpleGrid>
              <SimpleGrid
                spacingY={3}
                columns={{
                  base: 1,
                  md: 3,
                }}
                w="full"
                py={2}
                px={10}
                fontWeight="hairline"
              >
                <span>{person.name}</span>
                <chakra.span
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {person.balance}
                </chakra.span>
                <Flex
                  justify={{
                    md: "end",
                  }}
                >
                  <Button variant="solid" color="brand.purple" size="sm">
                    View
                  </Button>
                </Flex>
              </SimpleGrid>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  );
};

export default Table;

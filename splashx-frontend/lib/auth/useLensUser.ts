import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { readAccessToken } from "./helpers";
import { useDefaultProfileQuery } from "../../graphql/generated";
import { STORAGE_KEY } from "@/utils/constants";
import useMetamask from "@/hooks/useMetamask";
import { useAddress } from "@thirdweb-dev/react";

export default function useLensUser() {
  // 1. Make a react query for the local storage Key
  const address = useAddress();

  const localStorageQuery: UseQueryResult<
    {
      accessToken: string;
      refreshToken: string;
      exp: number;
    } | null,
    unknown
  > = useQuery(
    [STORAGE_KEY, address],
    // Writing the actual function to check the local storage
    () => readAccessToken()
  );

  // If there is a connected wallet address
  // Then we can ask for the default profile from Lens
  const profileQuery = useDefaultProfileQuery(
    {
      request: {
        ethereumAddress: address,
      },
    },
    {
      enabled: !!address,
    }
  );

  console.log("defaultProfile: ", profileQuery.data?.defaultProfile);

  return {
    // Contains information about both the local storage
    // AND the information about the lens profile
    isSignedInQuery: localStorageQuery,
    profileQuery: profileQuery,
  };
}

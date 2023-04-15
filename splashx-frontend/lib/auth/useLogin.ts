import { STORAGE_KEY } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSDK } from "@thirdweb-dev/react";
import { useAuthenticateMutation } from "../../graphql/generated";
import generateChallenge from "./generateChallenge";
import { setAccessToken } from "./helpers";
import useMetamask from "@/hooks/useMetamask";

export default function useLogin() {
  const { address } = useMetamask();
  const sdk = useSDK();
  const { mutateAsync: sendSignedMessage } = useAuthenticateMutation();
  const client = useQueryClient();

  // 1. Write the actual async function
  async function login() {
    if (!address) return;

    // 1. Generate challenge which comes from the Lens API
    const { challenge } = await generateChallenge(address);

    // 2. Sign the challenge with the user's wallet
    const signature = await sdk?.wallet.sign(challenge.text);

    // 3. Send the signed challenge to the Lens API
    const { authenticate } = await sendSignedMessage({
      request: {
        address,
        signature,
      },
    });

    // 4. Receive a access token from the Lens API if  we succeed
    // 5. Store the access token inside local storage so we can use it.
    const { accessToken, refreshToken } = authenticate;

    setAccessToken(accessToken, refreshToken);

    // Now, let's ask react query to refetch the cache key
    // Refetch this cache key:  ["lens-user", address],
    client.invalidateQueries([STORAGE_KEY, address]);
  }

  // 2. Return the useMutation hook wrapping the async function
  return useMutation(login);
}

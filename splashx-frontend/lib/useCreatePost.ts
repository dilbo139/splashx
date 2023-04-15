import { useMutation } from "@tanstack/react-query";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import {
  PublicationMainFocus,
  useCreatePostTypedDataMutation,
} from "@/graphql/generated";
import useLensUser from "./auth/useLensUser";
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers";
import { v4 as uuidv4 } from "uuid";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "@/utils/constants";
import useLogin from "./auth/useLogin";

type CreatePostArgs = {
  video: File;
  title: string;
  description: string;
  content?: string | "";
};

export function useCreatePost(): any {
  const { mutateAsync: requestTypedData } = useCreatePostTypedDataMutation();
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const { profileQuery } = useLensUser();
  const sdk = useSDK();
  const { mutateAsync: loginUser } = useLogin();

  async function createPost({
    video,
    title,
    description,
    content,
  }: CreatePostArgs) {
    // console.log("createPost", video, title, description, content);
    // 0. Login
    await loginUser();

    // 0. Upload the video to IPFS
    const videoIpfsUrl = (await uploadToIpfs({ data: [video] }))[0];

    // console.log("videoIpfsUrl", videoIpfsUrl);

    // 0B) Upload the actual content to IPFS
    // This is going to be a Object which contains the image field as well
    const postMetadata = {
      version: "2.0.0",
      mainContentFocus: PublicationMainFocus.Video,
      metadata_id: uuidv4(),
      description: description,
      locale: "en-US",
      content: content,
      external_url: null,
      image: videoIpfsUrl,
      imageMimeType: null,
      name: title,
      attributes: [],
      tags: [],
    };

    const postMetadataIpfsUrl = (
      await uploadToIpfs({ data: [postMetadata] })
    )[0];

    console.log("postMetadataIpfsUrl", postMetadataIpfsUrl);

    // 1. Ask Lens to give us the typed data
    const typedData = await requestTypedData({
      request: {
        collectModule: {
          freeCollectModule: {
            followerOnly: false,
          },
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
        contentURI: postMetadataIpfsUrl,
        profileId: profileQuery.data?.defaultProfile?.id,
      },
    });

    const { domain, types, value } = typedData.createPostTypedData.typedData;

    if (!sdk) return;

    // 2. Sign the typed data
    const signature = await signTypedDataWithOmmittedTypename(
      sdk,
      domain,
      types,
      value
    );

    const { v, r, s } = splitSignature(signature.signature);

    // 3. Use the signed typed data to send the transaction to the smart contract
    const lensHubContract = await sdk.getContractFromAbi(
      LENS_CONTRACT_ADDRESS,
      LENS_CONTRACT_ABI
    );

    // Destructure the stuff we need out of the typedData.value field
    const {
      collectModule,
      collectModuleInitData,
      contentURI,
      deadline,
      profileId,
      referenceModule,
      referenceModuleInitData,
    } = typedData.createPostTypedData.typedData.value;

    console.log("contentURI: ", contentURI);

    const tx = await lensHubContract.call("postWithSig", {
      // @ts-ignore
      profileId: "0x69b8",
      contentURI: contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: deadline,
      },
    });

    // const result = await tx.wait();
    // console.log("tx from useCreatePost: ", tx);
    // console.log("result from useCreatePost: ", result);
    // const splitContentURI = contentURI.split("ipfs://");
    // const CID = splitContentURI[1];
    // console.log("CID: ", CID);
    // return `https://ipfs.io/ipfs/${CID}`;
  }

  return useMutation(createPost);
}

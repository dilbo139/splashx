import MetaMaskSDK from "@metamask/sdk";

const options = {};

export const MMSDK = new MetaMaskSDK(options);

export const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

export const connectMetamask = async () =>
  await ethereum.request({
    method: "eth_requestAccounts",
    params: [],
  });

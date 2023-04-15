import MetaMaskSDK from "@metamask/sdk";

const options = {};

const MMSDK = new MetaMaskSDK(options);

const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

ethereum.request({ method: "eth_requestAccounts", params: [] });

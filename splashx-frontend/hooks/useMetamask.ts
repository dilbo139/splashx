import MetaMaskSDK from "@metamask/sdk";
import React, { useState, useEffect } from "react";

const useMetamask = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");

  async function connectMetamask() {
    const MMSDK = new MetaMaskSDK();
    const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
    setLoading(true);
    const res = await ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    });
    setLoading(false);
    console.log(res);
    setAddress(res[0]);
  }

  async function disconnectMetamask() {
    setLoading(true);
    setAddress("");
    setLoading(false);
  }
  return { connectMetamask, loading, address, disconnectMetamask };
};

export default useMetamask;

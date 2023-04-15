import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY!],
    },
    scroll: {
      url: 'https://alpha-rpc.scroll.io/l2',
      chainId: 534353,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1e11
    },
    chiado: {
      url: 'https://rpc.chiadochain.net/',
      chainId: 10200,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1e11
    },
    taiko: {
      url: 'https://l2rpc.hackathon.taiko.xyz',
      chainId: 167002,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1e11
    },
    celo: {
      url: 'https://forno.celo.org',
      chainId: 42220,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1e11
    }
    // mantle: {},
  }
};

export default config;

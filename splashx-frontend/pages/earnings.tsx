import EarningsTable from "@/components/EarningsTable";
import Layout from "@/components/Layout";
import React, { useEffect } from "react";
import { Client, gql } from "urql";

type Props = {};

const query = ` {
  query TokenBalances(
    input: {
      filter: {
        owner: {_eq: "vitalik.eth"},
        tokenAddress: {_eq: "0x4d224452801ACEd8B2F0aebE155379bb5D594381"},
        tokenType: {_in: [ERC20]}
      },
      blockchain: ethereum,
      limit: 10
    }
  ) {
    TokenBalance {
      tokenAddress
      amount
      formattedAmount
      owner {
        addresses
      }
    }
  }
}`;

const Earnings = (props: Props) => {
  // const client = new Client({
  //   exchanges: [],
  //   url: "https://bff-prod.airstack.xyz/graphql",
  // });

  // async function getTokenBalance(): Promise<any> {
  //   const response = await client
  //     .query(query, {
  //       request: {
  //         owner: "vitalik.eth",
  //         tokenAddress: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  //       },
  //     })
  //     .toPromise();

  //   console.log("response data: ", response.data);

  //   return response.data as any[];
  // }

  // useEffect(() => {
  //   getTokenBalance();
  // }, []);

  return (
    <Layout>
      <EarningsTable />
    </Layout>
  );
};

export default Earnings;

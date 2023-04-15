import EarningsTable from "@/components/EarningsTable";
import Layout from "@/components/Layout";
import React from "react";

type Props = {};

const earnings = (props: Props) => {
  return (
    <Layout>
      <EarningsTable />
    </Layout>
  );
};

export default earnings;

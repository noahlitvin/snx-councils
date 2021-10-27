import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Container, Heading, Text, Link } from "@chakra-ui/react";
import Council from "../components/Council";
import { ethers } from "ethers";

function refreshOnNetworkChange() {
  // The "any" network will allow spontaneous network changes
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  provider.on("network", (newNetwork, oldNetwork) => {
    if (newNetwork.name !== "homestead") {
      alert("Switch to Mainnet!");
    }
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
      window.location.reload();
    }
  });
}

const NFT_ADDRESSES = [
  "0x023c66b7e13d30a3c46aa433fd2829763d5817c5",
  "0x0c6f93a3ccdb4de4bbab2e3de714ea48bdbaa877",
  "0x04567106db2a4661a5fda9f48719d57b372b77bf",
  "0xf74e828b79636c228683daf5078cc5cececaa37a",
];

const Home = () => {
  useEffect(() => {
    refreshOnNetworkChange();
  }, []);

  return (
    <div>
      <Head>
        <title>Synthetix Councils</title>
      </Head>
      <Container py={20}>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          textAlign="center"
          opacity={0.9}
          letterSpacing={1.5}
        >
          The
        </Text>
        <Heading
          textTransform="uppercase"
          letterSpacing={3}
          fontFamily="GT America"
          fontWeight={700}
          as="h1"
          size="xl"
          mb={7}
          textAlign="center"
        >
          Synthetix Councils
        </Heading>
        <Text textAlign="center" px={4}>
          Synthetix is not a corporation. Councils are{" "}
          <Link
            isExternal
            borderBottom="1px rgba(255,255,255,0.66) dotted"
            borderRadius={1}
            _hover={{
              textDecoration: "none",
              borderBottom: "1px rgba(255,255,255,0.9) dotted",
            }}
            href="https://staking.synthetix.io/gov"
          >
            elected by SNX tokenholders
          </Link>{" "}
          with mandates to support the protocol’s success. The following
          addresses currently hold NFTs that verify their council membership.
        </Text>
        {NFT_ADDRESSES.map((nftAddress, i) => {
          return <Council key={nftAddress} nftAddress={nftAddress} />;
        })}
      </Container>
    </div>
  );
};

export default Home;

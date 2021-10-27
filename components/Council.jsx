import { useEffect, useState } from "react";
import { Box, Heading, Text, Link, Code, Spinner } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import theme from "../styles/theme";

const Council = ({ nftAddress }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [memberAddresses, setMemberAddresses] = useState([]);

  useEffect(() => {
    (async () => {
      const erc721Interface = new ethers.utils.Interface([
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function ownerOf(uint256) view returns (address)",
      ]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const nftContract = new ethers.Contract(
        nftAddress,
        erc721Interface,
        provider
      );

      setName(await nftContract.name());
      setSymbol(await nftContract.symbol());

      const tokenCount = await nftContract.totalSupply();
      let newMemberAddresses = [];
      for (var i = 1; i <= tokenCount; i++) {
        const newAddress = await nftContract.ownerOf(i);

        const result = await fetch(
          `https://api.thegraph.com/subgraphs/name/ensdomains/ens`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query {
              
                account(id: "${newAddress.toLowerCase()}") {
                  domains {
                    name
                  }
                }
              }`,
            }),
          }
        ).then((res) => res.json());

        let ens = [];
        const ensFromGraph = result?.data?.account?.domains;
        if (ensFromGraph) {
          ens = ensFromGraph.map((e) => e.name);
        }

        const ensFromLookup = await provider.lookupAddress(newAddress);
        if (
          ensFromLookup &&
          (!ensFromGraph || !ensFromGraph.includes(ensFromLookup))
        ) {
          ens.push(ensFromLookup);
        }

        newMemberAddresses.push({
          address: newAddress,
          ens: ens,
        });
      }
      setMemberAddresses(newMemberAddresses);
      setLoading(false);
    })();
  }, []);

  return (
    <Box pt={16}>
      {loading ? (
        <Box d="flex" p={10}>
          <Spinner m="auto" size="xl" />
        </Box>
      ) : (
        <>
          <Heading d="inline" size="lg" fontWeight="semibold">
            {name}
          </Heading>
          <Link
            fontSize="sm"
            href={`https://etherscan.io/address/${nftAddress}`}
            isExternal
            borderBottom="1px rgba(255,255,255,0.66) dotted"
            borderRadius={1}
            _hover={{
              textDecoration: "none",
              borderBottom: "1px rgba(255,255,255,0.9) dotted",
            }}
            ml={3}
            d="inline-block"
            lineHeight="1.2"
            transform="translateY(-3px)"
          >
            {symbol} <ExternalLinkIcon transform="translateY(-1.5px)" />
          </Link>

          {memberAddresses.map((member, i) => {
            return (
              <Link
                d="flex"
                alignItems="center"
                p={4}
                borderBottom="1px solid rgba(255,255,255,0.3)"
                key={"member-" + i}
                href={`https://etherscan.io/address/${member.address}`}
                isExternal
                mt={i == 0 && 5}
                borderTop={i == 0 && "1px solid rgba(255,255,255,0.3)"}
                _hover={{
                  textDecoration: "none",
                  background: theme.colors.gray[900],
                }}
              >
                <Box>
                  <Text fontSize="xl" fontWeight="semibold" mb={0.5}>
                    {member.ens.length ? (
                      member.ens[0]
                    ) : (
                      <Text fontWeight="light" opacity={0.66}>
                        No ENS record found
                      </Text>
                    )}
                  </Text>
                  <Code colorScheme="blue" mb={1}>
                    {member.address}
                  </Code>
                </Box>
                <ExternalLinkIcon
                  d="block"
                  ml="auto"
                  boxSize={6}
                  opacity={0.9}
                />
              </Link>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default Council;

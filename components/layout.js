import theme from "../styles/theme";
import {
    Text,
    Box,
} from "@chakra-ui/react";

export default function Layout({ children }) {

    const hasMetaMask = typeof web3 !== "undefined";

    return (
        <>
            {hasMetaMask ? (
                <>{children}</>
            ) : (
                <Text m="auto" py={40} fontWeight="bold" fontSize="3xl" textAlign="center">
                    Install MetaMask
                </Text>
            )}
        </>
    )
}




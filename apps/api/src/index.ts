import Fastify from "fastify";
import { ethers } from "ethers";
import { erc20abi } from "./erc20.abi";
import cors from "@fastify/cors";

type NativeToken = "ETH";
const SUPPORTED_TOKENS = ["USDC", "LINK"] as const;
type SupportedToken = (typeof SUPPORTED_TOKENS)[number];

const ERC20_ADDRESSES: Record<SupportedToken, string> = {
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
};

async function fetchErc20Address(
  provider: ethers.JsonRpcProvider,
  token: SupportedToken,
  address: string
): Promise<string> {
  try {
    const contract = new ethers.Contract(
      ERC20_ADDRESSES[token],
      erc20abi,
      provider
    );
    const balance = await contract.balanceOf(address);
    return balance.toString();
  } catch (error) {
    throw error;
  }
}

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);

const ETH_RPC = "https://ethereum-rpc.publicnode.com";

// Declare a route
fastify.get("/:address", async function (request, reply) {
  const provider = new ethers.JsonRpcProvider(ETH_RPC);
  const address = (request.params as Record<string, string>).address;

  if (typeof address !== "string" || !ethers.isAddress(address)) {
    reply.send({ error: "Invalid ethereum address" });
  }

  const response: Record<
    NativeToken | SupportedToken,
    | {
        balance: string;
        decimals: number;
      }
    | undefined
  > = {
    ETH: { balance: "", decimals: 18 },
    USDC: { balance: "", decimals: 6 },
    LINK: { balance: "", decimals: 18 },
  };

  try {
    const ethBalance = await provider.getBalance(address, "latest");
    if (response["ETH"])
      response["ETH"].balance = ethers.formatEther(ethBalance);
  } catch (error) {
    delete response.ETH;
  }

  for (const token of SUPPORTED_TOKENS) {
    try {
      const balance = await fetchErc20Address(provider, "USDC", address);
      if (response[token])
        response[token].balance = ethers.formatUnits(
          balance,
          response[token].decimals
        );
    } catch (error) {
      delete response[token];
    }
  }

  reply.send(response);
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});

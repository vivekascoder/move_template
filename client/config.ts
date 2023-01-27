import { AptosAccount, AptosClient, BCS, Types } from "aptos";
import dotenv from "dotenv";

const NODES = {
  mainnet: "https://fullnode.mainnet.aptoslabs.com",
  testnet: "https://fullnode.testnet.aptoslabs.com",
  devnet: "https://fullnode.devnet.aptoslabs.com",
  localnet: "http://0.0.0.0:8080",
};

const aptos = new AptosClient(NODES["devnet"]);

const getAccountFromEnv = (s?: string) => {
  dotenv.config();
  let varName: string = "PK";
  if (typeof s !== "undefined") {
    varName = s;
  } else {
    varName = "PK";
  }
  let envVar = process.env[varName];
  if (envVar === undefined) throw "Private key not provided.";
  return AptosAccount.fromAptosAccountObject({
    privateKeyHex: envVar,
  });
};

export const executeFunction = async (
  account: AptosAccount,
  payload: Types.EntryFunctionPayload
) => {
  console.log(`From: ${account.address()}`);
  const transaction = await aptos.generateTransaction(
    account.address(),
    payload
  );
  const signature = await aptos.signTransaction(account, transaction);
  const tx = await aptos.submitTransaction(signature);
  console.log(`Transaction hash:`, tx.hash);
  const result = await aptos.waitForTransactionWithResult(tx.hash);
  console.log("VM Status", (result as any).vm_status);
};

export { getAccountFromEnv, aptos };

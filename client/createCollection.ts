/**
 * # How to run the script.

pnpm ts-node ./createCollection.ts \
    --collection-name "Crowdsale Demo One" \
    --collection-desc "This is a demo collection to test crowdsale" \
    --uri "https://placekitten.com/100/100" \
    --max-supply 3000
**/

import { aptos, getAccountFromEnv } from "./config";
import { AptosAccount, TokenClient } from "aptos";
import { program } from "commander";

const createCollection = async (
  tc: TokenClient,
  acc: AptosAccount,
  collectionName: string,
  collectionDesc: string,
  uri: string,
  maxSupply: number
) => {
  // Create collection.
  return await tc.createCollection(
    acc,
    collectionName,
    collectionDesc,
    uri,
    maxSupply
  );
};

const main = async () => {
  const tokenClient = new TokenClient(aptos);

  program
    .name("Create Collection")
    .version("0.0.1")
    .requiredOption("--collection-name <string>", "Collection name")
    .requiredOption("--collection-desc <string>", "Collection description")
    .requiredOption("--uri <string>", "URI")
    .requiredOption("--max-supply <number>", "Max supply")
    .option(
      "--private-key <string>",
      "If you wanna specify different private key, Otherwise we'll use .env"
    );
  program.parse(process.argv);
  const options = program.opts();

  let privateKey: AptosAccount | undefined = undefined;
  if (options.privateKey) {
    privateKey = AptosAccount.fromAptosAccountObject({
      privateKeyHex: options.privateKey as string,
    });
  } else {
    privateKey = getAccountFromEnv();
  }
  if (!privateKey) {
    throw new Error("No private key provided");
  }

  const data = await createCollection(
    tokenClient,
    privateKey,
    options.collectionName,
    options.collectionDesc,
    options.uri,
    options.maxSupply
  );

  console.log(`Transaction hash:`, data);
  const result = await aptos.waitForTransactionWithResult(data);
  console.log("VM Status", (result as any).vm_status);
};

main();

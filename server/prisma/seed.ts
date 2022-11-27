import { prismaClient } from "../src/config";

async function prismaSeeds() {
  // * Reset All data
  await prismaClient.$transaction([
    prismaClient.$executeRaw`DELETE FROM PostIt`,
    prismaClient.$executeRaw`DELETE FROM User`,
  ]);
}

prismaSeeds().catch((e) => {
  console.log(e);
});

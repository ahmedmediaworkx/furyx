require("reflect-metadata");

const { bootstrap } = require("./dist/server-nest/bootstrap");

bootstrap().catch((error) => {
  console.error("FuryX failed to start");
  console.error(error);
  process.exit(1);
});

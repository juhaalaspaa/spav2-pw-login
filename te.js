#!/usr/bin/env node
const yargs = require("yargs");
const login = require("./login")

// Open AA
yargs.command({
    command: "$0 <env> <user>",
    describe: "Open AA TE on chrome",
  
    handler: async (argv) => {
      await login.toSPAv2(argv.env, argv.user, true);
    }
  });

  yargs.parse();

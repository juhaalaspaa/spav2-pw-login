#!/usr/bin/env node
const yargs = require("yargs");
const login = require("./login")

// Open AA
yargs.command({
    command: "$0 <env> <user>",
    describe: "Open SPAv2 on chrome",
  
    handler: async (argv) => {
      await login.toSPAv2(argv.env, argv.user);
    }
  });

  yargs.parse();

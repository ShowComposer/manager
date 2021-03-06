#!/usr/bin/env node
// Import Utils
import { Logging } from "@hibas123/nodelogging";

// Import process stuff
import child_process = require("child_process");

// Run stuff
Logging.log("ShowComposer is in startup");
// Start Broker
const processBroker = child_process.fork(require.resolve("@showcomposer/broker"));
// Start IO
let processIO;

processBroker.on("message", (m) => {
  if (m.status && m.status === "listening") {
    Logging.log("Broker running, starting modules");
    Logging.log("Starting core-io");
    processIO = child_process.fork(require.resolve("@showcomposer/core-io"));
  }
});

// How to murder childs
process.once("SIGINT", () => {
  processIO.emit("SIGINT");
  processBroker.emit("SIGINT");
  Logging.log("ShowComposer shutting down");
});

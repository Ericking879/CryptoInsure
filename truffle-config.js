module.exports = {
  contracts_build_directory: "./client/contracts",
  networks: {
    loc_ganache_ganache: {
      network_id: "*",
      port: 7545,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.7.0"
    }
  },
  db: {
    enabled: false
  }
};

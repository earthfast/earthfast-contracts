# Earthfast Contracts

Earthfast is a decentralized protocol for managing compute infrastructure and workload orchestration on the blockchain. The protocol consists of several key smart contracts:

- **EarthfastToken (EARTHFAST)**: The protocol's governance token used for staking and voting
- **EarthfastNodes**: Manages registration and verification of compute nodes
- **EarthfastOperators**: Handles node operator staking and rewards
- **EarthfastProjects**: Tracks project deployments and configurations
- **EarthfastReservations**: Manages compute resource reservations and scheduling
- **EarthfastRegistry**: Central registry connecting all protocol contracts
- **EarthfastBilling**: Handles payments and billing for compute usage
- **EarthfastGovernor**: Governance contract for protocol upgrades and parameter changes
- **EarthfastTimelock**: Time-delayed execution of governance decisions

The protocol enables:

- Decentralized compute infrastructure provisioning
- Secure workload orchestration and scheduling
- Transparent billing and payments
- Community governance of protocol parameters
- Incentivized node operation through staking and rewards

All contracts are upgradeable via UUPS proxy pattern and secured through role-based access control.

Payments for compute resources are made in USDC.

## Architecture

See the below diagram for details on how the contracts interact and inherit from each other.

![Contract Inheritance Graph](docs/InheritanceGraph.svg)

## Requirements

- Node 20 - install [manually](https://nodejs.org/en/download/) or using
  [nvm](https://github.com/nvm-sh/nvm#install--update-script)

## Configuration

```shell
$ npm install
$ cp .env.example .env # Edit your keys (optional)
```

## Guidelines

- Run `npm run lint` or `npm run format` before sending code for review.
- Alternatively, install these VS Code plugins to interactively lint and/or format:
  - [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Solidity plugin](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)

## Development

```shell
$ npx hardhat clean
$ npx hardhat compile
$ npx hardhat test # Uses built-in hardhat network
$ npx hardhat test --network localhost # Requires "npx hardhat node" in separate terminal
$ npx hardhat test --network ganache # Requires "npm run ganache" in separate terminal
$ npx hardhat test --grep benchmark # Reports gas usage to reconcile content nodes
$ npx hardhat coverage # Uses built-in hardhat network
$ npx hardhat coverage --network localhost # Requires "npx hardhat node" in separate terminal
$ npx hardhat coverage --network ganache # Uses ganache network ran by solidity-coverage
$ npx hardhat node [--data data/foo.json] # Starts localhost network, seeds contract data
$ npx hardhat --network localhost|testnet-sepolia-staging seed # Uploads dummy programmatic contract data
$ npx hardhat --network localhost|testnet-sepolia-staging deploy [--data data/foo.json] # Deploys everything
$ npx hardhat --network localhost|testnet-sepolia-staging deploy --tags EarthfastNodesImpl # Redeploys a library
$ npx hardhat --network localhost|testnet-sepolia-staging upgrade EarthfastNodes [--libs ...] # Upgrades a proxy
$ npx hardhat size-contracts # Reports contract sizes
$ git commit -a # Commit deployed ABI

# Scripts (must run in scripts/ folder)
$ npx ts-node submitRawTx.ts # sign and submit a raw tx
$ sh abigen.sh # generate golang models for contracts and put them in earthfast-services
$ sh copy-contract-deployments.sh <all|dashboard|keeper|cli> # copy deployment artifacts (address & abi props only) to everywhere they're used like keeper, cli, etc
```

### Production

```shell
$ npx hardhat --network testnet-sepolia-staging|testnet-sepolia upgrade EarthfastNodes [--libs ...] # Upgrades a proxy
$ npx hardhat --network testnet-sepolia-staging|testnet-sepolia deploy [--tags v2] [--data ...] # Runs a migration
$ git commit -a # Commit deployed ABI
```

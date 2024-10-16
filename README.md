# Armada Contracts

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
$ npx hardhat --network localhost|staging seed # Uploads dummy programmatic contract data
$ npx hardhat --network localhost|staging deploy [--data data/foo.json] # Deploys everything
$ npx hardhat --network localhost|staging deploy --tags ArmadaNodesImpl # Redeploys a library
$ npx hardhat --network localhost|staging upgrade ArmadaNodes [--libs ...] # Upgrades a proxy
$ npx hardhat size-contracts # Reports contract sizes
$ git commit -a # Commit deployed ABI
```

### Production

```shell
$ npx hardhat --network staging|testnet upgrade ArmadaNodes [--libs ...] # Upgrades a proxy
$ npx hardhat --network staging|testnet deploy [--tags v2] [--data ...] # Runs a migration
$ git commit -a # Commit deployed ABI
```

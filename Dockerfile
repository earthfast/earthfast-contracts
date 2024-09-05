FROM node:20

WORKDIR /armada-contracts

# Install npm dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Compile contracts
COPY contracts contracts
COPY lib lib
COPY tasks tasks
COPY typechain-types typechain-types
COPY hardhat.config.ts .
RUN npx hardhat compile

# Include the rest of the source (e.g. tests)
COPY . .

ENTRYPOINT ["npx", "hardhat", "node", "--no-deploy"]

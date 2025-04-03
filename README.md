# Decentralized Limit Order Simulator

Welcome to the Decentralized Limit Order Simulator! This project is a demonstration of a decentralized trading platform built on the Solana blockchain. It allows users to place and execute limit orders for tokens like SOL, providing a secure and efficient trading experience.

## Key Features

- **Smart contracts**: Written in Rust using the Anchor framework for high-performance and secure execution.
- **Program Derived Addresses (PDAs)**: Used for secure transaction handling and to ensure the integrity of the trading process.
- **Non-custodial wallet integration**: Users retain control of their private keys, ensuring maximum security.
- **Trading functionality**: Allows users to place and execute limit orders for tokens like SOL.

## Setup Instructions

1. **Install the required dependencies**:
   - Rust: [Installation Guide](https://www.rust-lang.org/tools/install)
   - Solana CLI: [Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)
   - Anchor: [Installation Guide](https://book.anchor-lang.com/getting_started/installation.html)
   - Yarn: [Installation Guide](https://classic.yarnpkg.com/en/docs/install)

2. **Clone the repository**:
   ```
   git clone https://github.com/your-username/limit-order-simulator.git
   cd limit-order-simulator
   ```

3. **Install the project dependencies**:
   ```
   yarn install
   ```

4. **Start a local Solana cluster**:
   ```
   solana-test-validator
   ```

5. **Build the project**:
   ```
   anchor build
   ```

6. **Run the tests**:
   ```
   anchor test
   ```

## Project Structure

- **`programs/`**: Contains the smart contract code written in Rust.
- **`tests/`**: Contains the test scripts for the smart contracts.
- **`migrations/`**: Contains the deployment scripts.
- **`Anchor.toml`**: Configuration file for the Anchor framework.
- **`Cargo.toml`**: Configuration file for the Rust project.

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request. For bug reports or feature requests, please open an issue on the GitHub repository.
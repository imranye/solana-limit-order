import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LimitOrderSimulator } from "../target/types/limit_order_simulator";
import { PublicKey } from "@solana/web3.js";

describe("limit-order-simulator", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.LimitOrderSimulator as Program<LimitOrderSimulator>;
  const provider = anchor.AnchorProvider.env();

  it("Creates a limit order", async () => {
    try {
      const orderId = 1;
      const [orderPda, bump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("order"),
          provider.wallet.publicKey.toBuffer(),
          new anchor.BN(orderId).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );
      console.log(`PDA for orderId ${orderId}: ${orderPda.toBase58()}, Bump: ${bump}`);

      const tx = await program.methods
        .createOrder("SOL", new anchor.BN(1_000_000), new anchor.BN(100), new anchor.BN(orderId))
        .accounts({
          order: orderPda,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc({ skipPreflight: true });
      
      console.log("Create order transaction:", tx);

      // Verify the account was created
      const orderAccount = await program.account.order.fetch(orderPda);
      console.log("Created order account:", orderAccount);
    } catch (e) {
      console.error("Error in create order:", e);
      if (e.logs) console.error("Program logs:", e.logs);
      throw e;
    }
  });

  it("Executes a limit order", async () => {
    try {
      const orderId = 2; // Unique orderId
      const [orderPda, bump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("order"),
          provider.wallet.publicKey.toBuffer(),
          new anchor.BN(orderId).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );
      console.log(`PDA for orderId ${orderId}: ${orderPda.toBase58()}, Bump: ${bump}`);

      // Create the order first
      await program.methods
        .createOrder("SOL", new anchor.BN(1_000_000), new anchor.BN(100), new anchor.BN(orderId))
        .accounts({
          order: orderPda,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc({ skipPreflight: true });

      // Verify order was created
      const orderAccount = await program.account.order.fetch(orderPda);
      console.log("Created order account:", orderAccount);

      // Then execute it
      const tx = await program.methods
        .executeOrder(new anchor.BN(100), new anchor.BN(orderId))
        .accounts({
          order: orderPda,
          user: provider.wallet.publicKey,
        })
        .signers([])
        .rpc({ skipPreflight: true });

      console.log("Execute order transaction:", tx);

      // Verify order was executed
      const executedOrder = await program.account.order.fetch(orderPda);
      console.log("Executed order account:", executedOrder);
    } catch (e) {
      console.error("Error in execute order:", e);
      if (e.logs) console.error("Program logs:", e.logs);
      throw e;
    }
  });
});

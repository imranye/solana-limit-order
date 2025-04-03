use anchor_lang::prelude::*;

declare_id!("3P6a1VTBgj7bdZQavHe4Hpv2SfJxxgzU8ju9Vtct52Pg");

#[program]
pub mod limit_order_simulator {
    use super::*;

    pub fn create_order(
        ctx: Context<CreateOrder>,
        token: String,
        amount: u64,
        limit_price: u64,
        order_id: u64,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        order.owner = *ctx.accounts.user.key;
        order.token = token;
        order.amount = amount;
        order.limit_price = limit_price;
        order.is_executed = false;
        order.order_id = order_id;
        Ok(())
    }

    pub fn execute_order(
        ctx: Context<ExecuteOrder>,
        current_price: u64,
        order_id: u64,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        if order.is_executed {
            return err!(ErrorCode::AlreadyExecuted);
        }
        if current_price != order.limit_price {
            return err!(ErrorCode::PriceMismatch);
        }
        order.is_executed = true;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(token: String, amount: u64, limit_price: u64, order_id: u64)]
pub struct CreateOrder<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 1 + 8,
        seeds = [b"order", user.key().as_ref(), order_id.to_le_bytes().as_ref()],
        bump
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(current_price: u64, order_id: u64)]
pub struct ExecuteOrder<'info> {
    #[account(
        mut,
        seeds = [b"order", user.key().as_ref(), order_id.to_le_bytes().as_ref()],
        bump,
        constraint = order.owner == user.key() @ ErrorCode::InvalidOwner,
    )]
    pub order: Account<'info, Order>,
    pub user: Signer<'info>,
}

#[account]
pub struct Order {
    pub owner: Pubkey,
    pub token: String,
    pub amount: u64,
    pub limit_price: u64,
    pub is_executed: bool,
    pub order_id: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Order has already been executed")]
    AlreadyExecuted,
    #[msg("Current price does not match limit price")]
    PriceMismatch,
    #[msg("Invalid owner")]
    InvalidOwner,
}

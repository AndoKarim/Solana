use solana_program::{
    instruction::{AccountMeta, Instruction},
    program_error::ProgramError,
    pubkey::Pubkey,
};
use std::convert::TryInto;
use std::mem::size_of;

solana_program::declare_id!("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");

#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct SwapInstructionBaseIn {
    // SOURCE amount to transfer, output to DESTINATION is based on the exchange rate
    pub amount_in: u64,
    /// Minimum amount of DESTINATION token to output, prevents excessive slippage
    pub minimum_amount_out: u64,
}

/// Instructions supported by the AmmInfo program.
#[repr(C)]
#[derive(Clone, Debug, PartialEq)]
pub enum AmmInstruction {
    SwapBaseIn(SwapInstructionBaseIn),
}

impl AmmInstruction {
    /// Unpacks a byte buffer into a [AmmInstruction](enum.AmmInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData).unwrap();
        Ok(match tag {
            9 => {
                let (amount_in, rest) = Self::unpack_u64(rest).unwrap();
                let (minimum_amount_out, _rest) = Self::unpack_u64(rest).unwrap();
                Self::SwapBaseIn(SwapInstructionBaseIn {
                    amount_in,
                    minimum_amount_out,
                })
            }
            _ => return Err(ProgramError::InvalidInstructionData.into()),
        })
    }

    fn unpack_u64(input: &[u8]) -> Result<(u64, &[u8]), ProgramError> {
        if input.len() >= 8 {
            let (amount, rest) = input.split_at(8);
            let amount = amount
                .get(..8)
                .and_then(|slice| slice.try_into().ok())
                .map(u64::from_le_bytes)
                .ok_or(ProgramError::InvalidInstructionData).unwrap();
            Ok((amount, rest))
        } else {
            Err(ProgramError::InvalidInstructionData.into())
        }
    }

    /// Packs a [AmmInstruction](enum.AmmInstruction.html) into a byte buffer.
    pub fn pack(&self) -> Result<Vec<u8>, ProgramError> {
        let mut buf = Vec::with_capacity(size_of::<Self>());
        match &*self {
            Self::SwapBaseIn(SwapInstructionBaseIn {
                amount_in,
                minimum_amount_out,
            }) => {
                buf.push(9);
                buf.extend_from_slice(&amount_in.to_le_bytes());
                buf.extend_from_slice(&minimum_amount_out.to_le_bytes());
            }
        }
        Ok(buf)
    }
}

pub fn swap_base_in(
    program_id: &Pubkey,
    amm_id: &Pubkey,
    amm_authority: &Pubkey,
    amm_open_orders: &Pubkey,
    amm_target_orders: &Pubkey,
    pool_coin_token_account: &Pubkey,
    pool_pc_token_account: &Pubkey,
    serum_program_id: &Pubkey,
    serum_market: &Pubkey,
    serum_bids: &Pubkey,
    serum_asks: &Pubkey,
    serum_event_queue: &Pubkey,
    serum_coin_vault_account: &Pubkey,
    serum_pc_vault_account: &Pubkey,
    serum_vault_signer: &Pubkey,
    uer_source_token_account: &Pubkey,
    uer_destination_token_account: &Pubkey,
    user_source_owner: &Pubkey,

    amount_in: u64,
    minimum_amount_out: u64,
) -> Result<Instruction, ProgramError> {
    let data = AmmInstruction::SwapBaseIn(SwapInstructionBaseIn {
        amount_in,
        minimum_amount_out,
    })
    .pack().unwrap();

    let accounts = vec![
        // spl token
        AccountMeta::new_readonly(spl_token::id(), false),
        // amm
        AccountMeta::new(*amm_id, false),
        AccountMeta::new_readonly(*amm_authority, false),
        AccountMeta::new(*amm_open_orders, false),
        AccountMeta::new(*amm_target_orders, false),
        AccountMeta::new(*pool_coin_token_account, false),
        AccountMeta::new(*pool_pc_token_account, false),
        // serum
        AccountMeta::new_readonly(*serum_program_id, false),
        AccountMeta::new(*serum_market, false),
        AccountMeta::new(*serum_bids, false),
        AccountMeta::new(*serum_asks, false),
        AccountMeta::new(*serum_event_queue, false),
        AccountMeta::new(*serum_coin_vault_account, false),
        AccountMeta::new(*serum_pc_vault_account, false),
        AccountMeta::new_readonly(*serum_vault_signer, false),
        // user
        AccountMeta::new(*uer_source_token_account, false),
        AccountMeta::new(*uer_destination_token_account, false),
        AccountMeta::new_readonly(*user_source_owner, true),
    ];

    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use solana_client::rpc_client::RpcClient;
use solana_client::rpc_config::RpcSendTransactionConfig;
use anyhow::{format_err, Result};
use std::str::FromStr;
use spl_associated_token_account::get_associated_token_address;
use spl_associated_token_account::instruction::create_associated_token_account;
use solana_sdk::compute_budget::ComputeBudgetInstruction;
use raydium_contract_instructions::amm_instruction::{ID as ammProgramID, swap_base_in};
use std::env;
use serde::Deserialize;

#[derive(Deserialize)]
struct RaydiumSwapPubkeys {
    amm_id: String,
    amm_open_orders: String,
    amm_target_orders: String,
    pool_coin_token_account: String,
    pool_pc_token_account: String,
    serum_market: String,
    serum_bids: String,
    serum_asks: String,
    serum_event_queue: String,
    serum_coin_vault_account: String,
    serum_pc_vault_account: String,
    serum_vault_signer: String,
    mint: String
}

fn read_keypair_file(s: &str) -> Result<Keypair> {
    solana_sdk::signature::read_keypair_file(s)
        .map_err(|_| format_err!("failed to read keypair from {}", s))
}
fn main() -> Result<()> {
    //quicknode > alchemy > helius > basic
    let rpc_from_file = std::fs::read_to_string("/home/quarch/solana/turbo_raydium/main/src/rpc_quicknode.json").unwrap();
    let rpc = RpcClient::new(rpc_from_file);
    let payer = read_keypair_file("/home/quarch/solana/turbo_raydium/main/src/wallet.json").unwrap();
    let args: Vec<String> = env::args().collect();
    let pubkeys_file = &args[1];
    let file_content = std::fs::read_to_string(pubkeys_file).unwrap();
    let pubkeys: RaydiumSwapPubkeys = serde_json::from_str(&file_content).unwrap();
    let sol_ata = std::fs::read_to_string("/home/quarch/solana/turbo_raydium/main/src/sol_ata.json").unwrap();
    let slippage: u64 = 20;

    if args.len() == 2 {
        let ata_instr = create_associated_token_account(&payer.pubkey(), &payer.pubkey(), &Pubkey::from_str(&pubkeys.mint).unwrap(), &Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap());
        let user_destination_token_account = get_associated_token_address(&payer.pubkey(), &Pubkey::from_str(&pubkeys.mint).unwrap());
        let amount_in: u64 = 1000000;
        let instr = swap_base_in(
            &ammProgramID,
            &Pubkey::from_str(&pubkeys.amm_id).unwrap(),
            &Pubkey::from_str("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1").unwrap(),
            &Pubkey::from_str(&pubkeys.amm_open_orders).unwrap(),
            &Pubkey::from_str(&pubkeys.amm_target_orders).unwrap(),
            &Pubkey::from_str(&pubkeys.pool_coin_token_account).unwrap(),
            &Pubkey::from_str(&pubkeys.pool_pc_token_account).unwrap(),
            &Pubkey::from_str("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX").unwrap(),
            &Pubkey::from_str(&pubkeys.serum_market).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_bids).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_asks).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_event_queue).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_coin_vault_account).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_pc_vault_account).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_vault_signer).unwrap(),
            &Pubkey::from_str(&sol_ata).unwrap(),
            &user_destination_token_account,
            &payer.pubkey(),
            amount_in,
            (((amount_in * (100 - slippage)) as f64) * 0.01) as u64,
        ).unwrap();
        let instructions = vec![ComputeBudgetInstruction::set_compute_unit_price(1), ata_instr, instr];
        let signers = vec![&payer];
        let recent_hash = rpc.get_latest_blockhash().unwrap();
        let txn = Transaction::new_signed_with_payer(
            &instructions,
            Some(&payer.pubkey()),
            &signers,
            recent_hash,
        );
        rpc.send_transaction_with_config(
            &txn,
            RpcSendTransactionConfig {
                skip_preflight: true,
                ..RpcSendTransactionConfig::default()
            },
        ).unwrap();
    } else {
        let user_destination_token_account = get_associated_token_address(&payer.pubkey(), &Pubkey::from_str(&pubkeys.mint).unwrap());
        let balance = RpcClient::get_token_account_balance(&rpc, &user_destination_token_account).unwrap();
        let sell_percent: u64 = args[2].parse().unwrap();
        let amount_in = match balance.ui_amount {
            Some(value) => ((value / (balance.decimals as f64) * 0.01) as u64) * sell_percent,
            None => 0,
        };
        let instr = swap_base_in(
            &ammProgramID,
            &Pubkey::from_str(&pubkeys.amm_id).unwrap(),
            &Pubkey::from_str("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1").unwrap(),
            &Pubkey::from_str(&pubkeys.amm_open_orders).unwrap(),
            &Pubkey::from_str(&pubkeys.amm_target_orders).unwrap(),
            &Pubkey::from_str(&pubkeys.pool_coin_token_account).unwrap(),
            &Pubkey::from_str(&pubkeys.pool_pc_token_account).unwrap(),
            &Pubkey::from_str("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX").unwrap(),
            &Pubkey::from_str(&pubkeys.serum_market).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_bids).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_asks).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_event_queue).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_coin_vault_account).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_pc_vault_account).unwrap(),
            &Pubkey::from_str(&pubkeys.serum_vault_signer).unwrap(),
            &user_destination_token_account,
            &Pubkey::from_str(&sol_ata).unwrap(),
            &payer.pubkey(),
            amount_in,
            (((amount_in * (100 - slippage)) as f64) * 0.01) as u64,
        ).unwrap();
        let instructions = vec![ComputeBudgetInstruction::set_compute_unit_price(1), instr];
        let signers = vec![&payer];
        let recent_hash = rpc.get_latest_blockhash().unwrap();
        let txn = Transaction::new_signed_with_payer(
            &instructions,
            Some(&payer.pubkey()),
            &signers,
            recent_hash,
        );
        rpc.send_transaction_with_config(
            &txn,
            RpcSendTransactionConfig {
                skip_preflight: true,
                ..RpcSendTransactionConfig::default()
            },
        ).unwrap();
    }

    Ok(())

}

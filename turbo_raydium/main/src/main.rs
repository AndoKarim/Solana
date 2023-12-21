use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_client::rpc_client::RpcClient;
use solana_client::rpc_config::RpcSendTransactionConfig;
use anyhow::{format_err, Result};
use std::str::FromStr;
use solana_sdk::compute_budget::ComputeBudgetInstruction;
use raydium_contract_instructions::amm_instruction::{ID as ammProgramID, swap_base_in};

fn read_keypair_file(s: &str) -> Result<Keypair> {
    solana_sdk::signature::read_keypair_file(s)
        .map_err(|_| format_err!("failed to read keypair from {}", s))
}
fn main() -> Result<()> {
    //quicknode > alchemy > helius > basic
    let rpc = RpcClient::new("https://cold-small-bridge.solana-mainnet.quiknode.pro/6a33be020e8e0198325b485591049affb92cc13b/".to_string());
    let payer = read_keypair_file("/home/quarch/solana/turbo_raydium/main/src/wallet.json").unwrap();

    let instr = swap_base_in(
        &ammProgramID,
        &Pubkey::from_str("6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg").unwrap(),
        &Pubkey::from_str("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1").unwrap(),
        &Pubkey::from_str("CSCS9J8eVQ4vnWfWCx59Dz8oLGtcdQ5R53ea4V9o2eUp").unwrap(),
        &Pubkey::from_str("3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT").unwrap(),
        &Pubkey::from_str("FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th").unwrap(),
        &Pubkey::from_str("Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk").unwrap(),
        &Pubkey::from_str("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX").unwrap(),
        &Pubkey::from_str("DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj").unwrap(),
        &Pubkey::from_str("CXMRrGEseppLPmzYJsx5vYwTkaDEag4A9LJvgrAeNpF").unwrap(),
        &Pubkey::from_str("27BrDDYtv9NDQCALCNnDqe3BqjYkgiaQwKBbyqCA8p8B").unwrap(),
        &Pubkey::from_str("EkKZwBeKWPvhraYERfUNr2fdh1eazrbTrQXYkRZs24XB").unwrap(),
        &Pubkey::from_str("7ssdQJxVAEBSigoJovgHcchwcEQFPPtYbyzLHDHEewKM").unwrap(),
        &Pubkey::from_str("EBGFfeQ5dVwW4HxtShVbh8aCh2fKJ1r2qXBoa6teUve6").unwrap(),
        &Pubkey::from_str("HYfri5vWyYiDziQeprFErUTbrWdUnkfAFnAAGApZjdGv").unwrap(),
        &Pubkey::from_str("4Wh1mwRtV8yzGRypR94QzFAkYQM9fmFbN3dNJJWd7ZhU").unwrap(),
        &Pubkey::from_str("Gn8rHjCS5Ccjf6hx76vFA4bMyBdcZ4YxPGzB2xbiA523").unwrap(),
        &payer.pubkey(),
        1000000,
        880000,
    ).unwrap();
    let instructions = vec![ComputeBudgetInstruction::set_compute_unit_price(20000000), instr];
    let signers = vec![&payer];
    let recent_hash = rpc.get_latest_blockhash().unwrap();
    let txn = Transaction::new_signed_with_payer(
        &instructions,
        Some(&payer.pubkey()),
        &signers,
        recent_hash,
    );

    rpc.send_and_confirm_transaction_with_spinner_and_config(
        &txn,
        CommitmentConfig::processed(),
        RpcSendTransactionConfig {
            skip_preflight: true,
            ..RpcSendTransactionConfig::default()
        },
    ).unwrap();
    Ok(())

}

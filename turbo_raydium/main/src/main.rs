use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_client::rpc_client::RpcClient;
use solana_client::rpc_config::RpcSendTransactionConfig;
use anyhow::{format_err, Result};
use std::str::FromStr;
//use solana_sdk::compute_budget::ComputeBudgetInstruction;
use raydium_contract_instructions::amm_instruction::{ID as ammProgramID, swap_base_in};

fn read_keypair_file(s: &str) -> Result<Keypair> {
    solana_sdk::signature::read_keypair_file(s)
        .map_err(|_| format_err!("failed to read keypair from {}", s))
}
fn main() -> Result<()> {
    //quicknode > alchemy > helius > basic
    let rpc = RpcClient::new("https://cold-small-bridge.solana-mainnet.quiknode.pro/6a33be020e8e0198325b485591049affb92cc13b/".to_string());
    let payer = read_keypair_file("/home/quarch/solana/turbo_raydium/main/src/wallet.json").unwrap();

    let pubkey_a = Pubkey::from_str("6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg").unwrap();
    let pubkey_b = Pubkey::from_str("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1").unwrap();
    let pubkey_c = Pubkey::from_str("CSCS9J8eVQ4vnWfWCx59Dz8oLGtcdQ5R53ea4V9o2eUp").unwrap();
    let pubkey_d = Pubkey::from_str("3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT").unwrap();
    let pubkey_e = Pubkey::from_str("FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th").unwrap();
    let pubkey_f = Pubkey::from_str("Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk").unwrap();
    let pubkey_g = Pubkey::from_str("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX").unwrap();
    let pubkey_h = Pubkey::from_str("DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj").unwrap();
    let pubkey_i = Pubkey::from_str("CXMRrGEseppLPmzYJsx5vYwTkaDEag4A9LJvgrAeNpF").unwrap();
    let pubkey_j = Pubkey::from_str("27BrDDYtv9NDQCALCNnDqe3BqjYkgiaQwKBbyqCA8p8B").unwrap();
    let pubkey_k = Pubkey::from_str("EkKZwBeKWPvhraYERfUNr2fdh1eazrbTrQXYkRZs24XB").unwrap();
    let pubkey_l = Pubkey::from_str("7ssdQJxVAEBSigoJovgHcchwcEQFPPtYbyzLHDHEewKM").unwrap();
    let pubkey_m = Pubkey::from_str("EBGFfeQ5dVwW4HxtShVbh8aCh2fKJ1r2qXBoa6teUve6").unwrap();
    let pubkey_n = Pubkey::from_str("HYfri5vWyYiDziQeprFErUTbrWdUnkfAFnAAGApZjdGv").unwrap();
    let pubkey_o = Pubkey::from_str("4Wh1mwRtV8yzGRypR94QzFAkYQM9fmFbN3dNJJWd7ZhU").unwrap();
    let pubkey_p = Pubkey::from_str("Gn8rHjCS5Ccjf6hx76vFA4bMyBdcZ4YxPGzB2xbiA523").unwrap();

    let instr = swap_base_in(
        &ammProgramID,
        &pubkey_a,
        &pubkey_b,
        &pubkey_c,
        &pubkey_d,
        &pubkey_e,
        &pubkey_f,
        &pubkey_g,
        &pubkey_h,
        &pubkey_i,
        &pubkey_j,
        &pubkey_k,
        &pubkey_l,
        &pubkey_m,
        &pubkey_n,
        &pubkey_o,
        &pubkey_p,
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

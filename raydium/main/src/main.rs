
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::Transaction;
use solana_sdk::commitment_config::CommitmentConfig;

use solana_client::rpc_client::RpcClient;
use solana_client::rpc_config::RpcSendTransactionConfig;

use spl_associated_token_account::get_associated_token_address;

use anyhow::{format_err, Result};

use std::str::FromStr;


use raydium_contract_instructions::{
    amm_instruction::{ID as ammProgramID, swap_base_in as amm_swap},
    // stable_instruction::{ID as stableProgramID, swap_base_in as stable_swap},
};


fn read_keypair_file(s: &str) -> Result<Keypair> {
    solana_sdk::signature::read_keypair_file(s)
        .map_err(|_| format_err!("failed to read keypair from {}", s))
}


fn main() -> Result<()> {
    println!("start ...");
    
    let rpc = RpcClient::new("https://api.mainnet-beta.solana.com".to_string() );

    let payer = read_keypair_file("/home/quarch/solana/raydium/main/src/id.json")?;
    // should create the spl ata accounts first if not exist
    let user_ray_account = get_associated_token_address(&payer.pubkey(), 
        &Pubkey::from_str("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R")?);
        
    let user_usdc_account = get_associated_token_address(&payer.pubkey(), 
        &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")?);
        
    // let user_usdt_account = get_associated_token_address(&payer.pubkey(), 
    //     &Pubkey::from_str("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")?);


    // https://api.raydium.io/v2/sdk/liquidity/mainnet.json
    // RAY-USDC
    // {
    //     "id":"6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg",
    //     "baseMint":"4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    //     "quoteMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    //     "lpMint":"FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m",
    //     "baseDecimals":6,"quoteDecimals":6,"lpDecimals":6,"version":4,
    //     "programId":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    //     "authority":"5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
    //     "openOrders":"CSCS9J8eVQ4vnWfWCx59Dz8oLGtcdQ5R53ea4V9o2eUp",
    //     "targetOrders":"3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT",
    //     "baseVault":"FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th",
    //     "quoteVault":"Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk",
    //     "withdrawQueue":"ERiPLHrxvjsoMuaWDWSTLdCMzRkQSo8SkLBLYEmSokyr",
    //     "lpVault":"D1V5GMf3N26owUFcbz2qR5N4G81qPKQvS2Vc4SM73XGB",
    //     "marketVersion":4,
    //     "marketProgramId": "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
    //     "marketId": "DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj",
    //     "marketAuthority": "HYfri5vWyYiDziQeprFErUTbrWdUnkfAFnAAGApZjdGv",
    //     "marketBaseVault": "7ssdQJxVAEBSigoJovgHcchwcEQFPPtYbyzLHDHEewKM",
    //     "marketQuoteVault": "EBGFfeQ5dVwW4HxtShVbh8aCh2fKJ1r2qXBoa6teUve6",
    //     "marketBids": "CXMRrGEseppLPmzYJsx5vYwTkaDEag4A9LJvgrAeNpF",
    //     "marketAsks": "27BrDDYtv9NDQCALCNnDqe3BqjYkgiaQwKBbyqCA8p8B",
    //     "marketEventQueue": "EkKZwBeKWPvhraYERfUNr2fdh1eazrbTrQXYkRZs24XB",
    // },

    let instr = amm_swap(
        &ammProgramID,
        &Pubkey::from_str("6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg")?,
        &Pubkey::from_str("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1")?,
        &Pubkey::from_str("CSCS9J8eVQ4vnWfWCx59Dz8oLGtcdQ5R53ea4V9o2eUp")?,
        &Pubkey::from_str("3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT")?,
        &Pubkey::from_str("FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th")?,
        &Pubkey::from_str("Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk")?,

        &Pubkey::from_str("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX")?,
        &Pubkey::from_str("DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj")?,
        &Pubkey::from_str("CXMRrGEseppLPmzYJsx5vYwTkaDEag4A9LJvgrAeNpF")?,
        &Pubkey::from_str("27BrDDYtv9NDQCALCNnDqe3BqjYkgiaQwKBbyqCA8p8B")?,
        &Pubkey::from_str("EkKZwBeKWPvhraYERfUNr2fdh1eazrbTrQXYkRZs24XB")?,

        &Pubkey::from_str("7ssdQJxVAEBSigoJovgHcchwcEQFPPtYbyzLHDHEewKM")?,
        &Pubkey::from_str("EBGFfeQ5dVwW4HxtShVbh8aCh2fKJ1r2qXBoa6teUve6")?,
        &Pubkey::from_str("HYfri5vWyYiDziQeprFErUTbrWdUnkfAFnAAGApZjdGv")?,

        &user_ray_account,
        &user_usdc_account,
        &payer.pubkey(),

        100000,
        80000
    )?;
    

    let instructions = vec![instr];
    let signers = vec![&payer];
    let recent_hash = rpc.get_latest_blockhash()?;
    let txn = Transaction::new_signed_with_payer(
        &instructions,
        Some(&payer.pubkey()),
        &signers,
        recent_hash,
    );

    let signature = rpc.send_and_confirm_transaction_with_spinner_and_config(
        &txn,
        CommitmentConfig::confirmed(),
        RpcSendTransactionConfig {
            skip_preflight: true,
            ..RpcSendTransactionConfig::default()
        },
    )?;

    println!("amm swap send txn: {}.", signature);

    Ok(())
}

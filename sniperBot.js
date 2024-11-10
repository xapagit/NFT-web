// Privk
// Load wallet private key securely from environment variables
const privateKey = process.env.PRIVATE_KEY; 

// Convert the private key string to Uint8Array format (if it's in a comma-separated string 
form)
const walletPrivateKey = Uint8Array.from(privateKey.split(',').map(Number));

// Load wallet keypair
const Keypair = require('@solana/web3.js').Keypair;
const walletKeypair = Keypair.fromSecretKey(walletPrivateKey);

// Your Web3 provider setup
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Account initialization using the private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Rest of your bot logic here...


const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const axios = require('axios');

const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com'; // Solana RPC URL
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Wallet private key (should be securely loaded from environment or key management service)
const walletPrivateKey = new Uint8Array([/* your wallet private key array here */]);

// Load wallet keypair
const Keypair = require('@solana/web3.js').Keypair;
const walletKeypair = Keypair.fromSecretKey(walletPrivateKey);

// Rugcheck API & GetMoni API endpoints
const RUGCHECK_API = 'https://api.rugcheck.xyz/token/';
const GETMONI_API = 'https://api.getmoni.io/social/';

// Set your buy and sell parameters
const BUY_AMOUNT = 0.02; // SOL amount to buy
const MIN_SELL_AMOUNT = 0.03; // SOL amount to trigger selling
const MIN_LIQUIDITY = 5000; // Minimum liquidity
const MIN_MARKET_CAP = 100000; // Minimum market cap

// Helper function to check if token is secure using Rugcheck API
async function checkRugPull(tokenAddress) {
  try {
    const response = await axios.get(`${RUGCHECK_API}${tokenAddress}`);
    return response.data.isSecure; // Returns true if token is secure
  } catch (error) {
    console.error("Error checking RugPull:", error);
    return false;
  }
}

// Helper function to check social media signals using GetMoni API
async function checkSocialMedia(tokenAddress) {
  try {
    const response = await axios.get(`${GETMONI_API}${tokenAddress}`);
    return response.data.signal; // Returns social media engagement score
  } catch (error) {
    console.error("Error checking social media:", error);
    return false;
  }
}

// Function to buy the token
async function buyToken(tokenAddress) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: walletKeypair.publicKey,
      toPubkey: new PublicKey(tokenAddress),
      lamports: BUY_AMOUNT * 10 ** 9, // Convert SOL to lamports
    })
  );

  const signature = await connection.sendTransaction(transaction, [walletKeypair]);
  console.log(`Purchased token at ${tokenAddress}. Transaction signature: ${signature}`);
}

// Function to sell the token based on liquidity and market cap
async function sellToken(tokenAddress) {
  // Logic to fetch market cap and liquidity here (API-dependent)
  const marketCap = await getMarketCap(tokenAddress);
  const liquidity = await getLiquidity(tokenAddress);

  if (liquidity > MIN_LIQUIDITY && marketCap > MIN_MARKET_CAP) {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(tokenAddress),
        toPubkey: walletKeypair.publicKey,
        lamports: MIN_SELL_AMOUNT * 10 ** 9, // Convert SOL to lamports
      })
    );
    const signature = await connection.sendTransaction(transaction, [walletKeypair]);
    console.log(`Sold token at ${tokenAddress}. Transaction signature: ${signature}`);
  } else {
    console.log(`Conditions not met for selling token ${tokenAddress}`);
  }
}

// Main sniper function
async function sniperBot() {
  const tokens = await getLivestreamTokens();
  
  for (const token of tokens) {
    const rugCheck = await checkRugPull(token);
    const socialCheck = await checkSocialMedia(token);

    if (rugCheck && socialCheck) {
      await buyToken(token);
      await sellToken(token);
    }
  }
}

// Placeholder function to get tokens with livestream and viewers > 25
async function getLivestreamTokens() {
  // Replace this with actual API call to Pump.fun
  return ['tokenAddress1', 'tokenAddress2']; // Example token addresses
}

// Placeholder for fetching liquidity and market cap data
async function getLiquidity(tokenAddress) {
  return 10000; // Example liquidity
}

async function getMarketCap(tokenAddress) {
  return 200000; // Example market cap
}

// Run the bot
sniperBot();



const web3 = require('@solana/web3.js');
const storage = require('node-persist');
const base58 = require('bs58');
const {TransactionDB} = require('../utils/transaction');

const connection = new web3.Connection(process.env.RPC_URL);
const SOL = "So11111111111111111111111111111111111111112";

const trasnferSolToAdmin =  async (chatId, userName, amount) => {
    let user_pub_key;
    let user_pri_key;
    let user_secret_key;
    try{
    const lamportsAmount = Math.floor(web3.LAMPORTS_PER_SOL * amount);
    console.log("transfer amount:", lamportsAmount, typeof lamportsAmount);

    await storage.getItem(`userWallet_${chatId}`).then(async (userWallet) => {
        user_pub_key = userWallet.publicKey;
        user_pri_key = userWallet.privateKey;
        user_secret_key = web3.Keypair.fromSecretKey(base58.decode(user_pri_key));
    });

    const balance = await connection.getBalance(new web3.PublicKey(user_pub_key));
    const walletbalance = balance / web3.LAMPORTS_PER_SOL;

    console.log('params:', user_pri_key, user_pub_key, walletbalance)

    const destinationAddress = process.env.ADMIN_WALLET;

    const destinationPublicKey = new web3.PublicKey(destinationAddress);
    

    if (web3.PublicKey.isOnCurve(new web3.PublicKey(destinationAddress))) {
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(user_pub_key),
                toPubkey: destinationPublicKey,
                lamports: lamportsAmount
            })
        );

        try {
            const signature = await web3.sendAndConfirmTransaction(connection, transaction, [user_secret_key]);
            await saveTransactionHistory(chatId, userName, SOL,signature, amount, 'Transfer')
            const sig_text = `Admin Transaction confirmed, Transaction ID:\n <a href="https://solscan.io/tx/${signature}">${signature}</a>`;
            console.log('admin transfer:', sig_text);
        } catch (error) {
            console.log(`Error withdrawing SOL: ${error.message}`);
        }
    }
} catch(error){
    console.log("error:", error);
}
}

const saveTransactionHistory = async (userId, username, tokenAddress, txId, amount, type) => {
    const transactionData = new TransactionDB({
        userId,
        username,
        tokenAddress,
        txId,
        amount,
        timestamp: new Date().toISOString(),
        type
    });

    try {
        await transactionData.save();
        console.log('Transaction history saved:', transactionData);
    } catch (error) {
        console.error('Error saving transaction history:', error);
    }
};
module.exports = {
    trasnferSolToAdmin
}
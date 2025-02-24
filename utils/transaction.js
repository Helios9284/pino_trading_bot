// Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    tokenAddress: { type: String, required: true },
    txId: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    type: {type: String, required:true}
});

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    walletAddress: { type: String, required: true },
    walletPrivateKey: { type: String, required: true },
});

const TransactionDB = mongoose.model('Transaction', transactionSchema);
const UserDB = mongoose.model('users', userSchema);

module.exports = {
    TransactionDB,
    UserDB
};

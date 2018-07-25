const Transaction = require('./transaction.model');
const Account = require('../account/account.model');
/**
 * Load transaction and append to req.
 */
function load(req, res, next, id) {
  Transaction.get(id)
    .then((transaction) => {
      req.transaction = transaction; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get transaction
 * @returns {Transaction}
 */
function get(req, res) {
  return res.json(req.transaction);
}


function findSender(senderId) {
  return new Promise((resolve, reject) => {
    Account.findOne({ _id: senderId })
      .then(result => resolve(result))
      .catch(() => reject(new Error('Bank not found!')));
  });
}


function findReceiver(receiverId) {
  return new Promise((resolve, reject) => {
    Account.findOne({ _id: receiverId })
      .then(result => resolve(result))
      .catch(() => reject(-1));
  });
}

function findTransaction(transactionId) {
  return new Promise((resolve, reject) => {
    Transaction.findOne({ _id: transactionId })
      .then(result => resolve(result))
      .catch(() => reject(-1));
  });
}


function create(req, res, next) {
  let sender;
  let receiver;
  return Promise.all([findSender(req.body.senderid), findReceiver(req.body.receiverid)])
    .then((clients) => {
      sender = clients[0];
      receiver = clients[1];
      if (sender.balance >= req.body.amount) {
        createTransaction();
        updateBalance();
      } else res.send("insufficient balance in sender's account");
    });
  function createTransaction() {
    const transaction = new Transaction({
      to: sender._id,
      from: receiver._id,
      amount: req.body.amount
    });
    transaction.save((err) => {
      if (err) res.send(err);
    });
  }
  function updateBalance() {
    sender.balance -= req.body.amount;
    receiver.balance += req.body.amount;
    sender.save()
      .then(savedTransaction => console.log(savedTransaction))
      .catch(e => next(e));
    receiver.save()
      .then(savedTransaction => console.log(savedTransaction))
      .catch(e => next(e));
  }
}

/**
 * Update existing transaction
 * @property {string} req.body.owner - The owner of transaction.
 * @property {Number} req.body.balance - The balance of transaction.
 * @returns {Transaction}
 */

function update(req, res, next) {
  let sender;
  let receiver;
  const transactionUpdate = req.body;
  let transaction;


  return Promise.all([findSender(transactionUpdate.from), findReceiver(transactionUpdate.to),
    findTransaction(transactionUpdate._id)])
    .then((resolve) => {
      sender = resolve[0];
      receiver = resolve[1];
      transaction = resolve[2];
      // update account balances in database
      sender.balance += transaction.amount;
      sender.balance -= req.body.amount;
      receiver.balance -= transaction.amount;
      receiver.balance += req.body.amount;
      transaction.amount = req.body.amount;
      sender.save()
      .then(savedTransaction => console.log(savedTransaction))
      .catch(e => next(e));
      receiver.save()
      .then(savedTransaction => console.log(savedTransaction))
      .catch(e => next(e));
      transaction.save()
        .then(savedTransaction => console.log(savedTransaction))
        .catch(e => next(e));
    });
}


/**
 * Get transaction list.
 * @property {number} req.query.skip - Number of transactions to be skipped.
 * @property {number} req.query.limit - Limit number of transactions to be returned.
 * @returns {Transaction[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Transaction.list({ limit, skip })
    .then(transactions => res.json(transactions))
    .catch(e => next(e));
}

/**
 * Delete transaction.
 * @returns {transaction}
 */
function remove(req, res, next) {
  const transaction = req.transaction;
  transaction.remove()
    .then(deletedTransaction => res.json(deletedTransaction))
    .catch(e => next(e));
}

module.exports = { load, get, update, create, list, remove };

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

/**
 * Create new transaction
 * @property {string} req.body.owner - The owner of transaction.
 * @property {Number} req.body.balance - The balance of transaction.
 * @returns {Transaction}
 */
function findSender(senderId) {
  return new Promise((resolve, reject) => {
    Account.findOne({ _id: senderId })
      .then(result => resolve(result))
      .catch(() => reject(new Error('Bank not found!')));
  });
}

/**
 * @param {string} customerId - The ID of the bank that is going to be validated from the database
 * @returns {Promise<any>}
 */
function findReceiver(receiverId) {
  return new Promise((resolve, reject) => {
    Account.findOne({ _id: receiverId })
      .then(result => resolve(result))
      .catch(() => reject(-1));
  });
}
function createTransaction(s, r,a) {
  const transaction = new Transaction({
    to: r._id,
    from: s._id,
    amount: a
  });
  transaction.save((err) => {
    if (err) res.send(err);
  });
}
function updateBalance(s, r, a) {
  s.balance = s.balance - a;
  r.balance = r.balance + a;
  s.save()
    .then(savedTransaction => console.log(savedTransaction))
    .catch(e => next(e));
  r.save()
    .then(savedTransaction => console.log(savedTransaction))
    .catch(e => next(e));
}

function create(req, res, next) {
    let amount = req.body.amount;
    let sender;
    let receiver;
  findSender(req.body.senderid)
      .then((senderF) => {
        sender = senderF;
        findReceiver(req.body.receiverid)
          .then((receiverF) => {
            receiver = receiverF;
            if (sender.balance >= req.body.amount) {
              createTransaction(sender, receiver, amount);
              updateBalance(sender, receiver, amount);
            }
            else res.send("insufficient balance in sender's account");
          });
      });

}

/**
 * Update existing transaction
 * @property {string} req.body.owner - The owner of transaction.
 * @property {Number} req.body.balance - The balance of transaction.
 * @returns {Transaction}
 */



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

module.exports = { load, get, create, update, list, remove };

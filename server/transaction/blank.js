/*const Transaction = require('./transaction.model');
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
 * @property {string} req.body.from - ID of the sender
 * @property {string} req.body.to - ID of the receiver
 * @property {Number} req.body.amount - The balance of the created transaction will have
 * @returns {Transaction}
 */
function create(req, res, next) {
  const transaction = new Transaction({
    owner: req.body.owner,
    bank: req.body.from,
    balance: req.body.amount
  });
  transaction.save()
    .then(savedTransaction => res.json(savedTransaction))
    .catch(e => next(e));
}
/**
 * Update existing transaction
 * @property {Number} req.body.amount - The balance of transaction.
 * @returns {Transaction}
 */

// you can update transaction balance
function update(req, res, next) {
  const transaction = req.transaction;
  transaction.amount = req.body.amount;

  transaction.save()
    .then(savedTransaction => res.json(savedTransaction))
    .catch(e => next(e));
}

/**
 * Get transaction list.
 * @property {Number} req.query.skip - Number of transactions to be skipped.
 * @property {Number} req.query.limit - Limit number of transactions to be returned.
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
 * @property {Transaction} req.transaction - The transaction that is going to be deleted
 * @returns {Transaction}
 */
function remove(req, res, next) {
  const transaction = req.transaction;
  transaction.remove()
    .then(deletedTransaction => res.json(deletedTransaction))
    .catch(e => next(e));
}

// module.exports = { load, get, create, update, list, remove };

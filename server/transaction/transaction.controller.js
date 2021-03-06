const Transaction = require('./transaction.model');

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
 * @property {string} req.body.from - The sender of transaction.
 * @property {string} req.body.to - The receiver of transaction.
 * @property {string} req.body.amount - The amount of transaction.
 * @returns {Transaction}
 */
function create(req, res, next) {
  const transaction = new Transaction({
    from: req.body.from,
    to: req.body.to,
    amount: req.body.amount
  });

  transaction.save()
    .then(savedTransaction => res.json(savedTransaction))
    .catch(e => next(e));
}

/**
 * Update existing transaction
 * @property {string} req.body.from - The sender of transaction.
 * @property {string} req.body.to - The receiver of transaction.
 * @property {string} req.body.amount - The amount of transaction.
 * @returns {Transaction}
 */
function update(req, res, next) {
  const transaction = req.transaction;
  transaction.from = req.body.from;
  transaction.to = req.body.to;
  transaction.amount = req.body.amount;

  transaction.save()
    .then(savedTransaction => res.json(savedTransaction))
    .catch(e => next(e));
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

module.exports = { load, get, create, update, list, remove };

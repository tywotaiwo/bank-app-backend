const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Transaction APIs', () => {
  let transaction = {
    from: '5b5835b5f7886e981ce37f35',
    to: '5b5835b5f7886e981ce37f36',
    amount: 38.32
  };

  describe('# POST /api/transactions', () => {
    it('should create a new transaction', (done) => {
      request(app)
        .post('/api/transactions')
        .send(transaction)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.from).to.equal(transaction.from);
          expect(res.body.to).to.equal(transaction.to);
          expect(res.body.amount).to.equal(transaction.amount);
          transaction = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/transactions/:transactionId', () => {
    it('should get transaction details', (done) => {
      request(app)
        .get(`/api/transactions/${transaction._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.from).to.equal(transaction.from);
          expect(res.body.to).to.equal(transaction.to);
          expect(res.body.amount).to.equal(transaction.amount);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when transaction does not exists', (done) => {
      request(app)
        .get('/api/transactions/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/transactions/:transactionId', () => {
    it('should update transaction details', (done) => {
      transaction.amount = 40;
      request(app)
        .put(`/api/transactions/${transaction._id}`)
        .send(transaction)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.amount).to.equal(40);
          expect(res.body.from).to.equal(transaction.from);
          expect(res.body.to).to.equal(transaction.to);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/transactions/', () => {
    it('should get all transactions', (done) => {
      request(app)
        .get('/api/transactions')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all transactions (with limit and skip)', (done) => {
      request(app)
        .get('/api/transactions')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/transactions/transactionId', () => {
    it('should delete transaction', (done) => {
      request(app)
        .delete(`/api/transactions/${transaction._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.amount).to.equal(40);
          expect(res.body.from).to.equal(transaction.from);
          expect(res.body.to).to.equal(transaction.to);
          done();
        })
        .catch(done);
    });
  });

});

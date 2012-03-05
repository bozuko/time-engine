var assert = require('assert')
    results = require('../lib/results');

describe('clean db', function() {
  it('should not return an error', function(done) {
    results.db.deleteItem({
      TableName: 'results',
      Key: {HashKeyElement: {S: '12345'}, RangeKeyElement: {N: '100'}}
    }, function(err) {
      assert.ok(!err);
      done();
    });
  });
});

describe('save a result', function() {
  it('should not return an error', function(done) {
    results.save({contest_id: '12345', timestamp: 75}, function(err) {
      assert.ok(!err);
      done();
    });
  });
});

describe('query for results with no lookback window', function() {
  it('should return 1 result', function(done) {
    results.query({contest_id: '12345', timestamp: 100}, function(err, _results) {
      assert.ok(!err);
      assert.equal(_results.length, 1);
      assert.equal(_results[0].timestamp, 75);
      done();
    });
  });
});

describe('query for results with lookback window', function() {
  it('should return 1 result', function(done) {
    results.query({contest_id: '12345', timestamp: 100, max_lookback: 50}, function(err, _results) {
      assert.ok(!err);
      assert.equal(_results.length, 1);
      assert.equal(_results[0].timestamp, 75);
      done();
    });
  });
});

describe('query for results outside lookback window', function() {
  it('should return 0 results', function(done) {
    results.query({contest_id: '12345', timestamp: 130, max_lookback: 80}, function(err, _results) {
      assert.ok(!err);
      assert.equal(_results.length, 0);
      done();
    });
  });
});

describe('update result for a win', function() {
  it('should set a win_time and user_id', function(done) {
    results.update({
      key: {contest_id: '12345', timestamp: 75}, 
      put: {user_id: 'user1', win_time: 102}
    }, function(err) {
      assert.ok(!err);
      results.get({contest_id: '12345', timestamp: 75}, function(err, item) {
        assert.ok(!err);
        assert.equal(item.user_id, 'user1');
        assert.equal(item.win_time, 102);
        done();
      });
    });
  });
});

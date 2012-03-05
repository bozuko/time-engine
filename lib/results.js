var Schema = require('dynamo-schema');
var dynamo = require('dynamo');

var schema = new Schema({
  contest_id: 'S',
  timestamp: 'N',
  user_id: 'S',
  page_id: 'S',
  page_prize: 'N',
  prize_index: 'N',
  prize_code: 'S',
  prize_count: 'N',
  history: 'SS',
  win_time: 'N'
});

var db = dynamo.createClient({
  accessKeyId: 'AKIAJD7BVQJST2HCCPGA',
  secretAccessKey: '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' 
});

var results = db.get('results');

var save = function(result, callback) {
//  try {
//    result = schema.sanitize(result);
//  } catch(e) {
//    return callback(e);
//  }
  results.put(result).save(callback);
};

var query = function(opts, callback) {
  var predicates = {
    contest_id: opts.contest_id
  };
  if (opts.max_lookback) {
    predicates.timestamp = {">=": [opts.max_lookback, opts.timestamp]}
  } else {
    predicates.timestamp = {"<=": opts.timestamp}
  }
  console.log(predicates);
  results.query(predicates).fetch(callback);
};

var update = function(opts, callback) {
  var item = results.get(opts.key);
  item.update(function() {
    var self = this;
    if (opts.put) {
      Object.keys(opts.put).forEach(function(key) {
        self.put(key, opts.put[key]);
      });
    }
    if (opts.add) {
      Object.keys(opts.add).forEach(function(key) {
        self.add(key, opts.add[key]);
      });
    }
    if (opts.remove) {
      opts.remove.forEach(function(key) {
        self.remove(key);
      });
    }
  }).save(callback);
};

var get = function(key, callback) {
  results.get(key).fetch(callback);
};

module.exports = {
  save: save,
  query: query,
  update: update,
  get: get,
  db: db
};

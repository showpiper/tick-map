var test = require('tap').test;
var TickMap = require('..');

test('create with new', function(t) {
  var tm = new TickMap();
  t.ok(tm instanceof TickMap);
  t.end();
});

test('create with function', function(t) {
  var tm = TickMap();
  t.ok(tm instanceof TickMap);
  t.end();
});

test('add a value', function(t) {
  var tm = TickMap();
  tm.add(1.3, { name: 'myName' });
  t.end();
});

test('get no value by index in empty TickMap', function(t) {
  var tm = TickMap();
  var got = tm.item(0);
  t.equal(got, undefined);
  t.end();
});

test('get no value by tick in empty TickMap', function(t) {
  var tm = TickMap();
  var got = tm.get(2.2);
  t.equal(got, undefined);
  t.end();
});

test('get bucket items by tick in empty TickMap', function(t) {
  var tm = TickMap();
  var bucket = tm.getBucketItems(3.001);
  t.same(bucket, []);
  t.end();
});

test('add a value and get by index', function(t) {
  var tm = TickMap();
  var value = { prop: new Date() }; // Can be anything
  tm.add(3.142, value);
  t.equal(tm.item(0), value);
  t.equal(tm.length, 1);
  t.end();
});

test('add a value and get by exact tick', function(t) {
  var tm = TickMap();
  var value = { prop: new Date() }; // Can be anything
  tm.add(3.142, value);
  t.equal(tm.length, 1);
  t.equal(tm.get(3.142), value);
  t.end();
});

test('add a value and fail to get by bucket neighbour', function(t) {
  var tm = TickMap();
  var value = { prop: new Date() }; // Can be anything
  tm.add(3.142, value);
  t.equal(tm.length, 1);
  t.equal(tm.get(3.124), undefined);
  t.end();
});

test('add values and ensure sorted', function(t) {
  var tm = TickMap();

  tm.add(3.2, 'b');
  tm.add(2.6, 'e');
  tm.add(2.2, 'z');
  tm.add(100.9, 'a');
  tm.add(100.0001, 'r');

  var str = '';
  for(var i = 0; i < 5; i++) {
    str += tm.item(i);
  }
  t.same(str, 'zebra');
  t.end();
});

test('add a value and get by bucket neighbours', function(t) {
  var tm = TickMap();
  var value = { prop: new Date() };
  tm.add(5.778, value);
  t.equal(tm.length, 1);
  var items = tm.getBucketItems(5.2);
  t.equal(items[0], value);
  t.equal(items.length, 1);
  t.same(tm.getBucketItems(6), []);
  t.same(tm.getBucketItems(4.9999), []);
  t.end();
});

test('add a load of values and retrieve by all means', function(t) {
  var numValues = 1000;
  var tm = TickMap();
  var values = [];
  var valuesByTick = {};
  var genTick = Math.random();
  for (var i = 0; i < numValues; i++) {
    var value = 'Value_' + i + '_' + genTick; // tick in the value for diagnosis
    values.push(value);
    valuesByTick[genTick] = value;
    tm.add(genTick, value);
    genTick += Math.random() * 3; // unique but sparse tick population
  }
  t.equal(tm.length, numValues);
  for (var i = 0; i < numValues; i++) {
    t.equal(tm.item(i), values[i]);
  }

  for (prop in valuesByTick) {
    if (valuesByTick.hasOwnProperty(prop)) {
      var tick = parseFloat(prop);
      t.equal(tm.get(tick), valuesByTick[prop]);

      var allBucketItems = tm.getBucketItems(tick);
      t.ok(allBucketItems.length > 0);
      t.ok(allBucketItems.indexOf(valuesByTick[prop]) > -1);
    }
  }
  t.end();
});

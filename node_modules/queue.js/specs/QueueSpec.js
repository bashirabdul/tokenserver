var expect = require("expect.js");
var Queue  = require("../lib/Queue");

describe("Test Queue", function() {
  it("should create empty queue", function() {
    var q = new Queue();
    expect(q.head).to.equal( undefined );
    expect(q.tail).to.equal( undefined );
  })

  it("should push data to empty queue", function() {
    var q = new Queue();
    expect(q.head).to.be(undefined);
    expect(q.tail).to.be(undefined);
    q.push(3);
    expect(q.head.data).to.equal(3);
    expect(q.tail.data).to.equal(3);
    expect(q.head.next).to.be(undefined);
    expect(q.head.prev).to.be(undefined);
    expect(q.head).to.equal(q.tail);
  })

  it("should push data to end", function() {
    var q = new Queue();
    q.push(1).push(2);
    expect(q.head.data).to.equal(1);
    expect(q.tail.data).to.equal(2);
    expect(q.head.next).to.equal(q.tail);
    expect(q.tail.prev).to.equal(q.head);
    expect(q.head.prev).to.be(undefined);
    expect(q.tail.next).to.be(undefined);

    q.push(3);
    expect(q.head.data).to.equal(1);
    expect(q.tail.data).to.equal(3);
    expect(q.head.next.data).to.equal(2);
    expect(q.tail.prev.data).to.equal(2);
    expect(q.head.next.next).to.equal(q.tail);
    expect(q.tail.prev.prev).to.equal(q.head);
    expect(q.head.prev).to.be(undefined);
    expect(q.tail.next).to.be(undefined);

  })

  it("should pop data from queue", function() {
    var q = new Queue();
    q.push(1).push(2).push(3);

    expect(q.pop()).to.equal(3);
    expect(q.head.data).to.equal(1);
    expect(q.tail.data).to.equal(2);

    expect(q.pop()).to.equal(2);
    expect(q.head.data).to.equal(1);
    expect(q.tail.data).to.equal(1);
    expect(q.head).to.equal(q.tail);

    expect(q.pop()).to.equal(1);
    expect(q.head).to.be(undefined);
    expect(q.tail).to.be(undefined);
  })

  it("should shift data from queue", function() {
    var q = new Queue();
    q.push(1).push(2).push(3);

    expect(q.shift()).to.equal(1);
    expect(q.head.data).to.equal(2);
    expect(q.tail.data).to.equal(3);
    expect(q.head.prev).to.be(undefined);

    expect(q.shift()).to.equal(2);
    expect(q.head).to.equal(q.tail);
    expect(q.head.next).to.be(undefined);
    expect(q.tail.prev).to.be(undefined);

    expect(q.shift()).to.equal(3);
    expect(q.head).to.be(undefined);
    expect(q.tail).to.be(undefined);

  })

  it("should unshift data from queue", function() {
    var q = new Queue();

    q.unshift(3);
    expect(q.head.data).to.equal(3);
    expect(q.tail).to.equal(q.head);
    expect(q.head.next).to.be(undefined);
    expect(q.tail.prev).to.be(undefined);

    q.unshift(2);
    expect(q.head.data).to.equal(2);
    expect(q.tail.data).to.equal(3);
    expect(q.head.next.data).to.equal(3);
    expect(q.head.next).to.equal(q.tail);
    expect(q.tail.prev).to.equal(q.head);

    q.unshift(1);
    expect(q.head.data).to.be(1);
    expect(q.tail.data).to.be(3);
    expect(q.head.next.data).to.be(2);
    expect(q.head.next.next).to.equal(q.tail);
    expect(q.tail.prev.data).to.be(2);
    expect(q.tail.prev.prev).to.equal(q.head);

  })

  it("should remove a node from queue", function() {
    var q = new Queue().push(1);        // Q:1

    q.remove(q.head);                   // Q:
    expect(q.head).to.be(undefined);
    expect(q.tail).to.be(undefined);

    q.push(1).push(2);                  // Q:1,2
    q.remove(q.head);                   // Q:2
    expect(q.head.data).to.equal(2);
    expect(q.head).to.be(q.tail);
    expect(q.head.next).to.be(undefined);
    expect(q.tail.prev).to.be(undefined);

    q.unshift(1);                       // Q:1,2
    q.remove(q.tail);                   // Q:1
    expect(q.head.data).to.equal(1);
    expect(q.head).to.be(q.tail);
    expect(q.head.next).to.be(undefined);
    expect(q.tail.prev).to.be(undefined);

    q.push(2).push(3);                          // Q:1,2,3
    q.remove(q.head.next);              // Q:1
    expect(q.head.data).to.equal(1);
    expect(q.head.next).to.equal(q.tail);
    expect(q.tail.data).to.equal(3);
    expect(q.head.next).to.be(q.tail);
    expect(q.tail.prev).to.be(q.head);

  })

  function iterateq(q) {
    var collector = new Queue();
    q.forEach(function(a) {
      collector.push(a);
    })
    return collector;
  }

  it("should iterate through elements", function() {
    var q = new Queue();

    var collector = iterateq(q);

    expect(collector.head).to.be(undefined);
    expect(collector.tail).to.be(undefined);

    q.push(1);
    collector = iterateq(q);
    expect(collector.head.data).to.equal(1);
    expect(collector.tail.data).to.equal(1);

    q.push(2);
    collector = iterateq(q);
    expect(collector.head.data).to.equal(1);
    expect(collector.tail.data).to.equal(2);
  })

  it("should iterate while condition", function() {
    var q = new Queue();
    [1,2,3,4].forEach(function(a) { q.push(a) });

    var collector = new Queue();
    var condition = function(a) {
      return a != 3;
    };
    q.forEach(function(a) {
      collector.push(a*a);
    }, condition );
    expect(collector.head.data).to.equal(1*1);
    expect(collector.tail.data).to.equal(2*2);
  })

  it("should concat another queue", function() {
    var appendage = new Queue().push(4).push(5).push(6);
    var q = new Queue().push(1).push(2).push(3);

    q.concat(appendage);
    expect(q.tail.data).to.equal(6);
    expect(q.head.next.next.next.data).to.equal(4);
  })

  it("should update length on changes", function() {
    var appendage1 = new Queue().push(4).push(5).push(6);
    var appendage2 = new Queue().push(7).push(8).push(9);
    var q = new Queue();
    expect(q.length).to.equal(0);

    q.push(1);
    expect(q.length).to.equal(1);
    q.push(2).push(3);
    expect(q.length).to.equal(3);

    q.shift();
    expect(q.length).to.equal(2);

    q.pop();
    expect(q.length).to.equal(1);

    q.pop();
    expect(q.length).to.equal(0);

    q.concat(new Queue().push(1).push(2).push(3))
      .concat(appendage1)
      .concat(appendage2);
    expect(q.length).to.equal(9);

    q.remove(q.head);
    expect(q.length).to.equal(8);
    q.remove(q.tail);
    expect(q.length).to.equal(7);
    q.remove(q.head.next);
    expect(q.length).to.equal(6);
  })
})

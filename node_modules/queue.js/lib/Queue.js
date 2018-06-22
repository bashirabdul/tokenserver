module.exports = function() {
  this.head = undefined;
  this.tail = undefined;
  this.length = 0;
}

module.exports.prototype.push = function(data) {
  this.add({ data: data, prev: this.tail, next: undefined });
  return this;
}

module.exports.prototype.pop = function() {
  return this.tail && this.remove(this.tail).data;
}

module.exports.prototype.shift = function() {
  return this.head && this.remove(this.head).data;
}

module.exports.prototype.unshift = function(data) {
  this.add({ data: data, prev: undefined, next: this.head });
  return this;
}

module.exports.prototype.add = function(item) {
  if(!item) return undefined;

  if(item.prev) item.prev.next = item;
  if(item.next) item.next.prev = item;

  if(item.prev == undefined) this.head = item;  // add before head
  if(item.next == undefined) this.tail = item;  // add to end

  this.length++;

  return item;
}

module.exports.prototype.remove = function(item) {
  if(!item) return undefined;

  if(this.head == item) this.head = item.next;  // removing head
  if(this.tail == item) this.tail = item.prev;  // removing tail

  if(item.prev) item.prev.next = item.next;
  if(item.next) item.next.prev = item.prev;

  this.length--;

  return item;
}

module.exports.prototype.concat = function(queue) {
  if(this.head == undefined) {
    this.head = queue.head;
    this.tail = queue.tail;
    this.length = queue.length;
    return this;
  }
  queue.head.prev = this.tail;
  this.tail.next = queue.head;
  this.tail = queue.tail;
  this.length += queue.length;
  return this;
}

// Use this to implement sort, insert, filter, take, drop, fold, map
module.exports.prototype.forEach = function(func, condition) {
  for(var current = this.head; current; current = current.next) {
    if(condition && !condition(current.data)) break;
    func(current.data);
  }
}

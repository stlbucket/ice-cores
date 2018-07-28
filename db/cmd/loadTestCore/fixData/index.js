const clog = require('fbkt-clog');
const stream = require('stream');
const util = require('util');
let header = null;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// node v0.10+ use native Transform, else polyfill
const Transform = stream.Transform ||
  require('readable-stream').Transform;

function FixData(options) {
  // allow use without new
  if (!(this instanceof FixData)) {
    return new FixData(options);
  }

  // init Transform
  Transform.call(this, options);
}
util.inherits(FixData, Transform);

FixData.prototype._transform = function (chunk, enc, cb) {
  // clog('chunk', chunk.toString('utf8'))
  const split = chunk.toString('utf8').split('\r\n')
  const evXer = (getRandomInt(40) + 80)/100

  // clog('chunk', chunk.toString('utf8'))
  // clog('split', split)
  const includeHeader = header === null;
  header = header ? header : split.shift()
  const preserveFields = [ 'TopDepth', 'BottomDepth', 'TopAge', 'BottomAge' ]
  // clog('header', header)

  const json = split.map(
    row => {
      return header.split(',').reduce(
        (a, field, index) => {
          // clog('row', {
          //   row: row,
          //   index: index,
          //   field: field
          // })
          const data = row.split(',')[index]
          // clog('data', data)
          const dp = data && data.split('.')[1] ? data.split('.')[1].length : 0
          const value = preserveFields.includes(field) ? data : (data * evXer).toFixed(dp)

          return Object.assign(a, {
            [field]: value
          })  
        },
        {}
      )
    }
  )
  // clog('json', json)

  const newChunkUTF8 = (includeHeader ? [header] : []).concat(json.map(
    rowson => {
      return header.split(',').map(
        field => {
          return rowson[field]
        }
      ).join(',')
    }
  )).join('\r\n')

  const newChunkBase64 = new Buffer(newChunkUTF8, "utf-8")
  


  // clog('newChunk', newChunkBase64)

  // throw new Error('HEY NOW')

  this.push(newChunkBase64);
  cb();
};

module.exports = FixData
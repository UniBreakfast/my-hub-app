Object.prototype.c = function(label) {
  console.log(typeof label=='string'? label+':'
    : typeof label=='number'? label+'.' :'', this.valueOf())
  return this.valueOf()
}

{
  let timestamp
  Object.prototype.t = function(label) {
    if (timestamp) {
      var ts = timestamp
      timestamp = process.hrtime().join('.')*1000
      console.log(typeof label=='string'? label+':'
        : typeof label=='number'? label+'.' :'', +(timestamp-ts).toFixed(3))
    }
    else timestamp = process.hrtime().join('.')*1000
    return this==global? null : this.valueOf()
  }
}

{
  const arr = []; let ids = 1
  var crud = [
    value => new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.1) reject(new Error('unsuccessful'))
      else {
        const id = ids++, record = {id, value}
        arr.push(record)
        resolve(record)
      }
    }, 700)),
    ()=> new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.1) reject(new Error('unsuccessful'))
      else resolve(JSON.parse(JSON.stringify(arr)))
    }, 700)),
    (id, value)=> new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.1) reject(new Error('unsuccessful'))
      const record = arr.find(rec => rec.id == id)
      if (record) resolve(JSON.parse(JSON.stringify(record)))
      else reject(new Error('not found'))
    }, 700)),
    id => new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.1) reject(new Error('unsuccessful'))
      const record = arr.find(rec => rec.id == id)
      if (record) resolve('done')
      else reject(new Error('not found'))
    }, 700))
  ]
  var [create, read, update, remove] = crud
}
1
// for (let i=0; i<37; i++) console.log(i+':', smallestDivisor(i))

// const keyboard = [
//   [
//     {
//       ruLabel: 'ё',
//       enLabel: '`',
//       enShiftLabel: '~',
//       color: 'light'
//     },

//   ]
// ]
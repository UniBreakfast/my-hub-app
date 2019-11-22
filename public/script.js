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
  const arr = [
    {id: 1, option: 'Activities'},
    {id: 2, option: 'Endeavors'},
    {id: 3, option: 'Quests'}
  ]
  let ids = 4
  var crud = [
    // create
    value => new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.3) reject(new Error('unsuccessful'))
      else {
        const id = ids++, record = {id, value}
        arr.push(record)
        resolve(record)
      }
    }, 700)),
    // read
    ()=> new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.3) reject(new Error('unsuccessful'))
      else resolve(JSON.parse(JSON.stringify(arr)))
    }, 700)),
    // update
    (id, value)=> new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.3) return reject(new Error('unsuccessful'))
      const record = arr.find(rec => rec.id == id)
      if (record) {
        record.value = value
        resolve(JSON.parse(JSON.stringify(record)))
      }
      else reject(new Error('not found'))
    }, 700)),
    // delete
    id => new Promise((resolve, reject)=> setTimeout(()=> {
      if (Math.random()<.3) return reject(new Error('unsuccessful'))
      const record = arr.findIndex(rec => rec.id == id)
      if (~record) resolve(JSON.parse(JSON.stringify(arr.splice(record, 1)[0])))
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

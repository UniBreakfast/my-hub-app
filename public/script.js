Object.prototype.c = function(label) {
  console.log(typeof label=='string'? label+':'
    : typeof label=='number'? label+'.' :'', this.valueOf())
  return this.valueOf()
}

// {
//   let timestamp
//   Object.prototype.t = function(label) {
//     if (timestamp) {
//       var ts = timestamp
//       timestamp = process.hrtime().join('.')*1000
//       console.log(typeof label=='string'? label+':'
//         : typeof label=='number'? label+'.' :'', +(timestamp-ts).toFixed(3))
//     }
//     else timestamp = process.hrtime().join('.')*1000
//     return this==global? null : this.valueOf()
//   }
// }

z=n=>Math.max(...n.toString(2).replace(/^0+|0+$/g,'').split(/1+/).map(s=>s.length))
z=n=>n.toString(2).replace(/^0+|0+$/g,'').split(/1+/).reduce((x,s)=>m(x,s.length),0)
z=n=>Math.log10(Math.max(...new Set(n.toString(2).match(/(?:1)0+(?=1)/g))))
z=n=>Math.log10(Math.max(...n.toString(2).match(/(?:1)0+(?=1)/g)))
z=n=>Math.log10(n.toString(2).match(/(?:1)0+(?=1)/g).reduce((x,s)=>m(x,s)))
m=Math.max
z=n=>n.toString(2).match(/(?:1)0+(?=1)/g).reduce((x,s)=>m(x,s.length),0)

// console.time('z')
// for (let i=0; i<4e5; ++i) z(Math.floor(Math.random()*Number.MAX_SAFE_INTEGER))
// console.timeEnd('z')



for (let i=0; i<37; i++) console.log(i+':', smallestDivisor(i))

const keyboard = [
  [
    {
      ruLabel: 'ё',
      enLabel: '`',
      enShiftLabel: '~',
      color: 'light'
    },

  ]
]
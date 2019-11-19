const html = raw => raw[0], css = html
const d = document
const { assign } = Object, c = console.log
const credom = (el,...props) => assign(d.createElement(el),...props)
const jsonClone = obj => JSON.parse(JSON.stringify(obj))
Element.prototype.qsel = d.qsel =
  function (sel, one) { return this[`querySelector${one?'':'All'}`](sel) }
EventTarget.prototype.on = d.body.addEventListener

const optionHTML = (id, str)=> `<option value=${id}>${str}</option>`

export default class ComboBox {

  constructor (domel, crud) {
    this.domel = domel
    this.render()
    this.styleUp()
    if (crud) this.crudUp(crud)
    this.assignHandlers()
  }

  switchTo(mode) { // 0 - select, 1 - input
    this.domel.qsel('.cs-input',1).classList[mode? 'add':'remove']('active')
    this.domel.qsel('.cs-select',1).classList[!mode? 'add':'remove']('active')
    this[mode? 'input':'select'].focus()
  }



  // add =()=> assign(this.input, {id: '', value: ''}) && this.toggle()

  // edit =()=> {
  //   const { input, select, toggle } = this
  //   assign(input,
  //     {id: select.value, value: select.options[select.selectedIndex].text})
  //   toggle()
  // }

  // toggle =()=>
  //   this.domel.qsel('div').forEach(div => div.classList.toggle('active'))

  // save =()=> {
  //   const { input, select } = this
  //   if (!input.value.trim()) return
  //   if (input.id) {
  //     this.update(input.id, input.value).then(record => {
  //       this.records.push(record)
  //     })
  //   }
  // }

  crudUp([create, read, update, delit]) {
    assign(this, {create, read, update, delit})
    this.refresh()
  }

  refresh() {
    if (this.read) this.read()
      .then(records => this.optionsMake(this.cache = records, true))
      .catch(err => c(err) || setTimeout(()=>this.refresh(), 1000))
  }

  optionsMake(records, unselected) {
    this.select.innerHTML =
      records.reduce((html, {id, option}) => html+optionHTML(id, option),
        unselected? `<option value>... nothing selected ...</option>`:'')
    this.toggleBtns()
    this.add.disabled = false
  }

  optionsClear() {
    const unselected = [...this.select].find(option => !option.value)
    this.select.innerHTML = ''
    if (unselected) this.select.add(unselected)
  }

  optionsSort(byText, desc) {
    const unselected = [...this.select].find(option => !option.value),
          part = byText? 'text':'value', dir = desc? -1 : 1
    this.optionRemove('')
    const allNums = [...this.select].every(opt => opt[part]==Number(opt[part])),
          sorter = allNums? (a,b)=> (a[part]-b[part])*dir
            : (a,b)=> a[part]>b[part]? 1*dir: -1*dir
    this.select.append(unselected,...[...this.select].sort(sorter))
  }

  get length() { return this.select.length }

  optionIsPresent(opt) {
    return [...this.select].some(option => option.text==opt)
  }

  optionAdd(text) {
    if (this.optionIsPresent(text)) throw 'conflicting option'
    const option = credom('option', {text, value:''})
    this.select.add(option)
    return option
  }

  optionRemove(id) {
    this.select.remove([...this.select].findIndex(option => option.value==id))
  }

  optionUpdate({id, option}) {
    [...this.select].find(option => option.value==id).text = option
  }

  optionSelect(id='') { this.select.value = id }

  optionSelectNext() {
    do this.select[(this.select.selectedIndex+1) % this.length].selected = true
    while (this.select.selectedOptions[0].wip)
    this.toggleBtns()
  }

  optionSelected() {
    const { value, text } = this.select.selectedOptions[0]
    return {id: value, option: text}
  }

  // cacheIt(records) { this.cache = jsonClone(records) }

  // cacheHas({id, option}) {
  //   return this.cache.some(pair => pair.id==id || pair.option==option)
  // }

  // cacheInclude({id, option}) {
  //   if (this.cacheHas({id, option})) throw 'conflicting option'
  //   this.cache.push({id, option})
  // }

  // cacheExclude(id) {
  //   this.cache.splice(this.cache.findIndex(pair => pair.id==id), 1)
  // }

  // cacheUpdate(id, option) {
  //   this.cache.find(pair => pair.id==id).option = option
  // }

  // cacheSort(byOption, desc) {
  //   const part = byOption? 'option':'id', dir = desc? -1 : 1,
  //         allNums = this.cache.every(opt => opt[part]==Number(opt[part])),
  //         sorter = allNums? (a,b)=> (a[part]-b[part])*dir
  //           : (a,b)=> a[part]>b[part]? 1*dir: -1*dir
  //   this.cache.sort(sorter)
  // }

  inputClear() { assign(this.input, {id:'', value:'', was:''}) }

  inputSet({id, option}) {
    assign(this.input, {id, value: option, was: option})
  }

  inputGet() {
    return {id: this.input.id, value: this.input.value}
  }

  render() {
    const [ [ div1, input ], [ div2, select ] ] = ['input', 'select']
      .map(tag => [credom('div', {className: 'cs-'+tag}), credom(tag)])
    const [ save, cancel, remove, edit, add ] =
      ['Save', 'Cancel', 'Remove', 'Edit', 'Add']
        .map(innerText => credom('button', {innerText}))
    // !['Volvo','Saab','Mercedes','Audi'].forEach(value =>
    //   select.append(credom('option', {value, innerText:value})))
    ![[div1, input, ' ', save, ' ', cancel],
      [div2, select,' ', remove,' ', edit,' ', add], [this.domel, div1, div2]]
        .forEach(([domel,...kids])=> domel.append(...kids))
    // ![[cancel,'toggle'],[add,'add'],[edit,'edit']]
    //   .map(([btn, method]) => btn.onclick = this[method])
    div2.classList.add('active')
    ![remove, edit, add].map(btn => btn.disabled = true)
    assign(this, {input, select, add, edit, remove, save, cancel})
  }

  styleUp() {
    const id = 'combo-select-css'
    if (d.qsel('#'+id, 1)) return
    d.head.append(credom('style', {id, innerHTML: css`
      .combo-select input, .combo-select select {
        width: 12rem;
        height: 2rem;
        padding: .3rem;
        box-sizing: border-box;
      }
      .combo-select>div:not(.active) { display: none }
      .cs-input button { padding-left: 1.08rem; padding-right: 1.08rem } `
    }))
  }

  assignHandlers() {
    const { select, input, remove, edit, add, save, cancel,
      create, update, delit, toggleBtns, toggleSave } = this
    select.on('change', toggleBtns)
    remove.on('click', ()=> {
      const option = select.selectedOptions[0]
      option.wip = true
      option.style.display = 'none'
      this.optionSelectNext()
      delit(option.value).then(it => this.optionRemove(it.id))
        .catch(err => { c(err)
          if (err.message == 'not found') this.refresh()
          else delete option.wip, option.style.display = null
        })
    })
    edit.on('click', ()=> {
      this.switchTo(1)
      this.inputSet(this.optionSelected())
      toggleSave()
    })
    input.on('input', toggleSave)
    input.on('keydown', e => e.key=='Enter'? save.click():0)
    save.on('click', ()=> {
      if (input.id) {
        const option = select.selectedOptions[0]
        option.wip = true
        let { was } = input
        option.text = input.value
        update(input.id, input.value).catch(err => (c(err), option.text = was))
          .finally(()=> (delete option.wip, toggleBtns()))
      } else {
        const option = this.optionAdd(input.value)
        option.wip = true
        create(input.value).then(record => option.value = record.id)
          .catch(err => c(err) || option.remove())
          .finally(()=> (delete option.wip, toggleBtns()))
      }
      toggleBtns()
      this.switchTo()
    })
    add.on('click', ()=> { this.switchTo(1), this.inputClear(), toggleSave() })
    cancel.onclick =()=> this.switchTo()
  }

  toggleBtns =()=> {
    const disabled = !this.select.value ||
      this.select.selectedOptions[0].wip? true : false
    !['remove','edit'].map(btn => assign(this[btn], {disabled}))
  }

  toggleSave =()=> this.save.disabled = this.optionIsPresent(this.input.value)
}
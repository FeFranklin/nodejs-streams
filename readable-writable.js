import { Readable, Transform, Writable} from 'stream'
import { createWriteStream } from 'fs'
// data source
const readable = Readable({
  read() {
    // this.push('Hello world 1')
    // this.push('Hello world 2')
    // this.push('Hello world 3')
    for (let i = 0; i < 2; i++) {
      const person = { id: Date.now() + i, name: `Felipe-${i}`}
      const data = JSON.stringify(person)
      this.push(data)
    }

    // data has finished
    this.push(null)
  }
})

// data processing
const mapHeaders = Transform({
  transform(chunk, encoding, cb) {
    this.counter = this.counter ?? 0
    if (this.counter) {
      return cb(null, chunk)
    }

    this.counter += 1
    cb(null, "id,name\n".concat(chunk))
  }
})

const mapFields = Transform({
  transform(chunk, encoding, cb) {
    const data = JSON.parse(chunk)
    const result = `${data.id},${data.name.toUpperCase()}\n`
    cb(null, result)
  }
})

// data output
const writable = Writable({
  write(chunk, encoding, cb) {
    console.log('msg', chunk.toString())

    cb()
  }
})

readable
  .pipe(mapFields)
  .pipe(mapHeaders)
  // .pipe(writable)
  // .pipe(process.stdout)
  .pipe(createWriteStream('my.csv'))
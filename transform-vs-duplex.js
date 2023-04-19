import { Duplex, Transform } from "stream"
let count = 0
const server = new Duplex({
  objectMode: true, //no buffer needed => more memmory
  encoding: 'utf-8',
  read() {
    const everySecond = (intervalContext) => {
      if (count++ <= 5) {
        this.push(`My name is Felipe[${count}]`)
        return
      }
      clearInterval(intervalContext)
      this.push(null)
    }
    // generate data
    setInterval(function () {
      everySecond(this)
    })
  },

  // different commmunication channel
  write(chunk, encoding, cb) {
    console.log('[writable] saving:', chunk)
    cb()
  },
  
})

// server.write triggers Duplex's write function
server.write('[duplex] hey this is writable!\n')

// on data -> logs on read's push call
// server.on('data', msg => console.log(`[readable]${msg}`))

// push lets you send more data
server.push(`[duplex] hey this is also a readable\n`)

// server.pipe(process.stdout)

const transformToUpperCase = Transform({
  objectMode: true,
  transform(chunk, enc, cb) {
    cb(null, chunk.toUpperCase())
  }
})

transformToUpperCase.write('[transform] hello from write\n')
transformToUpperCase.push('[transform] hello from push\n')

// redirects all readable data to duplex
server
  .pipe(transformToUpperCase)
  .pipe(server)
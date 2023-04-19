import http from 'http'

import { Readable, Writable } from 'stream'

function apiOne (req, res) {
  // res.write('teste01\n')
  // res.write('teste02\n')
  // res.write('teste03\n')
  // req.pipe(res)
  
  let count = 0
  const maxItems = 99
  const readable = Readable({
    read() {
      const everySecond = (intervalContext) => {
        if (count++ <= maxItems) {
          this.push(JSON.stringify({ id: Date.now() + count, name: `Felipe-${count}`}) + "\n")
          return
        }
        clearInterval(intervalContext)
        this.push(null)
      }
      // generate data
      setInterval(function () {
        everySecond(this)
      })
    }
  })

  readable.pipe(res)
}

function apiTwo (req, res) {
  let count = 0
  const maxItems = 99
  const readable = Readable({
    read() {
      const everySecond = (intervalContext) => {
        if (count++ <= maxItems) {
          this.push(JSON.stringify({ id: Date.now() + count, name: `Pedro-${count}`}) + "\n")
          return
        }
        clearInterval(intervalContext)
        this.push(null)
      }
      // generate data
      setInterval(function () {
        everySecond(this)
      })
    }
  })

  readable.pipe(res)
  
}

http.createServer(apiOne).listen(3000, () => console.log('Server running at 3000.'))
http.createServer(apiTwo).listen(4000, () => console.log('Server running at 4000.'))
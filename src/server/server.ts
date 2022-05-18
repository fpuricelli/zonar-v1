import express from 'express'
import path from 'path'
import http from 'http'
import { Server, Socket } from 'socket.io'
import { nextTick } from 'process'

const port: 3000

class App {
    private server: http.Server
    private port: number

    private io: Server
    private clients: any = {}

    constructor(port: number) {
        this.port = port
        const app = express()

        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app)

        this.io = new Server(this.server)

        this.io.on('connection', (socket: Socket) => {
            console.log(socket.constructor.name)
            this.clients[socket.id] = {}

            let connNumber = this.io.sockets.sockets.size
            console.log('conexión nro : '+ connNumber)

            this.clients[socket.id].c = connNumber
            if(connNumber==1){
                this.clients[socket.id].v='Opera'
            }
            if(connNumber==2){
                this.clients[socket.id].v='3D'
            }
            if(connNumber==3){
                this.clients[socket.id].v='XR'
            }

            console.log(this.clients)
            console.log('a user connected : ' + socket.id)
            socket.emit('id', socket.id)
            
            socket.emit('orden', connNumber)

            socket.on('disconnect', () => {
                console.log('socket disconnected : ' + socket.id)
                if (this.clients && this.clients[socket.id]) {
                    console.log('deleting ' + socket.id)
                    delete this.clients[socket.id]
                    this.io.emit('removeClient', socket.id)
                }
            })

            socket.on('update', (message: any) => {
                if (this.clients[socket.id]) {
                    this.clients[socket.id].t = message.t //client timestamp
                    this.clients[socket.id].p = message.p //position
                    this.clients[socket.id].r = message.r //rotation
                    this.clients[socket.id].v = message.v // tipo de vista
                }
            })
        })

        setInterval(() => {
            this.io.emit('clients', this.clients)
        }, 50)
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()
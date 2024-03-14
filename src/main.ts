import fastify from "fastify";
import fastifyView from '@fastify/view'
import fastifyStatic from '@fastify/static'
import fastitfyMultipart from '@fastify/multipart'

import ejs from 'ejs'
import path from "path";
import { ExtractText } from "./lib/tesseract";

const server = fastify({
    logger: true
})

server.register(fastitfyMultipart)

server.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
})

server.register(fastifyView, {
    engine: {
        ejs
    },
    root: path.join(__dirname, 'template')
})

server.get('/', (req, reply) => {
    reply.view('index.ejs', { text: '', canCopy: false })
})

server.post('/', async (req, reply) => {
    const data = await req.file()

    if (!data) return reply.view('index.ejs', { text: 'NOT DATA' })

    const file = await data.toBuffer()
    const extracted = await ExtractText(file)

    return reply.view('index.ejs',
        {
            text: extracted,
            canCopy: true
        })
})

server.listen({ port: 3000 }, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})

export default server

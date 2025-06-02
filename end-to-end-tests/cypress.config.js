const { defineConfig } = require('cypress')
const io = require("socket.io-client")

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:3333",
        setupNodeEvents(on, config) {
            let socket = null
            
            on('task', {
                connectAsOtherUser(roomId) {
                    socket = io(`http://localhost:3333/rooms?roomId=${roomId}`)
                    return null;
                },
                leave() {
                    if (socket) {
                        socket.disconnect();
                    }
                    
                    return null;
                }
            })
        },
    },
})
const { Server } = require('../lib/index.js');

let server = new Server({ ip: '5.42.217.217' });

// server.on('statusUpdate', (status) => {
//     console.log(status);
// });

// server.on('factionStatus', (status) => {
//     console.log(status);
// });

// server.on('joinPlayer', (player) => {
//     console.log(`Player joined: ${player.name}`);
// });

// server.on('leftPlayer', (player) => {
//     console.log(`Player left: ${player.name}`);
// });

// server.getStatus()
//     .then((data) => {
//         console.log(`Server Status: ${data}`)
//     })
// server.getPlayers()
//     .then((data) => {
//         console.log(data)
//     })
// server.getServerData()
//     .then((data) => {
//         console.log(data)
//     })
// server.getFactionData()
//     .then((data) => {
//         console.log(data)
//     })
// server.getMaxPlayers()
//     .then((data) => {
//         console.log(`Max Players: ${data}`)
//     })
// server.getOnlinePlayers()
//     .then((data) => {
//         console.log(`Online Players: ${data}`)
//     })
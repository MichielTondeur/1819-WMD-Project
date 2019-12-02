const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server, {
    pingTimeout: 4000,
    pingInterval: 4000
});
const port = 3001;

const { remove, pickBy } = require('lodash');

io.on('connect', socket => {
    console.log('a user has connected: ' + socket.id);

    socket.on('join', async room => {
        try {
            var players = 0;

            await io
                .of('/')
                .in(room)
                .clients((error, clients) => {
                    if (error) throw error;
                    players = clients;
                });

            if (players.length < 2) {
                socket.join(room);
                var playersInRoom = io.sockets.adapter.rooms[room].sockets;

                console.log(playersInRoom);

                console.log('user added to room: ' + room);
                io.to(room).emit('players', playersInRoom);
            } else {
                console.log('Error, room full');
                await socket.emit(
                    'roomFull',
                    'This room has more than 2 players in it.'
                );
            }
        } catch (error) {
            console.log('error' + error);
        }
    });

    socket.on('disconnecting', reason => {
        console.log('a user has disconnected: ' + socket.id);

        let rooms = Object.keys(socket.rooms);
        rooms.forEach(room => {
            // handmatig user verwijderen
            var playersInRoom = io.sockets.adapter.rooms[room].sockets;
            delete playersInRoom[socket.id];
            io.to(room).emit('players', playersInRoom);
        });
    });

    socket.on('start', room => {
        var playersInRoom = io.sockets.adapter.rooms[room].sockets;

        const secondSocket = pickBy(playersInRoom, (s, key) => {
            return key != socket.id;
        });

        console.log(socket.id + ' true');
        console.log(Object.keys(secondSocket)[0] + ' false');

        io.to(socket.id).emit('start', true);
        io.to(Object.keys(secondSocket)[0]).emit('start', false);
    });

    socket.on('nextLevel', room => {
        io.to(room).emit('nextLevel');
    });

    socket.on('time', (error, room) => {
        io.to(room).emit('time', error + 1);
    });

    socket.on('lose', room => {
        io.to(room).emit('lose');
    });

    // game starten op app
    socket.on('startGame', (level, room) => {
        var playersInRoom = io.sockets.adapter.rooms[room].sockets;
        const secondSocket = Object.keys(
            pickBy(playersInRoom, (s, key) => {
                return key != socket.id;
            })
        )[0];

        // commandos aanmaken
        let components = chooseComponents(level + 2);
        let secondComponents = chooseComponents(level + 2);

        commands = {
            id: socket.id,
            commands: createCommands(components)
        };
        secondCommands = {
            id: secondSocket,
            commands: createCommands(secondComponents)
        };

        // alle mogelijke commando's doorsturen naar speler voor UI te maken
        io.to(socket.id).emit('components', components);
        io.to(secondSocket).emit('components', secondComponents);

        // eerste commando doorsturen naar commando component
        io.to(socket.id).emit(
            'command',
            secondCommands.commands[0].fullCommand
        );
        io.to(secondSocket).emit('command', commands.commands[0].fullCommand);
    });

    socket.on('action', (name, room) => {
        var playersInRoom = io.sockets.adapter.rooms[room].sockets;
        const secondSocket = Object.keys(
            pickBy(playersInRoom, (s, key) => {
                return key != socket.id;
            })
        )[0];

        if (socket.id == commands.id) {
            if (commands.commands.length == 0) {
                console.log('Geen commandos meer');
            } else if (name == commands.commands[0].name) {
                commands.commands.splice(0, 1);
                if (commands.commands.length == 0) {
                    console.log('No more commands');
                    io.to(secondSocket).emit('command', '');
                } else {
                    io.to(secondSocket).emit(
                        'command',
                        commands.commands[0].fullCommand
                    );
                }
            } else {
                console.log('fout commando');
            }
        } else if (socket.id == secondCommands.id) {
            if (secondCommands.commands.length == 0) {
                console.log('Geen commandos meer');
            } else if (name == secondCommands.commands[0].name) {
                secondCommands.commands.splice(0, 1);
                if (secondCommands.commands.length == 0) {
                    console.log('No more commands');
                    io.to(secondSocket).emit('command', '');
                } else {
                    io.to(secondSocket).emit(
                        'command',
                        secondCommands.commands[0].fullCommand
                    );
                }
            } else {
                console.log('fout commando');
            }
        }

        if (
            commands.commands.length == 0 &&
            secondCommands.commands.length == 0
        ) {
            io.to(room).emit('win');
        }
    });
});

function chooseComponents(numberOfComponents) {
    const possibleCommands = [
        {
            name: 'Hyperspeed Thruster',
            buttonCommand: 'Enable',
            fullCommand: 'Enable the hyperspeed thruster!'
        },
        {
            name: 'Laser Cannon',
            buttonCommand: 'Fire',
            fullCommand: 'Fire the laser cannon!'
        },
        {
            name: 'Shield',
            buttonCommand: 'Activate',
            fullCommand: 'Activate the shield!'
        },
        {
            name: 'Cloaking Device',
            buttonCommand: 'Activate',
            fullCommand: 'Activate the cloaking device!'
        },
        {
            name: 'Booster Rocket',
            buttonCommand: 'Start',
            fullCommand: 'Start the booster rocket!'
        },
        {
            name: 'Ion Engine',
            buttonCommand: 'Rebalance',
            fullCommand: 'Rebalance the ion engine!'
        },
        {
            name: 'Quark Beacon',
            buttonCommand: 'Power',
            fullCommand: 'Power the quark beacon'
        },
        {
            name: 'Magnetic Jammer',
            buttonCommand: 'Recalibrate',
            fullCommand: 'Recalibrate the magnetic jammer!'
        },
        {
            name: 'Steam Throttle',
            buttonCommand: 'Engage',
            fullCommand: 'Engange the steam throttle!'
        },
        {
            name: 'Pressure Tank',
            buttonCommand: 'Increase',
            fullCommand: 'Increase the pressure tank!'
        },
        {
            name: 'Shockwave',
            buttonCommand: 'Send',
            fullCommand: 'Send shockwave!'
        },
        {
            name: 'Cabine Lever',
            buttonCommand: 'Pull',
            fullCommand: 'Pull the cabine lever!'
        },
        {
            name: 'Bio Armour',
            buttonCommand: 'Regenerate',
            fullCommand: 'Regenerate the bio armour!'
        },
        {
            name: 'AI Scrambler',
            buttonCommand: 'Reboot',
            fullCommand: 'Reboot the AI scrambler!'
        },
        {
            name: 'Plasma Rifle',
            buttonCommand: 'Shoot',
            fullCommand: 'Shoot the plasma rifle!'
        },
        {
            name: 'Missile Pod',
            buttonCommand: 'Launch',
            fullCommand: 'Launch the missile pod!'
        },
        {
            name: 'Turbo Catalyst',
            buttonCommand: 'Ignite',
            fullCommand: 'Ignite the turbo catalyst!'
        },
        {
            name: 'Fuel Pump',
            buttonCommand: 'Clean',
            fullCommand: 'Clean the fuel pump!'
        },
        {
            name: 'Radio Signal',
            buttonCommand: 'Transmit',
            fullCommand: 'Transmit the radio signal!'
        }
    ];

    const commands = [];

    for (let i = 0; i < numberOfComponents; i++) {
        let command = pickCommand(possibleCommands);
        remove(possibleCommands, c => c.name === command.name);
        commands.push(command);
    }

    return commands;
}

function createCommands(possibleComponents) {
    const commands = [];
    let command = pickCommand(possibleComponents);
    commands.push(command);

    for (let i = 0; i < 9; i++) {
        command = pickCommand(possibleComponents);

        while (command.name == commands[i].name) {
            command = pickCommand(possibleComponents);
        }

        commands.push(command);
    }

    return commands;
}

function pickCommand(commands) {
    return commands[Math.floor(Math.random() * commands.length)];
}

setInterval(() => {
    console.log('pinging to keep the connection alive');
    io.emit('ping', { data: new Date() / 1 });
}, 5000);

server.listen(process.env.PORT || port);

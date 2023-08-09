/*
 * @Author: your name
 * @Date: 2020-04-25 20:44:53
 * @LastEditTime: 2020-04-25 23:36:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\chat\lib\chat_server.js
 */
const socktio = require('socket.io');
let io;
const gustNumber = 0;
const nickNames = {};
const nameUsed = [];
const currentRoom = {};

// 分配用户昵称
function assignGuestName(socket, gustNumber, nickNames, nameUsed) {
    const name = `GUEST${gustNumber + 1}`;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name
    })
    nameUsed.push(namw);
};

function joinRoom(socket, room) {
    socket.join(room)
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {
        room
    })
    socket.broadcast.to(room).emit('message', {
        text: `${nickNames[socket.id]} has joined ${room}`
    })
    const usersInRoom = io.sockets.clients(room);
    if(usersInRoom.length > 1) {
        let usersInRoomSummary = `users currentin ${room}:`
        for(let index in usersInRoom) {
            const userSocketId = usersInRoom[index].id
            if(userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ','
                }
                usersInRoomSummary += `${nickNames[userSocketId]}`
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', usersInRoomSummary);
    }
};

function handleNameChangeAttempts(socket, nickNames, nameUsed) {
    socket.on('nameAttempt', function(name) {
        if(name.indexOf('GUEST') == 0) {
            socket.emit('namResult', {
                success: false,
                message: 'name cant begin with "guest"'
            })
        } else if (nameUsed.indexOf(name) == -1) {
            const previousName = nickNames[socket.id];
            const previousNameIndex = nameUsed.indexOf(previousName);
            nickNames[socket.id] = name;
            delete nameUsed[previousNameIndex];
            socket.emit('nameResult', {
                success: true,
                name
            })
            socket.broadcast.to(currentRoom[socket.id]).emit('nameResult', {
                success: true,
                message: `${previousName} is now konwn as ${name}`
            })
        } else {
            socket.emit('namResult', {
                success: false,
                message: 'name is already in use'
            })
        }
    })
};

function handleMessageBroadcasting(socket) {
    socket.on('message', function(data) {
        socket.broadcast.to(data.room).emit('message', {
            text: `${nickNames[socket.id]}: ${data.text}`
        })
    })
};

function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id])
        joinRoom(socket, room.newRoom)
    })
};

function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        const nameIndex = nameUsed.indexOf(nickNames[socket.id])
        delete nameUsed[nameIndex];
        delete nickNames[socket.id];
    })
};

exports.listen = function(server) {
    io= socktio.listen(server);
    io.set('log level', 1)
    io.sockets.on('connection', function(socket) {
        gustNumber = assignGuestName(socket, gustNumber, nickNames, nameUsed);
        joinRoom(socket, 'Lobby'); // 加入房间
        handleMessageBroadcasting(socket, nickNames)
        handleNameChangeAttempts(socket, nickNames, nameUsed)
        handleRoomJoining(socket)
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms)
        })
        handleClientDisconnection(socket, nickNames, nameUsed)
    })
};
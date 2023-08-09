/*
 * @Author: your name
 * @Date: 2020-04-25 20:45:29
 * @LastEditTime: 2020-04-25 23:36:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\chat\public\javascript\chat.js
 */
const Chat = function(socket) {
    this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
    this.socket.emit('message', {
        text,
        room,
    })
};

Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    })
};

Chat.prototype.processCommand = function(command) {
    const words = command.split(' ');
    const comm = words[0].substring(1, words[0].length).toLowerCase()
    let message = '';
    switch (comm) {
        case 'join':
            words.shift();
            const room = words.join(' ')
            this.changeRoom(room)
            break;
        case 'nick':
            words.shift();
            const name = words.join(' ')
            this.socket.emit('nameAttempt', name)
            break
        default:
            message = 'Unrecognize command';
    }
    return message;
};
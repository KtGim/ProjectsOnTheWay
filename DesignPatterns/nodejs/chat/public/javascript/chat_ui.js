/*
 * @Author: your name
 * @Date: 2020-04-25 20:45:34
 * @LastEditTime: 2020-04-25 23:36:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\chat\public\javascript\chat_ui.js
 */
function divEscapedContentElement(message) {
    return $('<div></div>').text(message)
};

function divSystemContent(message) {
    return $('<div></div>').html(`<li>${message}</li>`)
};

function processChatUserInput(ChatApp, socket) {
    var message = $('#send-message').val()
    var systemMessage;
    if(message.charAt(0) === '/') {
        systemMessage = ChatApp.processCommand(message)
        if(systemMessage) {
            $('#message').append(divSystemContent(systemMessage))
        }
    } else {
        ChatApp.sendMessage($('#room', message))
        $('#message').append(divEscapedContentElement(message))
        $('#message').scrollTop($('#message').prop('scrollHeight'))
    }
    $('#send-message').val('')
};

const socket = io.connect();

$(document).ready(function() {
    var ChatApp = new Chat(socket);
    socket.on('nameResult', function(result) {
        let message = result.message;
        if(result.success) {
            message =  `you are now known as ${name}`
        } else {
            message = result.message;
        }
        $('#message').append(divSystemContent(result.message))
    })
    socket.on('joinResult', function(result) {
        $('#room').text(result.room)
        $('#message').append(divSystemContent('Room changed..'))
    })
    socket.on('message', function(message) {
        $('#message').append($('<div></div>').text(message.text))
    })
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();
        for (let room in rooms) {
            room = room.substring(1, room.length)
            if(room !== '') {
                $('#room-list').append(divEscapedContentElement(room))
            }
        }
        $('#room-list div').click(function() {
            ChatApp.processCommand('/join' + $(this).text())
            $('#send-message').fcous();
        })
        setInterval(function() {
            socket.emit('rooms')
        }, 1000)
        $('#send-message').fcous();
        $('#send-form').submit(function() {
            processChatUserInput(ChatApp, socket);
            return false;
        })
    })
});
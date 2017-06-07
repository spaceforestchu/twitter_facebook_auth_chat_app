'use strict';

const helper = require('../helpers/helpers');

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;



  io.of('/roomslist').on('connection', socket => {
    socket.on('getChatrooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });

    socket.on('createNewRoom', newRoomInput => {

      if(!helper.findRoomByName(allrooms, newRoomInput)) {
        allrooms.push({
          room: newRoomInput,
          roomID: helper.randomHex(),
          users: []
        });
        socket.emit('chatRoomsList', JSON.stringify(allrooms));

        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    });

  });

  io.of('/chatter').on('connection', socket => {
    socket.on('join', data => {
      let usersList = helper.addUserToRoom(allrooms, data, socket);

      console.log(usersList.users);
      socket.broadcast.to(data.roomID).emit('updateUserList', JSON.stringify(usersList.users));
      socket.emit('updateUserList', JSON.stringify(usersList.users));
    });

    socket.on('disconnect', () => {
      let room = helper.removeUserFromRoom(allrooms, socket);
      socket.broadcast.to(room.roomID).emit('updateUserList', JSON.stringify(room.users));
    });

    socket.on('newMessage', data => {
      socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
    });

  });

}

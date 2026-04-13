let ioInstance = null;

function setSocketServer(io) {
  ioInstance = io;
}

function getSocketServer() {
  return ioInstance;
}

function emitBoardEvent(boardId, eventName, payload) {
  if (ioInstance) {
    ioInstance.to(`board:${boardId}`).emit(eventName, payload);
  }
}

module.exports = {
  setSocketServer,
  getSocketServer,
  emitBoardEvent
};

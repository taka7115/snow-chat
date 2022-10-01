export default class ApiClient {
  socket: any;
  constructor(socket) {
    this.socket = socket;
  }
  /**
   * @param {Array} messageList
   * @return {void}
   */
  getRoomInfo() {
    this.socket.on("queryGetRoomInfo", (list) => {
      return list;
    });
  }
  /**
   * @param {object} messageList
   * @return {void}
   */
  putChatMessage(roomName, newMessage) {
    this.socket.emit('queryPutChatMessage', [roomName, newMessage]);
  }
  /**
   * @return {void}
   */
  requestAllDataStoredInServer() {
    this.socket.emit('queryRequestAllDataStoredInServer');
  }
  /**
   * @param {object} myClient
   * @return {void}
   */
  putMyClient(myClient) {
    this.socket.emit('queryPutMyClient', myClient);
  }
  /**
   * @param {string} targetRoom
   * @return {void}
   */
  putRoomInfo(targetRoom) {
    this.socket.emit('queryPutRoomInfo', targetRoom);
  }
  /**
   * @param {string} targetRoom
   * @return {void}
   */
  requestRoomInfo(targetRoom) {
    this.socket.emit('queryRequestRoomInfo', targetRoom);
  }
    /**
   * @param {string} targetUser
   * @param {string} targetPath
     * @return {void}
     */
    putNewIconForMessages(targetUser, targetPath) {
      this.socket.emit('queryPutNewIconForMessages', targetUser, targetPath);
    }
}
import crypto from "crypto";

export default class ApiServer {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }
  /**
   * @param {Array} clientList
   * @return {void}
   */
  responseAllDataStoredInServer(clientList) {
    this.io.emit("queryResponseAllDataStoredInServer", clientList);
  }
  /**
   * @param {Array} clientList
   * @return {void}
   */
  receiveRequireToken(clientList) {
    this.socket.on("queryReceiveRequireToken", () => {
      /**
       * to make a token
       * @param  {string} id - socket.id
       * @return {string}
       */
      const makeToken = (id) => {
        const str = "aqwsedrftgyhujiko" + id;
        return crypto.createHash("sha1").update(str).digest("hex");
      }
      // make a token
      const token = makeToken(this.socket.id);

      // update newClient
      const newClient = {
        id: token,
        userList: [],
        userIndex: null,
        room: [],
        roomIndex: null
      };
      clientList.push(newClient);

      // emit the token to client side
      this.responseNewTokenAndClient(token, newClient)
    });
  }
  /**
   * @param {string} token
   * @param {object} newClient
   * @return {void}
   */
  responseNewTokenAndClient(token, newClient) {
    this.io.emit("queryResponseNewTokenAndClient", [token, newClient]);
  }
  /**
   * @param {Array} clientList
   * @return {void}
   */
  receivePutMyClient(clientList) {
    this.socket.on("queryPutMyClient", (myClient) => {
      clientList.forEach((client, i) => {
        if (client.id === myClient.id) {
          clientList[i] = myClient;
        }
      });
    });
  }
  /**
   * @param {object} roomInfo
   * @return {void}
   */
  receivePutRoomInfo(roomInfo) {
    this.socket.on("queryPutRoomInfo", (roomName) => {
      if (!(roomInfo.find((room) => Object.keys(room)[0] === roomName))) {
        const newRoom = {
          [roomName]: []
        }
        roomInfo.push(newRoom);
      }
    });
  }
  /**
   * @param {Array} clientList
   * @return {void}
   */
  receiveRequestAllDataStoredInServer(clientList) {
    this.socket.on("queryRequestAllDataStoredInServer", () => {
      this.responseAllDataStoredInServer(clientList);
    });
  }
  /**
   * @param {object} roomInfo
   * @return {void}
   */
  receiveRequestRoomInfo(roomInfo) {
    this.socket.on("queryRequestRoomInfo", (roomName) => {
      const roomData = roomInfo.filter((room) => Object.keys(room)[0] === roomName);
      const messageList = Object.values(roomData)[0][roomName];
      this.io.emit("queryGetRoomInfo", messageList);
    });
  }
  /**
   * @param {object} roomInfo
   * @return {void}
   */
  receivePutChatMessage(roomInfo) {
    this.socket.on("queryPutChatMessage", (messageInfo) => {
      const roomName = messageInfo[0];
      const newMessage = messageInfo[1];

      roomInfo.forEach((room, i) => {
        if (Object.keys(room)[0] === roomName) {
          roomInfo[i][roomName].push(newMessage);
        }
        this.io.emit("queryGetRoomInfo", roomInfo[i][roomName]);
      });
    });
  }
  /**
   * @param {object} roomInfo
   * @return {void}
   */
  receivePutNewIconForMessages(roomInfo) {
    this.socket.on("queryPutNewIconForMessages", (name, newIcon) => {
      if (roomInfo === []) {
        return;
      }
      roomInfo.map((room, i) => {
        Object.values(room).map((messages, j) => {
          messages.map((message, k) => {
            if (message.user.name === name) {
              message.user.path = newIcon;
            }
          });
        });
      });
    });
  }
}
import express from "express";
import http from "http";
import path from "path";
import {
  createServer
} from "http";
import {
  Server
} from "socket.io";
import multer from "multer";
import crypto from "crypto";

(function () {

  /**
   * * @description method with response - prefix works immediately after connection *
     @description method with receive - prefix works when some request 
   * api↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
   */

  class ApiServer {
    constructor(io, socket) {
      this.io = io;
      this.socket = socket;
    }
    /**
     * @param {Array} clientList
     * @return {void}
     */
    responseAllDataStoredInServer(token, clientList) {
      this.io.emit("queryAllDataStoredInServer", [token, clientList]);
    }
    /**
     * @param {Array} clientList
     * @return {void}
     */
    receiveRequireToken(clientList) {
      this.socket.on("queryRequireToken", () => {
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
        this.responseNewTokenAndClient(token, newClient);
      });
    }
    /**
     * @param {string} token
     * @param {object} newClient
     * @return {void}
     */
    responseNewTokenAndClient(token, newClient) {
      this.io.emit("queryNewTokenAndClient", [token, newClient]);
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
      this.socket.on("queryRequestAllDataStoredInServer", (token) => {
        this.responseAllDataStoredInServer(token, clientList);
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
  /**
   * api↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
   */

  const app = express();
  app.use(express.static("public")); // get document root

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  const PORT = process.env.PORT || 3000;
  app.get("/public/", (req, res) => {
    // set up routing
    res.sendFile(__dirname + "/index.html");
  });

  // store
  const clientList = [];
  const roomInfo = [];

  /**
   * activate server
   */
  httpServer.listen(PORT);


  /**
   * upload image↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
   */
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${path.resolve('./public/uploaded/')}`); // Absolute path. Folder must exist, will not be created for you.
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })

  // response to uploaded image
  const upload = multer({ storage: storage });
  app.post('/upload', upload.single('userIcon'), (req, res) => {
    const imagePath = `/uploaded/${req.file.originalname}`;
    // ↓if JSON send↓
    // res.send(JSON.stringify({
    //   imagePath: imagePath
    // }));
    res.send(imagePath);
  })
  /**
   * upload image↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
   */






  /**
   * @param {object} socket
   */
  io.on("connection", (socket) => {
    const apiServer = new ApiServer(io, socket);

    /**
     * update clientList
     * @param {object} myClient
     */
    apiServer.receiveRequireToken(clientList);

    /**
     * update myClient of server
     * @param {object} myClient
     */
    apiServer.receivePutMyClient(clientList);

    /**
     * update roomInfo of server
     * @param {object} myClient
     */
    apiServer.receivePutRoomInfo(roomInfo);

    /**
     * response of all data of server
     * @return {void}
     */
    apiServer.receiveRequestAllDataStoredInServer(clientList);

    /**
     * response roomInfo of server
     * @param {object} myClient
     */
    apiServer.receiveRequestRoomInfo(roomInfo);

    /**
     * if no its room yet in `roomInfo`, add its room
     * if its room already, add just chat message
     * @param {Array<roomName, message>} messageInfo
     */
    apiServer.receivePutChatMessage(roomInfo);

    /**
     * reflect it in messages if icon changed
     * @param {string} id
     */
    apiServer.receivePutNewIconForMessages(roomInfo);
  });
})();

const { convertToObject } = require("typescript");

(function () {
  const express = require("express");
  const http = require("http");
  const path = require('path');
  const socketIo = require("socket.io");
  const app = express();
  const multer = require('multer')
  const crypto = require("crypto");

  app.use(express.static("public")); // get document root
  const server = http.Server(app); // define server

  const io = socketIo(server); // define io

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
  server.listen(PORT);


  /**
   * upload image↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
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
    // emit all data of server side
    io.emit("ioAllDataOfServer", clientList);
    /**
     * update clientList
     * @param {object} myClient
     */
    socket.on("ioRequireToken", () => {
      /**
       * to make a token
       * @param  {string} id - socket.id
       * @return {string}
       */
      function makeToken(id) {
        const str = "aqwsedrftgyhujiko" + id;
        return crypto.createHash("sha1").update(str).digest("hex");
      }
      // make a token
      const token = makeToken(socket.id);

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
      io.emit("ioNewTokenAndClient", [token, newClient]);
    });

    /**
     * update myClient of server
     * @param {object} myClient
     */
    socket.on("ioUpdateMyClientOfServer", (myClient) => {
      clientList.forEach((client, i) => {
        if (client.id === myClient.id) {
          clientList[i] = myClient;
        }
      });
    });

    /**
     * update roomInfo of server
     * @param {object} myClient
     */
    socket.on("ioUpdateRoomInfoOfServer", (roomName) => {
      if (!(roomInfo.find((room) => Object.keys(room)[0] === roomName))) {
        const newRoom = {
          [roomName]: []
        }
        roomInfo.push(newRoom);
      }
    });

    /**
     * response of all data of server
     * @return {void}
     */
    socket.on("ioRequestAllDataOfServer", () => {
      io.emit("ioAllDataOfServer", clientList);
    });

    /**
     * response roomInfo of server
     * @param {object} myClient
     */
    socket.on("ioRequestRoomInfo", (roomName) => {
      const roomData = roomInfo.filter((room) => Object.keys(room)[0] === roomName);
      const messageList = Object.values(roomData)[0][roomName];
      io.emit("ioResponseRoomInfo", messageList);
    });

    /**
     * if no its room yet in `roomInfo`, add its room
     * if its room already, add just chat message
     * @param {Array<roomName, message>} messageInfo
     */
    socket.on("ioAddChatMessage", (messageInfo) => {
      const roomName = messageInfo[0];
      const newMessage = messageInfo[1];

      roomInfo.forEach((room, i) => {
        if (Object.keys(room)[0] === roomName) {
          roomInfo[i][roomName].push(newMessage);
        }
        io.emit("ioResponseRoomInfo", roomInfo[i][roomName]);
      });
    });

    /**
     * reflect it in messages if icon changed
     * @param {string} id
     */
    socket.on("ioReflectNewIconForMessages", (name, newIcon) => {
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
  });
})();

import ApiServer from "./api.js";
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

(function () {
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

    // emit all data of server side
    apiServer.responseAllDataStoredInServer(clientList);
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

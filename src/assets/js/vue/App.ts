/**
 * import
 */
import { createApp } from "vue";
import globalProps from "./store/globalProps";
import router from "./router/router";

import { io } from "socket.io-client";
/**
 * Component
 */
import Page from "./component/page.vue";

/**
 * set Variable
 */
const App = () => {
  const storageId = sessionStorage.getItem("id");
  /**
   * set socket
   * @returns {String}
   */
  const options = {
    forceNew: true,
  };
  const host = location.host;
  console.log(host);
  const socket = io(`${host}/`, options);
  let myId = storageId || null;

  const setSocket = new Promise((resolve, reject) => {
    socket.on("connect", () => {
      // if no id in Storage
      if (!myId) {
        socket.emit("ioRequireToken");
        /**
         * get token from server side
         * @param {Array<string, Array>} TokenAndClient
         */
        socket.on("ioNewTokenAndClient", (tokenAndClient) => {
          // set id in storage
          sessionStorage.setItem("id", tokenAndClient[0]);

          myId = tokenAndClient[0];
          globalProps.$myClient = tokenAndClient[1];

          resolve("foo"); // after resolve(), setApp() will be executed
        });
        // if id in Storage
      } else {
        socket.on("ioAllDataOfServer", (clientList) => {
          for (const client of clientList) {
            if (client.id === myId) {
              globalProps.$myClient = client;
              resolve("foo"); // after resolve(), setApp() will be executed
            }
          }
        });
      }

      /**
       * update client
       * @param {Array<object>} updatedMyClient
       */
      socket.on("ioUpdateMyClient", (updatedMyClient) => {
        globalProps.$myClient = updatedMyClient;
      });
    });
  });

  /**
   * set App
   * @returns {void}
   */
  const setApp = () => {
    const config = {
      components: {
        Page,
      },
    };

    // create
    const vm = createApp(config);

    // define plugins
    vm.use(router);

    // provide & mount
    router.isReady().then(() => {
      vm.provide("$socket", socket);

      vm.provide("$globalProps", globalProps);
      vm.mount("#app");
    });
  };

  /**
   * setSocket => setApp
   * @returns {void}
   */
  setSocket.then(() => {
    setApp();
  });
};

export default App;

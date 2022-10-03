/**
 * import
 */
import {
  createApp
} from "vue";
import globalProps from "./store/globalProps";
import router from "./router/router";

import ApiClient from "../api";

import {
  io
} from "socket.io-client";
/**
 * Component
 */
import Page from "./component/page.vue";

/**
 * set global Variable
 */
const options = {
  forceNew: true,
};
const host = location.host;
const socket = io(`${host}/`, options);
const apiClient = new ApiClient(socket);

/**
 * set Variable
 */
const App = () => {
  const storageId = sessionStorage.getItem("id");
  /**
   * set socket
   * @returns {String}
   */
  let myId = storageId || null;

  const setSocket = new Promise((resolve, reject) => {
    socket.on("connect", () => {
      // if no id in Storage
      if (!myId) {
        socket.emit("queryRequireToken");
        /**
         * get token from server side
         * @param {Array<string, Array>} TokenAndClient
         */
        socket.on("queryNewTokenAndClient", (tokenAndClient) => {
          // set id in storage
          sessionStorage.setItem("id", tokenAndClient[0]);

          myId = tokenAndClient[0];
          globalProps.$myClient = tokenAndClient[1];

          resolve("resolve"); // after resolve(), setApp() will be executed
        });
      }

      // once page loaded, request all data stored in server
      socket.emit("queryRequestAllDataStoredInServer", myId);

      // reflect all data stored in server
      socket.on("queryAllDataStoredInServer", (arg) => {
        const [token, client] = arg;
        if (token === myId) {
          globalProps.$myClient = client;

          alert(token);
          console.log('$client');
          console.log(client);

          resolve("resolve"); // after resolve(), setApp() will be executed
        }
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
      vm.provide("$apiClient", apiClient);
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

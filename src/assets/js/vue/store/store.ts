import {
  createStore
} from 'vuex';

const state = {
  currentPage: 'top',
  userList: [],
  selectOptions: []
};
const mutations = {
  mutationsSelectOptions(state, payload) {
    state.selectOptions.push(payload);
  },
  mutationsUserList(state, payload) {
    state.userList.push(payload);
  },

  /**
 * update userList item which has is-current
 * @param state
 * @param payload
 */
  mutationSwitchCurrentPage(state, payload) {
    state.currentPage = payload;
  },

  /**
   * update userList item which has is-current
   * @param state
   * @param payload
   */
  mutationsAddCurrentUser(state, payload) {
    const userList = state.userList;
    const length = userList.length;
    userList.forEach((user, i) => {
      const payloadTrue = (user, i) => {
        if (i === payload) {
          user.klass = 'is-current';
        } else {
          delete user.klass;
        }
      };
      const payloadFalse = (user, i) => {
        if (i === length - 1) {
          user.klass = 'is-current';
        } else {
          delete user.klass;
        }
      };

      if (payload || payload === 0) {
        payloadTrue(user, i);
      } else {
        payloadFalse(user, i);
      }
    })
  },

  /**
 * remove klass value from item having is-current
 * @param state
 * @param payload
 */
  mutationsRemoveCurrentUser(state, payload) {
    const userList = state.userList;
    userList.splice(payload, 1);
  }
};

//   /**
//  * actions
//  * @param context
//  */
// const actions = {
//   actionsSelectOptions(context) {
//     context.commit('mutationsSelectOptions')
//   },
//   actionsUserList(context) {
//     context.commit('mutationsUserList')
//   }
// }

export const store = createStore({
  state,
  mutations
  // actions
})
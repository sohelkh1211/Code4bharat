import { configureStore } from '@reduxjs/toolkit';
import { edit_user } from './reducers/edit_user';
import { edit_admin } from './reducers/edit_user';
import { store_token } from './reducers/token';

const store = configureStore({
    reducer: {
        user: edit_user,
        admin: edit_admin,
        token: store_token,
    }
},
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
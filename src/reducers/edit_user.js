const initial_user = { id: '', name: '', email: '', links: {} };
export const edit_user = (state = initial_user, action) => {
    switch(action.type) {
        case 'edit_user': return { ...state, id: action.payload.id ,name: action.payload.name, email: action.payload.email, links: action.payload.links };
        default: return state;
    }
}

const initial_admin = { id: '', name: '', email: '', lists: {} };
export const edit_admin = (state = initial_admin, action) => {
    switch(action.type) {
        case 'edit_admin': return { ...state, id: action.payload.id , name: action.payload.name, email: action.payload.email, lists: action.payload.lists };
        default: return state;
    }
}
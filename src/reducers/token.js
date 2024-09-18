const initial_token = { value: '' };

export const store_token = (state = initial_token, action) => {
    switch(action.type) {
        case 'store': return { ...initial_token, value: action.payload };
        default: return state;
    }
}
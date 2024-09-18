export const user = (new_user) => {
    return {
        type: 'edit_user',
        payload: new_user
    }
}

export const admin = (new_admin) => {
    return {
        type: 'edit_admin',
        payload: new_admin
    }
}

export const token = (new_token) => {
    return {
        type: 'store',
        payload: new_token
    }
}
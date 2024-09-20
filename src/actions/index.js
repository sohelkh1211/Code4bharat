export const user = (new_user) => {
    return {
        type: 'edit_user',
        payload: new_user
    }
}

export const delete_link = (id) => {
    return {
        type: 'DELETE_LINK',
        payload: id
    }
}

export const update_document_name = (id, newName) => {
    return {
    type: 'UPDATE_DOCUMENT_NAME',
    payload: { id, name: newName }
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
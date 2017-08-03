'use strict'

exports = module.exports = {};

function present(client) {
  
    let cp = {
        id: client.id,
        clientID: client.client_id,
        created: user.created_at,
        updated: user.updated_at
    };

    if (client.user) {
        cp.user = {
            id: client.user.id,
            email: client.user.email,
            created: user.role.created_at,
            updated: user.role.updated_at,
        }
    }
    
    return cp;
}

exports.toJson = function (client) {
    if (client) {
        let clientObj = client.serialize();
        if (Array.isArray(clientObj)) {
            return {
                pagination: client.pagination,
                data: clientObj.map(present)
            };
        }
        return present(clientObj);
    }
    return null;
};
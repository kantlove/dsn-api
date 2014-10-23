exports.models = {
    "User": {
        "id": "User",
        "require": ["userId, username"],
        "properties": {
            "userId": {
                "type": "string",
                "description": "Unique Id of a user"
            },
            "username": {
                "type": "string",
                "description": "name of user"
            }
        }
    }
}

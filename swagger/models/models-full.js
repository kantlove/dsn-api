module.exports = {
	// User
    "User": {
        "id": "User",
        "required": ["id", "username", "email", "password"],
        "properties": {
            "id": {
                "type": "int",
                "description": "User unique identifier"
            },
            "username": {
                "type": "string",
                "description": "Username of the user"
            },
            "email": {
                "type": "string",
                "description": "Email of the user"
            },
            "password": {
                "type": "string",
                "description": "Password of the user"
            },
            "fullname": {
                "type": "string",
                "description": "Fullname of the user"
            }
        }
    },
    
    // Session
    "Session": {
        "id": "Session",
        "required": ["id", "user_id", "expire"],
        "properties": {
            "id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "user_id": {
                "type": "int",
                "description": "Related user"
            },
            "expire": {
                "type": "date",
                "format": "string",
                "description": "The expired date of the session"
            }
        }
    },

    // Dream
    "Dream": {
        "id": "Dream",
        "required": ["id", "user_id"],
        "properties": {
            "id": {
                "type": "int",
                "description" : "Dream unique identifier"
            },
            "user_id": {
                "type": "int",
                "description": "Author of the dream"
            },
            "text": {
                "type": "string",
                "description": "Content of the dream"
            }
        }
    },

    // Achievement
    "Achievement": {
        "id": "Achievement",
        "required" : ["id", "dream_id"],
        "properties": {
            "id": {
                "type": "int",
                "description": "Achievement unique identifier"
            },
            "dream_id": {
                "type": "int",
                "description": "Related dream"
            },
            "text": {
                "type": "string",
                "description": "Content of the achievement"
            }
        }
    },
    
    "Hashtag": {
        "id": "Hashtag",
        "required": ["id", "text"],
        "properties": {
            "id": {
                "type": "int",
                "description": "Hashtag unique identifier"
            },
            "text": {
                "type": "string",
                "description": "Hastag content"
            }
        }
    }
}
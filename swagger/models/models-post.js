module.exports = {
	// User
    "UserPost": {
        "id": "UserPost",
        "required": ["username", "email", "password", "fullname"],
        "properties": {
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
    "SessionPost": {
        "id": "SessionPost",
        "required": ["user_id"],
        "properties": {
            "user_id": {
                "type": "int",
                "description": "Related user"
            }
        }
    },
    
    // Session but with username & password
    "SessionPost2": {
        "id": "SessionPost2",
        "required": ["username", "password"],
        "properties": {
            "username": {
                "type": "string",
                "description": "Username"
            },
            "password": {
                "type": "string",
                "description": "User's password"
            }
        }
    },

    // Dream
    "DreamPost": {
        "id": "DreamPost",
        "required": ["session_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "text": {
                "type": "string",
                "description": "Content of the dream"
            }
        }
    },

    // Achievement
    "AchievementPost": {
        "id": "AchievementPost",
        "required": ["session_id", "dream_id", "text"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "dream_id": {
                "type": "int",
                "description": "Dream unique identifier"
            },
            "text": {
                "type": "string",
                "description": "Content of the achievement"
            }
        }
    },
    
    // Hashtag
    "HashtagPost": {
        "id": "HashtagPost",
        "required": ["hashtag_id", "text"],
        "properties": {
            "hashtag_id": {
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
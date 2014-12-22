module.exports = {
    // User
    "UserDelete": {
        "id": "UserDelete",
        "required": ["session_id", "user_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "user_id": {
                "type": "int",
                "description": "User unique identifier"
            }
        }
    },

    // Dream
    "DreamDelete": {
        "id": "DreamDelete",
        "required": ["session_id", "dream_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "dream_id": {
                "type": "int",
                "description": "Dream unique identifier"
            }
        }
    },

    // Achievement
    "AchievementDelete": {
        "id": "AchievementDelete",
        "required": ["session_id", "achievement_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "achievement_id": {
                "type": "int",
                "description": "Achievement unique identifier"
            }
        }
    },

    // Unfollow
    "Unfollow": {
        "id": "Unfollow",
        "required": ["session_id", "user_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "user_id": {
                "type": "int",
                "description": "User unique identifier"
            }
        }
    }
}
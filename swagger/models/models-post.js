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

    // Session for testing
    "SessionPost1": {
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
                "description": "Password"
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
    },

    // Follow
    "FollowPost": {
        "id": "FollowPost",
        "required": ["session_id", "user_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "user_id": {
                "type": "int",
                "description": "Unique identifier of the user who you want to follow"
            }
        }
    },

    // DreamLikePost
    "DreamLikePost": {
        "id": "DreamLikePost",
        "required": ["session_id", "dream_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "dream_id": {
                "type": "int",
                "description": "Unique identifier of the dream who user want to like"
            }
        }
    },

    // AchievementLikePost
    "AchievementLikePost": {
        "id": "AchievementLikePost",
        "required": ["session_id", "achievement_id"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "achievement_id": {
                "type": "int",
                "description": "Unique identifier of the achievement who user want to like"
            }
        }
    },

    // DreamCommentPost
    "DreamCommentPost": {
        "id": "DreamCommentPost",
        "required": ["session_id", "dream_id", "text"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "dream_id": {
                "type": "int",
                "description": "Unique identifier of the dream who user want to like"
            },
            "text": {
                "type": "string",
                "description": "Content of the comment"
            }
        }
    },

    // AchievementCommentPost
    "AchievementCommentPost": {
        "id": "AchievementCommentPost",
        "required": ["session_id", "achievement_id", "text"],
        "properties": {
            "session_id": {
                "type": "int",
                "description": "Session unique identifier"
            },
            "achievement_id": {
                "type": "int",
                "description": "Unique identifier of the dream who user want to like"
            },
            "text": {
                "type": "string",
                "description": "Content of the comment"
            }
        }
    }
}
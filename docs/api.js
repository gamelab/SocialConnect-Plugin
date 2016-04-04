YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Kiwi.Plugins.SocialConnect",
        "Kiwi.Plugins.SocialConnect.Base",
        "Kiwi.Plugins.SocialConnect.Facebook",
        "Kiwi.Plugins.SocialConnect.Gamefroot",
        "Kiwi.Plugins.SocialConnect.Manager",
        "Kiwi.Plugins.SocialConnect.Twitter"
    ],
    "modules": [
        "Kiwi",
        "Plugins",
        "SocialConnect"
    ],
    "allModules": [
        {
            "displayName": "Kiwi",
            "name": "Kiwi"
        },
        {
            "displayName": "Plugins",
            "name": "Plugins",
            "description": "SocialConnect is a plugin that helps you connect to social media services."
        },
        {
            "displayName": "SocialConnect",
            "name": "SocialConnect",
            "description": "Contains the functionality for handling/communicating with the Facebook SDK.\n\nThis Plugin will check to see the Facebook SDK already exists when it is created,\nand a second time when the init method is called. \nIf the SDK is not found, one is loaded for you when the \"init\" method is called."
        }
    ]
} };
});
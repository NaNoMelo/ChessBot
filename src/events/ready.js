const { client } = require("../index.js")

module.exports = {
    event: "ready",
    run: function () {
        console.log("Bot is online", client.user?.tag)
        console.log(client.application?.commands)
    }
}
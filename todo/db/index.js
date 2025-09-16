const models = {
    User: require("./models/User"),
    Todo: require("./models/Todo")
}

module.exports = {
    ...models
}
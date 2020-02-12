module.exports = {
  headers: 3,
  answers: [
    {
      type: "options",
      hasTriggers: true
    },
    {
      type: "options",
      hasTriggers: false
    },
    {
      type: "options",
      hasTriggers: false
    }
  ],
  results: {
    min: 1,
    max: 3
  }
}

const app = require("./app");
const port = process.env.PORT || 3000;

// Start the server on the specified port
app.listen(port, () => console.log(`Server started on port ${port}`));

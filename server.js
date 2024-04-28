const app = require('./app');
const PORT = process.env.PORT || 3002;
const connectDatabase = require('./db/Database')

connectDatabase();
const server = app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});

// Handle uncaught exception
process.on("uncaughtException", (error) => {
    console.log(`Error: ${error.message}`);
    console.log("Shutting down the server for handling uncaught exception");
    server.close(() => {
        process.exit(1);
    });
});

// Handle unhandled promise rejection
process.on('unhandledRejection', (error) => {
    console.log(`Shutting down the server for unhandled promise rejection: ${error.message}`);
    server.close(() => {
        process.exit(1);
    });
});

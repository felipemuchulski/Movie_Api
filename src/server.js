require("express-async-errors")
const express = require('express');
const AppError = require('./utils/AppError');
const app = express();
const connectionSqlServer = require("../src/database/sqlserver/index")
const routes = require("./routes/index");
app.use(express.json());
app.use(routes);

connectionSqlServer();

app.use((error, request, response, next) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    
    console.error(error);
    
    return response.status(500).json({
        status: "error",
        message: error.message
    });
});

// Running server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// User create and update
const { hash, compare} = require("bcryptjs");
const AppError = require("../utils/AppError");

// Import SQL Server Connection
const sqlServerConnection = require("../database/sqlserver");

class UsersControllers {
  async create(request, response) {
    const {name, email, password} = request.body;

    const database = await sqlServerConnection();
    const checkUserExists = await database.request()
    .input('email', email)
    .query("SELECT * FROM users WHERE email = @email");

    if(checkUserExists.recordset.length > 0){
        throw new AppError("E-mail exits", 400);
    }

    // Encrypting the password 
    const hashedPassword = await hash(password, 10);
    
    // Create user
    await database.request()
    .input("name", name)
    .input("email", email)
    .input("password", hashedPassword)
    .query("INSERT INTO users (nome, email, senha) VALUES (@name, @email, @password)");

    // Response create
    return response.status(201).json({message: "Registered User"})    
  }

  async update(request, response) {
    const {name, email, password, old_password} = request.body;
    const {id} = request.params;

    const database = await sqlServerConnection();
    const checkUserExists = await database.request()
    .input("id", id)
    .query("SELECT * FROM users WHERE id = @id");

    if(checkUserExists.recordset.length === 0){
        throw new AppError("User not register", 404);
    }

    const currentUser = checkUserExists.recordset[0];
    const updatedName = name || currentUser.name;
    const updatedEmail = email || currentUser.email;

    // Check email exist in another user
    if(email && email !== currentUser.email){
        const userWithUpdatedEmail = await database.request()
            .input("email", email)
            .query("SELECT * FROM users WHERE email = @email");
        
            if(userWithUpdatedEmail.recordset.length > 0 && userWithUpdatedEmail.recordset[0].id !== parseInt(id)){
                throw new AppError("Email exist", 400)
            }
    }

    let hashedPassword = currentUser.password;
    if (password && !old_password){
        throw new AppError("You need to provide the old password to update the new one", 400);
    }

    if (password && old_password){
        const checkoldPassword = await compare(old_password, currentUser.password);
        if (!checkoldPassword) {
            throw new AppError("The old password does not match", 400);
        }
        hashedPassword = await hash(password, 10); // Encrypting the password 
    }

    // Updated User
    const update_at = new Date();
    await database.request()
        .input("name", updatedName)
        .input("email", updatedEmail)
        .input("password", hashedPassword)
        .input("updated_at", update_at)
        .input("id", id)
        .query("UPDATE users SET name = @name, email = @email, password = @password, updated_at = @updated_at WHERE id = @id");
    
    return response.status(200).json({message: "Updated User"});
  }
}

module.exports = UsersControllers;
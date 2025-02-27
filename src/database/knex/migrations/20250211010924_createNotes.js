exports.up = knex => knex.schema.createTable("Movie_Notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("raiting");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());

});

exports.down = knex => knex.schema.dropTable("Movie_Notes");

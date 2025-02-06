const knex = require("../database/knex/knex");

class MoveNotesController{
    async create(request, response){
        const {title, description, raiting } = request.body;
        const { id } = request.params;

        try {
          // Create Move Notes
          const note_id = await knex("Movie_Notes")
            .insert({
                title,
                description,
                raiting,
            })
            .then(() => knex("Movie_Notes").select("id").orderBy("id", "desc").first()) 
            .then(note => note.id);

          if (!note_id) {
                return response.status(500).json({ error: "Failed to create note "});
          }

          console.log("ID Note: ", note_id);
          return response.status(201).json({message: "Note created"});
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error "});
        }
    }
}
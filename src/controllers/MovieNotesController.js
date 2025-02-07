const knex = require("../database/knex/knex");

class MoveNotesController{
    async create(request, response){
        const {title, description, raiting, tags } = request.body;
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

          // Insert move_tag
          const tagsInsert = tags.map(name => ({
              note_id,
              id,
              name
          }));
          await knex("movie_tags").insert(tagsInsert);
          
          console.log("ID Note: ", note_id);
          return response.status(201).json({message: "Note created"});
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error "});
        }
    }

    async show(request, response){
      const {id} = request.params;
      console.log("Id recebido", id);

      const note = await knex("Movie_Notes").where({id}).first();
      const tags = await knex("tags").where({note_id: id}).orderBy("name");
      return response.json({
        ...note,
        tags
      });
    }
    
    async delete(request, response){
      const {id} = request.params;
      await knex("Movie_Notes").where({id}).delete();

      return response.json();
    }

    async index(request, respose){
      const {id, title, tags} = request.query;

      let notes;

      if(tags){
        
      }
    }

}
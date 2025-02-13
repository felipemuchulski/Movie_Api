const knex = require("../database/knex/knex");

class MoveNotesController{
    async create(request, response){
        const {title, description, raiting, user_id, tags } = request.body;
        const { id } = request.params;

        try {
          // Create Move Notes
          const [note] = await knex("Movie_Notes")
            .insert({
                title,
                description,
                raiting,
                user_id
            }).returning("id");           
          
          const note_id = note.id

          if (!note_id) {
                return response.status(500).json({ error: "Failed to create note "});
          }

          // Insert move_tag
          const tagsInsert = tags.map(name => ({
              note_id,
              user_id,
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
      const tags = await knex("movie_tags").where({note_id: id}).orderBy("name");
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

    async index(request, response) {
      const { id, title, tags } = request.query;
  
      if (!id || !title) {
          return response.status(400).json({ error: "Parâmetros inválidos" });
      }
  
      let notes;
  
      if (tags) {
          const filterTags = tags.split(',').map(tag => tag.trim());
  
          notes = await knex("movie_tags")
              .select([
                  "movie_notes.id",
                  "movie_notes.title",
                  "movie_notes.user_id"
              ])
              .where("movie_notes.user_id", id)
              .whereLike("movie_notes.title", `%${title}%`)
              .whereIn("movie_tags.name", filterTags)
              .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
              .orderBy("movie_notes.title");
      } else {
          notes = await knex("movie_notes")
              .where({ user_id: id })
              .whereLike("title", `%${title}%`)
              .orderBy("title");
      }
  
      const userTags = await knex("movie_tags").where({ user_id: id });
  
      const notesWithTags = notes.map(note => {
          const noteTags = userTags.filter(tag => tag.note_id === note.id);
          return { ...note, tags: noteTags };
      });
  
      return response.json({ notesWithTags });
  }
  
}

module.exports = MoveNotesController;
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

    async index(request, response){
      const {id, title, tags} = request.query;

      let notes;

      if(tags){
        const filterTags = tags.split(',').map(tag => tag.trim());
        console.log(filterTags);

        notes = await knex("tags")
          .select([
            "Movie_Notes.id",
            "Movie_Notes.title",
            "Movie_Notes.user_id"
          ])
          .where("Movie_Notes.user_id", id)
          .whereLike("Movie_Notes.title", `%${title}%`)
          .whereIn("movie_tags.name", filterTags)
          .innerJoin("Movie_Notes", "Movie_Notes.id", "movie_tags.note_id")
          .orderBy("Movie_Notes.title")
      } else {
        notes = await knex("Movie_Notes")
          .where({id})
          .whereLike("title", `%${title}%`)
          .orderBy("title");
      }

      const userTags = await knex("movie_tags").where({user_id: id});
      const notesWithTags = notes.map(note => {
        const noteTags = userTags.filter(tag => tag.note_id === note.id)

        return {
          ...note,
          tags: noteTags
        }
      });

      return response.json({ notesWithTags })
    }
}

module.exports = MoveNotesController;
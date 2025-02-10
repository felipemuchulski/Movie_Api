const {Router} = require("express");

const NotesControllers = require("../controllers/MovieNotesController");
const notesRoutes = Router();

const notesController = new NotesControllers();

notesRoutes.get("/", notesController.index);
notesRoutes.post("/:user_id", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;
package co.logn.webservice;

import co.logn.model.Note;
import co.logn.service.assignment.AssignmentService;
import co.logn.service.event.EventService;
import co.logn.service.note.NoteService;
import org.codehaus.jettison.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 *
 * Endpoint for responsing data of notes
 */

@Component
@Path("/note")
@Produces(MediaType.APPLICATION_JSON)
public class NoteRest {

    @Autowired
    NoteService noteService;

    @Autowired
    EventService eventService;

    @Autowired
    AssignmentService assignmentService;

    /**
     * Gets all notes for an event
     * @return status Response
     */
    @GET
    @Path("/event/{eventId}")
    public Response getNotesOfEvent(@PathParam("eventId") String eventId){
        JSONArray notes = eventService.getNotes(eventId);
        if(notes.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(notes.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Gets all notes for an assignment
     * @param assignmentId
     * @return status Response
     */
    @GET
    @Path("/assignment/{assignmentId}")
    public Response getNotesOfAssignment(@PathParam("assignmentId") String assignmentId){
        JSONArray assignments = assignmentService.getNotes(assignmentId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Gets notes list filtered by date
     * @param date
     * @return status Response
     */
    @GET
    @Path("/date/{date}")
    public Response getNotesByDate(@PathParam("date")String date) throws ParseException {
        JSONArray notes = noteService.getNotesByDate(date);
        if(notes.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(notes.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Gets notes list filtered by range date
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/dates/{startDate}/{endDate}/range")
    public Response getNotesByDatesRange(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray notes = noteService.getNotesByDatesRange(startDate, endDate);
        if(notes.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(notes.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Persists on database the sent note into specific calendar
     * @param note
     * @param eventId
     * @return status Response
     */
    @POST
    @Path("/event/{eventId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createNoteIntoEvent(Note note, @PathParam("eventId") String eventId){
        eventService.addNote(note, eventId);
        if(note.getId() == null){
            return Response.serverError().build();
        }
        else{
            return Response.ok(note, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Persists new note for an assignment
     * @param note
     * @param assignmentId
     * @return status Response
     */
    @POST
    @Path("/assignment/{assignmentId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createNoteIntoAssignment(Note note, @PathParam("assignmentId") String assignmentId){
        assignmentService.addNote(note, assignmentId);
        if(note.getId() == null){
            return Response.serverError().build();
        }
        else{
            return Response.ok(note, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Updates an specific note
     * @param note
     * @param eventId
     * @return status Response
     */
    @PUT
    @Path("/event/{eventId}/{noteId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateNoteOfEvent(@PathParam("eventId") String eventId, @PathParam("noteId") String noteId, Note note){
        if(note.getId() == null){
            return Response.serverError().build();
        }
        Note notePersisted = (Note)noteService.findByID(Note.class, noteId);
        if(notePersisted == null){
            return Response.noContent().build();
        }
        else{
            eventService.updateNoteById(eventId, noteId, note);
            return Response.ok(note, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Modify an specific note
     * @param note
     * @param assignmentId
     * @return status response
     */
    @PUT
    @Path("/assignment/{assignmentId}/{noteId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateNoteOfAssignment(@PathParam("assignmentId") String assignmentId, @PathParam("noteId")String noteId, Note note){
        if(note.getId() == null){
            return Response.serverError().build();
        }
        Note notePersisted = (Note)noteService.findByID(Note.class, noteId);
        if(notePersisted == null){
            return Response.noContent().build();
        }
        else{
            assignmentService.updateNoteById(assignmentId, noteId, note);
            return Response.ok(note, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Deletes an specified note
     * @param noteId
     * @param eventId
     * @return status Response
     */
    @DELETE
    @Path("/event/{eventId}/{noteId}")
    public Response deleteNoteFromEvent(@PathParam("eventId") String eventId, @PathParam("noteId") String noteId){
        Note note = (Note)noteService.findByID(Note.class, noteId);
        if(note == null){
            return Response.noContent().build();
        }
        else{
            eventService.deleteNoteById(eventId, noteId);
            return Response.ok().build();
        }
    }

    /**
     * Deletes the specified note
     * @param noteId
     * @param assignmentId
     * @return status Response
     */
    @DELETE
    @Path("/assignment/{assignmentId}/{noteId}")
    public Response deleteNoteFromAssignment(@PathParam("noteId") String noteId, @PathParam("assignmentId") String assignmentId){
        Note note = (Note)noteService.findByID(Note.class, noteId);
        if(note == null){
            return Response.noContent().build();
        }
        else{
            assignmentService.deleteNoteById(assignmentId, noteId);
            return Response.ok().build();
        }
    }
}

package co.logn.service.event;

import co.logn.model.Assignment;
import co.logn.model.Note;
import co.logn.service.generic.GenericService;
import org.codehaus.jettison.json.JSONArray;

import java.io.Serializable;
import java.text.ParseException;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 * Bussiness layer for event entity
 */
public interface EventService extends GenericService {

    /**
     * Gets all notes for a specific event
     * @param eventId
     * @return notes list
     */
    public JSONArray getNotes(Serializable eventId);

    /**
     * Persists the actual note into the specific event
     * @param note
     * @param eventId
     * @return note identifier
     */
    public String addNote(Note note, Serializable eventId);

    /**
     * Updates the actual note for the specific event
     * @param note
     * @param eventId
     */
    public void updateNoteById(Serializable eventId, Serializable noteId, Note note);

    /**
     * Deletes the specified note in specific event
     * @param noteId
     * @param eventId
     */
    public void deleteNoteById(Serializable eventId, Serializable noteId);

    /**
     * Gets all assignments for a specific event
     * @param eventId
     * @return assignments list
     */
    public JSONArray getAssignments(Serializable eventId);

    /**
     * Persists the actual assignment into the specific calendar
     * @param assignment
     * @param eventId
     * @return assignment identifier
     */
    public String addAssignment(Assignment assignment, Serializable eventId);

    /**
     * Updates the actual assignment for the specific event
     * @param assignment
     * @param eventId
     */
    public void updateAssignmentById(Serializable eventId, Serializable assignmentId, Assignment assignment);

    /**
     * Deletes the specified assignment in specific event
     * @param assignmentId
     * @param eventId
     */
    public void deleteAssignmentById(Serializable eventId, Serializable assignmentId);

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDate(java.util.Date)
     */
    JSONArray getEventsByDate(String date) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDatesRange(java.util.Date, java.util.Date)
     */
    JSONArray getEventsByDatesRange(String startDate, String endDate) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByType(java.io.Serializable)
     */
    JSONArray getEventsByType(Serializable eventType);

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityStart(java.util.Date, java.util.Date)
     */
    JSONArray getEventsByVisibilityStart(String startDate, String endDate) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityEnd(java.util.Date, java.util.Date)
     */
    JSONArray getEventsByVisibilityEnd(String startDate, String endDate) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDateByUser(java.util.Date, java.io.Serializable)
     */
    JSONArray getEventsByDateByUser(String date, Serializable userId) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDatesRangeByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    JSONArray getEventsByDatesRangeByUser(String startDate, String endDate, Serializable userId) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    JSONArray getEventsByTypeByUser(Serializable eventType, Serializable userId);

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityStartByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    JSONArray getEventsByVisibilityStartByUser(String startDate, String endDate, Serializable userId) throws ParseException;

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityEndByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    JSONArray getEventsByVisibilityEndByUser(String startDate, String endDate, Serializable userId) throws ParseException;
}

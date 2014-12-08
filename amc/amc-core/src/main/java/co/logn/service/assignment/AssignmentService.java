package co.logn.service.assignment;

import co.logn.model.Note;
import co.logn.service.generic.GenericService;
import org.codehaus.jettison.json.JSONArray;
import java.io.Serializable;
import java.text.ParseException;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 * Bussiness layer for asignment entity
 */
public interface AssignmentService extends GenericService {

    /**
     * Gets all notes for a specific assignment
     * @param assignmentId
     * @return notes list
     */
    public JSONArray getNotes(Serializable assignmentId);

    /**
     * Persists the actual note into the specific assignment
     * @param note
     * @param assignmentId
     * @return note identifier
     */
    public String addNote(Note note, Serializable assignmentId);

    /**
     * Updates the actual note for the specific assignment
     * @param note
     * @param assignmentId
     */
    public void updateNoteById(Serializable assignmentId, Serializable noteId, Note note);

    /**
     * Deletes the specified note in specific assignment
     * @param noteId
     * @param assignmentId
     */
    public void deleteNoteById(Serializable assignmentId, Serializable noteId);

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDate(java.util.Date)
     */
    JSONArray getAssignmentsByDate(String date) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDatesRange(java.util.Date, java.util.Date)
     */
    JSONArray getAssignmentsByDatesRange(String startDate, String endDate) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByType(java.io.Serializable)
     */
    JSONArray getAssignmentsByType(Serializable assignmentType);

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityStart(java.util.Date, java.util.Date)
     */
    JSONArray getAssignmentsByVisibilityStart(String startDate, String endDate) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityEnd(java.util.Date, java.util.Date)
     */
    JSONArray getAssignmentsByVisibilityEnd(String startDate, String endDate) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDateByUser(java.util.Date, java.io.Serializable)
     */
    JSONArray getAssignmentsByDateByUser(String date, Serializable userId) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDatesRangeByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    JSONArray getAssignmentsByDatesRangeByUser(String startDate, String endDate, Serializable userId) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    JSONArray getAssignmentsByTypeByUser(Serializable assignmentType, Serializable userId);

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityStartByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    JSONArray getAssignmentsByVisibilityStartByUser(String startDate, String endDate, Serializable userId) throws ParseException;

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityEndByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    JSONArray getAssignmentsByVisibilityEndByUser(String startDate, String endDate, Serializable userId) throws ParseException;
}

package co.logn.dao.user;

import co.logn.dao.generic.GenericDao;
import org.codehaus.jettison.json.JSONArray;

import java.io.Serializable;

/**
 * Created by logn on 3/18/14.
 * @author Cristian Sanchez
 * DAO for local user entity
 */
public interface UserDao extends GenericDao{

    /**
     * Gets all events for an user
     * @param userId
     * @return events list
     */
    JSONArray getEventsByUser(Serializable userId);

    /**
     * Gets all assignments for an user
     * @param userId
     * @return assignments list
     */
    JSONArray getAssignmentsByUser(Serializable userId);

    /**
     * Gets all notes for an user
     * @param userId
     * @return notes list
     */
    JSONArray getNotesByUser(Serializable userId);
}

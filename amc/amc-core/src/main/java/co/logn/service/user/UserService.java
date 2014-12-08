package co.logn.service.user;

import co.logn.model.Calendar;
import co.logn.model.User;
import co.logn.service.generic.GenericService;
import org.codehaus.jettison.json.JSONArray;

import java.io.Serializable;

/**
 * Created by logn on 3/5/14.
 * @author Cristian Sanchez
 * Bussiness layer for local user entity
 */
public interface UserService extends GenericService {

    /**
     * Save a new user if this doesnt exist in database
     * @param user
     */
    void saveIfNew(final User user);

    /**
     * Add new calendar to user calendars list
     * @param calendar
     * @param userId
     * @return id of added calendar
     */
    String addCalendar(final Calendar calendar, String userId);

    /**
     * Gets all calendars for a specific user
     * @param userId
     * @return calendars list
     */
    JSONArray getCalendars(final String userId);

    /**
     * Deletes a specific calendar of users calendars
     * @param calendarId
     * @param userId
     */
    void deleteCalendarById(final String calendarId, final String userId);

    /**
     * @see co.logn.dao.user.UserDao#getEventsByUser(java.io.Serializable)
     */
    JSONArray getEventsByUser(Serializable userId);

    /**
     * @see co.logn.dao.user.UserDao#getAssignmentsByUser(java.io.Serializable)
     */
    JSONArray getAssignmentsByUser(Serializable userId);

    /**
     * @see co.logn.dao.user.UserDao#getNotesByUser(java.io.Serializable)
     */
    JSONArray getNotesByUser(Serializable userId);
}

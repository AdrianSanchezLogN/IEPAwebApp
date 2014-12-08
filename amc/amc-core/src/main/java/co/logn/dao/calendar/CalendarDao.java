package co.logn.dao.calendar;

import co.logn.dao.generic.GenericDao;
import org.codehaus.jettison.json.JSONArray;
import java.io.Serializable;

/**
 * Created by logn on 3/7/14.
 * @author Cristian Sanchez
 * DAO for calendar entity
 */
public interface CalendarDao extends GenericDao{

    /**
     * Gets all calendars by specific type
     * @param calendarType
     * @return calendars list
     */
    JSONArray getCalendarsByType(Serializable calendarType);

    /**
     * Gets all calendars by specific type for an user
     * @param calendarType
     * @param userId
     * @return calendars list
     */
    JSONArray getCalendarsByTypeByUser(Serializable calendarType, Serializable userId);
}

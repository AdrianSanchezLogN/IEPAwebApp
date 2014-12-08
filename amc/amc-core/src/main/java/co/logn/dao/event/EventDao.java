package co.logn.dao.event;

import co.logn.dao.generic.GenericDao;
import org.codehaus.jettison.json.JSONArray;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 * DAO for event entity
 */
public interface EventDao extends GenericDao {

    /**
     * Gets all events by date
     * @param date
     * @return events list
     */
    JSONArray getEventsByDate(Date date);

    /**
     * Gets all events by dates range
     * @param startDate
     * @param endDate
     * @return events list
     */
    JSONArray getEventsByDatesRange(Date startDate, Date endDate);

    /**
     * Gets all events by specific type
     * @param eventType
     * @return events list
     */
    JSONArray getEventsByType(Serializable eventType);

    /**
     * Gets all events by visibility start date between two dates
     * @param startDate
     * @param endDate
     * @return events list
     */
    JSONArray getEventsByVisibilityStart(Date startDate, Date endDate);

    /**
     * Gets all events by visibility end date between two dates
     * @param startDate
     * @param endDate
     * @return events list
     */
    JSONArray getEventsByVisibilityEnd(Date startDate, Date endDate);

    /**
     * Gets all events by date for an user
     * @param date
     * @param userId
     * @return events list
     */
    JSONArray getEventsByDateByUser(Date date, Serializable userId);

    /**
     * Gets all events by dates range for an user
     * @param startDate
     * @param endDate
     * @param userId
     * @return events list
     */
    JSONArray getEventsByDatesRangeByUser(Date startDate, Date endDate, Serializable userId);

    /**
     * Gets all events by specific type for an user
     * @param eventType
     * @param userId
     * @return events list
     */
    JSONArray getEventsByTypeByUser(Serializable eventType, Serializable userId);

    /**
     * Gets all events by visibility start date for an user
     * @param startDate
     * @param endDate
     * @param userId
     * @return events list
     */
    JSONArray getEventsByVisibilityStartByUser(Date startDate, Date endDate, Serializable userId);

    /**
     * Gets all events by visibility end date for an user
     * @param startDate
     * @param endDate
     * @param userId
     * @return events list
     */
    JSONArray getEventsByVisibilityEndByUser(Date startDate, Date endDate, Serializable userId);
}

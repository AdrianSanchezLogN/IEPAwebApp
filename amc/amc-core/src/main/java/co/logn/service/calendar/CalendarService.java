package co.logn.service.calendar;

import co.logn.model.Event;
import co.logn.service.generic.GenericService;
import org.codehaus.jettison.json.JSONArray;

import java.io.Serializable;

/**
 * Created by logn on 3/5/14.
 * @author Cristian Sanchez
 * Bussiness layer for calendar entity
 */
public interface CalendarService extends GenericService {

    /**
     * Gets all events for a specific event
     * @param calendarId
     * @return events list
     */
    public JSONArray getEvents(Serializable calendarId);

    /**
     * Persists the actual event into the specific calendar
     * @param event
     * @param calendarId
     * @return event identifier
     */
    public String addEvent(Event event, Serializable calendarId);

    /**
     * Updates the actual event for the specific calendar
     * @param event
     * @param calendarId
     */
    public void updateEventById(Serializable calendarId, Serializable eventId, Event event);

    /**
     * Deletes the specified event in specific calendar
     * @param calendarId
     * @param eventId
     */
    public void deleteEventById(Serializable calendarId, Serializable eventId);

    /**
     * @see co.logn.dao.calendar.CalendarDao#getCalendarsByType(java.io.Serializable)
     */
    JSONArray getCalendarsByType(Serializable calendarType);

    /**
     * @see co.logn.dao.calendar.CalendarDao#getCalendarsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    JSONArray getCalendarsByTypeByUser(Serializable calendarType, Serializable userId);
}

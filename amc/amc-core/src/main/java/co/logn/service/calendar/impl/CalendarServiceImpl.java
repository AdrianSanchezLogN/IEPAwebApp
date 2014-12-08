package co.logn.service.calendar.impl;

import co.logn.dao.calendar.CalendarDao;
import co.logn.dao.event.EventDao;
import co.logn.model.Calendar;
import co.logn.model.Event;
import co.logn.service.calendar.CalendarService;
import co.logn.service.generic.impl.GenericServiceImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jettison.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectRetrievalFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.io.Serializable;

/**
 * @see co.logn.service.calendar.CalendarService
 */

@Service("calendarService")
public class CalendarServiceImpl extends GenericServiceImpl implements CalendarService {

    /**
     * Logger
     */
    Log LOG = LogFactory.getLog(CalendarServiceImpl.class);

    @Autowired
    CalendarDao calendarDao;

    @Autowired
    EventDao eventDao;

    @PostConstruct
    public void init(){
        setGenericDao(calendarDao);
    }

    /**
     * Gets all events for a calendar
     * @param calendarId
     * @return events list
     */
    @Override
    public JSONArray getEvents(Serializable calendarId) {
        Calendar calendar = (Calendar)calendarDao.findByID(Calendar.class, calendarId);
        if(calendar == null){
            LOG.error("Calendar with id:" + calendarId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Calendar.class, calendarId);
        }
        else
        {
            JSONArray eventsArray = new JSONArray(calendar.getEvents());
            return eventsArray;
        }
    }

    /**
     * Persists an event into a calendar
     * @param event
     * @param calendarId
     * @return event identifier
     */
    @Override
    @Transactional(readOnly = false)
    public String addEvent(Event event, Serializable calendarId) {
        Calendar calendar = (Calendar)calendarDao.findByID(Calendar.class, calendarId);
        if(calendar == null){
            LOG.error("Calendar with id:" + calendarId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Calendar.class, calendarId);
        }
        else{
            calendar.getEvents().add(event);
            calendarDao.updateById(calendar);
            LOG.info("Event with id:" + event.getId() + " was added into calendar:" + calendarId);
            return event.getId();
        }
    }

    /**
     * Updates an event of a calendar
     * @param calendarId
     * @param eventId
     * @param event
     */
    @Override
    @Transactional(readOnly = false)
    public void updateEventById(Serializable calendarId, Serializable eventId, Event event) {
        Calendar calendar = (Calendar)calendarDao.findByID(Calendar.class, calendarId);
        if(calendar == null){
            LOG.error("Calendar with id:" + calendarId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Calendar.class, calendarId);
        }
        else{
            Event eventPersisted = (Event) eventDao.findByID(Event.class, event.getId());
            if(eventPersisted == null){
                LOG.error("Event with id:" + event.getId() + " doesnt exist");
                throw new ObjectRetrievalFailureException(Event.class, event.getId());
            }
            else{
                // Here must to be all conditions for each event's attribute to modify that isnt null
                LOG.info("Event with id:"+eventPersisted.getId()+" was updated successfully");
            }
        }
    }

    /**
     * Deletes an specific event of a calendar
     * @param calendarId
     * @param eventId
     */
    @Override
    @Transactional(readOnly = false)
    public void deleteEventById(Serializable calendarId, Serializable eventId) {
        Calendar calendar = (Calendar)calendarDao.findByID(Calendar.class, calendarId);
        if(calendar == null){
            LOG.error("Calendar with id:" + calendarId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Calendar.class, calendarId);
        }
        else{
            Event event = (Event)eventDao.findByID(Event.class, eventId);
            if(event == null){
                LOG.error("Event with id:" + eventId + " doesnt exist");
                throw new ObjectRetrievalFailureException(Event.class, eventId);
            }
            else{
                calendar.getEvents().remove(event);
                calendarDao.updateById(calendar);
                eventDao.delete(Event.class, eventId);
                LOG.info("Event with id:" + eventId + " was deleted successfully");
            }
        }
    }

    /**
     * @see co.logn.service.calendar.CalendarService#getCalendarsByType(java.io.Serializable)
     */
    @Override
    public JSONArray getCalendarsByType(Serializable calendarType){
        return calendarDao.getCalendarsByType(calendarType);
    }

    /**
     * @see co.logn.service.calendar.CalendarService#getCalendarsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    @Override
    public JSONArray getCalendarsByTypeByUser(Serializable calendarType, Serializable userId){
        return calendarDao.getCalendarsByTypeByUser(calendarType, userId);
    }
}

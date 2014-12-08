package co.logn.service.event.impl;

import co.logn.dao.assignment.AssignmentDao;
import co.logn.dao.event.EventDao;
import co.logn.dao.note.NoteDao;
import co.logn.model.Assignment;
import co.logn.model.Event;
import co.logn.model.Note;
import co.logn.service.event.EventService;
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
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @see co.logn.service.event.EventService
 */
@Service("eventService")
public class EventServiceImpl extends GenericServiceImpl implements EventService {

    @Autowired
    EventDao eventDao;

    @Autowired
    NoteDao noteDao;

    @Autowired
    AssignmentDao assignmentDao;

    @PostConstruct
    public void init(){
        setGenericDao(eventDao);
    }

    private static final Log LOG = LogFactory.getLog(EventServiceImpl.class);

    /**
     *
     * @see co.logn.service.event.EventService#getNotes(java.io.Serializable)
     */
    @Override
    public JSONArray getNotes(Serializable eventId){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Event.class, eventId);
        }
        else{
            JSONArray notesArray = new JSONArray(event.getNotes());
            return notesArray;
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#addNote(co.logn.model.Note, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public String addNote(Note note, Serializable eventId){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Event.class, eventId);
        }
        else{
            event.getNotes().add(note);
            eventDao.updateById(event);
            LOG.info("Note with id:" + note.getId() + " was added into event:" + eventId);
            return note.getId();
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#updateAssignmentById(java.io.Serializable, java.io.Serializable, co.logn.model.Assignment)
     */
    @Override
    @Transactional(readOnly = false)
    public void updateNoteById(Serializable eventId, Serializable noteId, Note note){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Event.class, eventId);
        }
        else{
            Note notePersisted = (Note)noteDao.findByID(Note.class, noteId);
            if(notePersisted == null){
                LOG.error("Note with id:" + note.getId() + " doesnt exist");
                throw new ObjectRetrievalFailureException(Note.class, noteId);
            }
            else{
                if(note.getBody() != null) {notePersisted.setBody(note.getBody());}
                if(note.isSendNotification() != notePersisted.isSendNotification()) {notePersisted.setSendNotification(note.isSendNotification());}
                if(note.getNoteDate() != null) {notePersisted.setNoteDate(note.getNoteDate());}
                if(note.getNotificationBody() != null) {notePersisted.setNotificationBody(note.getNotificationBody());}
                if(note.getNotificationSubject() != null) {notePersisted.setNotificationSubject(note.getNotificationSubject());}
                if(note.getOwnerCalendarId() != null) {notePersisted.setOwnerCalendarId(note.getOwnerCalendarId());}
                if(note.getTitle() != null) {notePersisted.setTitle(note.getTitle());}
                noteDao.updateById(notePersisted);
                LOG.info("Note with id:"+ noteId +" was updated successfully");
            }
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#deleteNoteById(java.io.Serializable, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public void deleteNoteById(Serializable noteId, Serializable eventId){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Event.class, eventId);
        }
        else{
            Note note = (Note)noteDao.findByID(Note.class, noteId);
            if(note == null){
                LOG.error("Note with id:" + noteId + " doesnt exist");
                throw new ObjectRetrievalFailureException(Note.class, noteId);
            }
            else{
                event.getNotes().remove(note);
                eventDao.updateById(event);
                noteDao.delete(Note.class, noteId);
                LOG.info("Note with id:" + noteId + " was deleted successfully");
            }
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#getAssignments(java.io.Serializable)
     */
    @Override
    public JSONArray getAssignments(Serializable eventId){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            return null;
        }
        else{
            JSONArray assignmentsArray = new JSONArray(event.getAssignments());
            return assignmentsArray;
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#addAssignment(co.logn.model.Assignment, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public String addAssignment(Assignment assignment, Serializable eventId){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Event.class, eventId);
        }
        else{
            event.getAssignments().add(assignment);
            eventDao.updateById(event);
            LOG.info("Assignment with id:" + assignment.getId() + " was added to event:" + eventId);
            return assignment.getId();
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#updateAssignmentById(java.io.Serializable, java.io.Serializable, co.logn.model.Assignment)
     */
    @Override
    @Transactional(readOnly = false)
    public void updateAssignmentById(Serializable eventId, Serializable assignmentId, Assignment assignment){
        Assignment assignmentPersisted = (Assignment)assignmentDao.findByID(Assignment.class, assignment.getId());
        // Must modify the assignment passing through attribute into event entity
        if(assignmentPersisted == null){
            LOG.error("Assignment with id:" + assignment.getId() + " doesnt exist");
            throw new ObjectRetrievalFailureException(Assignment.class, assignment.getId());
        }
        else {
            if(assignment.getName() != null) {assignmentPersisted.setName(assignment.getName());}
            if(assignment.getAssignmentType() != null) {assignmentPersisted.setAssignmentType(assignment.getAssignmentType());}
            if(assignment.getDescription() != null) {assignmentPersisted.setDescription(assignment.getDescription());}
            if(assignment.getDueDate() != null) {assignmentPersisted.setDueDate(assignment.getDueDate());}
            if(assignment.getVisibilityStartDate() != null) {assignmentPersisted.setVisibilityStartDate(assignment.getVisibilityStartDate());}
            if(assignment.getVisibilityEndDate() != null) {assignmentPersisted.setVisibilityEndDate(assignment.getVisibilityEndDate());}
            assignmentDao.updateById(assignmentPersisted);
            LOG.info("Assignment with id:"+assignment.getId()+" was updated successfully");
        }
    }

    /**
     *
     * @see co.logn.service.event.EventService#deleteAssignmentById(java.io.Serializable, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public void deleteAssignmentById(Serializable eventId, Serializable assignmentId){
        Event event = (Event)eventDao.findByID(Event.class, eventId);
        if(event == null){
            LOG.error("Event with id:" + eventId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Event.class, eventId);
        }
        else{
            Assignment assignment = (Assignment)assignmentDao.findByID(Assignment.class, assignmentId);
            if(assignment == null){
                LOG.error("Assignment with id:" + assignmentId + " doesnt exist");
                throw new ObjectRetrievalFailureException(Assignment.class, assignmentId);
            }
            else{
                event.getAssignments().remove(assignment);
                eventDao.updateById(event);
                assignmentDao.delete(Assignment.class, assignmentId);
                LOG.info("Assignment with id:" + assignmentId + " was deleted successfully");
            }
        }
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByDate(String)
     */
    @Override
    public JSONArray getEventsByDate(String date) throws ParseException{
        Date parsedDate = this.parseDate(date);
        return eventDao.getEventsByDate(parsedDate);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByDatesRange(String, String)
     */
    @Override
    public JSONArray getEventsByDatesRange(String startDate, String endDate) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return eventDao.getEventsByDatesRange(parsedStartDate, parsedEndDate);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByType(java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByType(Serializable eventType){
        return eventDao.getEventsByType(eventType);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByVisibilityStart(String, String)
     */
    @Override
    public JSONArray getEventsByVisibilityStart(String startDate, String endDate) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return eventDao.getEventsByVisibilityStart(parsedStartDate, parsedEndDate);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByVisibilityEnd(String, String)
     */
    @Override
    public JSONArray getEventsByVisibilityEnd(String startDate, String endDate) throws ParseException {
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return eventDao.getEventsByVisibilityEnd(parsedStartDate, parsedEndDate);
    }

    /**
     * Parse to Date format an string input
     * @param dateString
     * @return date
     * @throws java.text.ParseException
     */
    private Date parseDate(String dateString) throws ParseException{
        try{
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            Date date = df.parse(dateString);
            return date;
        }
        catch(ParseException e){
            throw new ParseException("Cant to parse " + dateString +" to date", 0);
        }
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByDateByUser(String, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByDateByUser(String date, Serializable userId) throws ParseException{
        Date parsedDate = this.parseDate(date);
        return eventDao.getEventsByDateByUser(parsedDate, userId);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByDatesRangeByUser(String, String, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByDatesRangeByUser(String startDate, String endDate, Serializable userId) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return eventDao.getEventsByDatesRangeByUser(parsedStartDate, parsedEndDate, userId);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByTypeByUser(Serializable eventType, Serializable userId){
        return eventDao.getEventsByTypeByUser(eventType, userId);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByVisibilityStartByUser(String, String, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByVisibilityStartByUser(String startDate, String endDate, Serializable userId) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return eventDao.getEventsByVisibilityStartByUser(parsedStartDate, parsedEndDate, userId);
    }

    /**
     * @see co.logn.service.event.EventService#getEventsByVisibilityEndByUser(String, String, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByVisibilityEndByUser(String startDate, String endDate, Serializable userId) throws ParseException {
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return eventDao.getEventsByVisibilityEndByUser(parsedStartDate, parsedEndDate, userId);
    }
}

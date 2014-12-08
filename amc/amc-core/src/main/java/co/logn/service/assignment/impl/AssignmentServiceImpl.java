package co.logn.service.assignment.impl;

import co.logn.dao.assignment.AssignmentDao;
import co.logn.dao.note.NoteDao;
import co.logn.model.Assignment;
import co.logn.model.Event;
import co.logn.model.Note;
import co.logn.service.assignment.AssignmentService;
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
import java.util.TimeZone;

/**
 * @see co.logn.service.assignment.AssignmentService
 */
@Service("assignmentService")
public class AssignmentServiceImpl extends GenericServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentDao assignmentDao;

    @Autowired
    private NoteDao noteDao;

    @PostConstruct
    public void init(){
        setGenericDao(assignmentDao);
    }

    private static final Log LOG = LogFactory.getLog(AssignmentServiceImpl.class);

    /**
     *
     * @see co.logn.service.assignment.AssignmentService#getNotes(java.io.Serializable)
     */
    @Override
    public JSONArray getNotes(Serializable assignmentId){
        Assignment assignment = (Assignment)assignmentDao.findByID(Assignment.class, assignmentId);
        if(assignment == null){
            LOG.error("Assignment with id:" + assignmentId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Assignment.class, assignmentId);
        }
        JSONArray notesArray = new JSONArray(assignment.getNotes());
        return notesArray;
    }

    /**
     *
     * @see co.logn.service.assignment.AssignmentService#addNote(co.logn.model.Note, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public String addNote(Note note, Serializable assignmentId){
        Assignment assignment = (Assignment)assignmentDao.findByID(Assignment.class, assignmentId);
        if(assignment == null){
            LOG.error("Assignment with id:" + assignmentId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Assignment.class, assignmentId);
        }
        else{
            assignment.getNotes().add(note);
            assignmentDao.updateById(assignment);
            LOG.info("Note with id:" + note.getId() + " was added into assignment:" + assignmentId);
            return note.getId();
        }
    }

    /**
     *
     * @see co.logn.service.assignment.AssignmentService#updateNoteById(java.io.Serializable, java.io.Serializable, co.logn.model.Note)
     */
    @Override
    @Transactional(readOnly = false)
    public void updateNoteById(Serializable assignmentId, Serializable noteId, Note note){
        Assignment assignment = (Assignment)assignmentDao.findByID(Assignment.class, assignmentId);
        if(assignment == null){
            LOG.error("Assignment with id:" + assignmentId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Assignment.class, assignmentId);
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
     * @see co.logn.service.assignment.AssignmentService#deleteNoteById(java.io.Serializable, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public void deleteNoteById(Serializable noteId, Serializable assignmentId){
        Assignment assignment = (Assignment)assignmentDao.findByID(Event.class, assignmentId);
        if(assignment == null){
            LOG.error("Assignment with id:" + assignmentId + " doesnt exist");
            throw new ObjectRetrievalFailureException(Assignment.class, assignment);
        }
        else{
            Note note = (Note)noteDao.findByID(Note.class, noteId);
            if(note == null){
                LOG.error("Note with id:" + noteId + " doesnt exist");
                throw new ObjectRetrievalFailureException(Note.class, noteId);
            }
            else{
                assignment.getNotes().remove(note);
                assignmentDao.updateById(assignment);
                noteDao.delete(Note.class, noteId);
                LOG.info("Note with id:" + noteId + " was deleted successfully");
            }
        }
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByDate(String)
     */
    @Override
    public JSONArray getAssignmentsByDate(String date) throws ParseException{
        Date parsedDate = this.parseDate(date);
        return assignmentDao.getAssignmentsByDate(parsedDate);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByDatesRange(String, String)
     */
    @Override
    public JSONArray getAssignmentsByDatesRange(String startDate, String endDate) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return assignmentDao.getAssignmentsByDatesRange(parsedStartDate, parsedEndDate);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByType(java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByType(Serializable assignmentType){
        return assignmentDao.getAssignmentsByType(assignmentType);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByVisibilityStart(String, String)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityStart(String startDate, String endDate) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return assignmentDao.getAssignmentsByVisibilityStart(parsedStartDate, parsedEndDate);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByVisibilityEnd(String, String)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityEnd(String startDate, String endDate) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return assignmentDao.getAssignmentsByVisibilityEnd(parsedStartDate, parsedEndDate);
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
            df.setTimeZone(TimeZone.getDefault());
            Date date = df.parse(dateString);
            long time = date.getTime();
            Date date2 = new Date(time);
            return date;
        }
        catch(ParseException e){
            LOG.error("Cant to parse " + dateString + " to date");
            throw new ParseException("Cant to parse " + dateString +" to date", 0);
        }
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByDateByUser(String, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByDateByUser(String date, Serializable userId) throws ParseException{
        Date parsedDate = this.parseDate(date);
        return assignmentDao.getAssignmentsByDateByUser(parsedDate, userId);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByDatesRangeByUser(String, String, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByDatesRangeByUser(String startDate, String endDate, Serializable userId) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return assignmentDao.getAssignmentsByDatesRangeByUser(parsedStartDate, parsedEndDate, userId);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByTypeByUser(Serializable assignmentType, Serializable userId){
        return assignmentDao.getAssignmentsByTypeByUser(assignmentType, userId);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByVisibilityStartByUser(String, String, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityStartByUser(String startDate, String endDate, Serializable userId) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return assignmentDao.getAssignmentsByVisibilityStartByUser(parsedStartDate, parsedEndDate, userId);
    }

    /**
     * @see co.logn.service.assignment.AssignmentService#getAssignmentsByVisibilityEndByUser(String, String, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityEndByUser(String startDate, String endDate, Serializable userId) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return assignmentDao.getAssignmentsByVisibilityEndByUser(parsedStartDate, parsedEndDate, userId);
    }
}

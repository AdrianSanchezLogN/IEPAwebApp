package co.logn.service.note;

import co.logn.service.generic.GenericService;
import org.codehaus.jettison.json.JSONArray;

import java.text.ParseException;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 * Bussiness layer for note entity
 */
public interface NoteService extends GenericService {

    /**
     * @see co.logn.dao.note.NoteDao#getNotesByDate(java.util.Date)
     */
    JSONArray getNotesByDate(String date) throws ParseException;

    /**
     * @see co.logn.dao.note.NoteDao#getNotesByDatesRange(java.util.Date, java.util.Date)
     */
    JSONArray getNotesByDatesRange(String startDate, String endDate) throws ParseException;
}

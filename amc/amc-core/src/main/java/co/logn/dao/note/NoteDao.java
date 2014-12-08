package co.logn.dao.note;

import co.logn.dao.generic.GenericDao;
import org.codehaus.jettison.json.JSONArray;
import java.util.Date;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 * DAO for note entity
 */
public interface NoteDao extends GenericDao {

    /**
     * Gets all notes by date
     * @param date
     * @return notes list
     */
    JSONArray getNotesByDate(Date date);

    /**
     * Gets all notes by dates range
     * @param startDate
     * @param endDate
     * @return notes list
     */
    JSONArray getNotesByDatesRange(Date startDate, Date endDate);
}

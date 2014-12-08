package co.logn.service.note.impl;

import co.logn.dao.note.NoteDao;
import co.logn.service.generic.impl.GenericServiceImpl;
import co.logn.service.note.NoteService;
import org.codehaus.jettison.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @see co.logn.service.note.NoteService
 */
@Service("noteService")
public class NoteServiceImpl extends GenericServiceImpl implements NoteService {

    @Autowired
    private NoteDao noteDao;

    @PostConstruct
    public void init(){
        setGenericDao(noteDao);
    }

    /**
     * @see co.logn.service.note.NoteService#getNotesByDate(String)
     */
    @Override
    public JSONArray getNotesByDate(String date) throws ParseException{
        Date parsedDate = this.parseDate(date);
        return noteDao.getNotesByDate(parsedDate);
    }

    /**
     * @see co.logn.service.note.NoteService#getNotesByDatesRange(String, String)
     */
    @Override
    public JSONArray getNotesByDatesRange(String startDate, String endDate) throws ParseException{
        Date parsedStartDate = this.parseDate(startDate);
        Date parsedEndDate = this.parseDate(endDate);
        return noteDao.getNotesByDatesRange(parsedStartDate, parsedEndDate);
    }

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
}

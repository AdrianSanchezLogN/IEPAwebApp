package co.logn.dao.note.impl;

import co.logn.dao.generic.impl.GenericDaoImpl;
import co.logn.dao.note.NoteDao;
import co.logn.model.Note;
import org.codehaus.jettison.json.JSONArray;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import java.util.Date;

/**
 * @see co.logn.dao.note.NoteDao
 */
@Repository("noteDao")
public class NoteDaoImpl extends GenericDaoImpl implements NoteDao {

    private Criteria criteria;

    @Autowired
    public NoteDaoImpl(@Qualifier("sessionFactory") SessionFactory sessionFactory) {
        setSessionFactory(sessionFactory);
    }

    /**
     * @see co.logn.dao.note.NoteDao#getNotesByDate(java.util.Date)
     */
    @Override
    public JSONArray getNotesByDate(Date date){
        criteria = getSession().createCriteria(Note.class);
        criteria.add(Restrictions.eq("noteDate", date));
        JSONArray notes = new JSONArray(criteria.list());
        return notes;
    }

    /**
     * @see co.logn.dao.note.NoteDao#getNotesByDatesRange(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getNotesByDatesRange(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Note.class);
        criteria.add(Restrictions.between("noteDate", startDate, endDate));
        JSONArray notes = new JSONArray(criteria.list());
        return notes;
    }
}

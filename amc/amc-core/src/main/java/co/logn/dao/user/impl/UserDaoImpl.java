package co.logn.dao.user.impl;

import co.logn.dao.generic.impl.GenericDaoImpl;
import co.logn.dao.user.UserDao;
import co.logn.model.Assignment;
import co.logn.model.Event;
import org.codehaus.jettison.json.JSONArray;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import java.io.Serializable;

/**
 * @see co.logn.dao.user.UserDao
 */
@Repository("userDao")
public class UserDaoImpl extends GenericDaoImpl implements UserDao {

    private Criteria criteria;

    @Autowired
    public UserDaoImpl(@Qualifier("sessionFactory") SessionFactory sessionFactory) {
        setSessionFactory(sessionFactory);
    }

    /**
     * @see co.logn.dao.user.UserDao#getEventsByUser(java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByUser(Serializable userId){
        criteria = getSession().createCriteria(Event.class);
        criteria.createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.user.UserDao#getAssignmentsByUser(java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByUser(Serializable userId){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.createCriteria("ownerEvent")
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.user.UserDao#getNotesByUser(java.io.Serializable)
     */
    @Override
    public JSONArray getNotesByUser(Serializable userId){

        // Ask about this method, if is needed or not, and how could be implemented
        Query query = getSession().createQuery("select notesEv, notesAs from User as user" +
                                                " inner join user.calendars as calendars" +
                                                " inner join calendars.events as events" +
                                                " inner join events.notes as notesEv" +
                                                " inner join events.assignments as assignments" +
                                                " inner join assignments.notes as notesAs" +
                                                " where user.id = :userId");
        query.setParameter("userId", userId);


        JSONArray notes = new JSONArray(query.list());
        return notes;
    }
}

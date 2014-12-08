package co.logn.dao.event.impl;

import co.logn.dao.event.EventDao;
import co.logn.dao.generic.impl.GenericDaoImpl;
import co.logn.model.Event;
import org.codehaus.jettison.json.JSONArray;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import java.io.Serializable;
import java.util.Date;

/**
 * @see co.logn.dao.event.EventDao
 */
@Repository("eventDao")
public class EventDaoImpl extends GenericDaoImpl implements EventDao {

    private Criteria criteria;

    @Autowired
    public EventDaoImpl(@Qualifier("sessionFactory") SessionFactory sessionFactory) {
        setSessionFactory(sessionFactory);
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDate(java.util.Date)
     */
    @Override
    public JSONArray getEventsByDate(Date date){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.eq("dueDate", date));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDatesRange(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getEventsByDatesRange(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.between("dueDate", startDate, endDate));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByType(java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByType(Serializable eventType){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.eq("eventType", eventType));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityStart(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getEventsByVisibilityStart(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.between("visibilityStartDate", startDate, endDate));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityEnd(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getEventsByVisibilityEnd(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.between("visibilityEndDate", startDate, endDate));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDateByUser(java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByDateByUser(Date date, Serializable userId){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.eq("dueDate", date))
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByDatesRangeByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByDatesRangeByUser(Date startDate, Date endDate, Serializable userId){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.between("dueDate", startDate, endDate))
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByTypeByUser(Serializable eventType, Serializable userId){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.eq("eventType", eventType))
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityStartByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByVisibilityStartByUser(Date startDate, Date endDate, Serializable userId){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.between("visibilityStartDate", startDate, endDate))
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }

    /**
     * @see co.logn.dao.event.EventDao#getEventsByVisibilityEndByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getEventsByVisibilityEndByUser(Date startDate, Date endDate, Serializable userId){
        criteria = getSession().createCriteria(Event.class);
        criteria.add(Restrictions.between("visibilityEndDate", startDate, endDate))
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray events = new JSONArray(criteria.list());
        return events;
    }
}

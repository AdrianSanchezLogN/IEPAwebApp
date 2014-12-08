package co.logn.dao.calendar.impl;

import co.logn.dao.calendar.CalendarDao;
import co.logn.dao.generic.impl.GenericDaoImpl;
import co.logn.model.Calendar;
import org.codehaus.jettison.json.JSONArray;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import java.io.Serializable;

/**
 * @see co.logn.dao.calendar.CalendarDao
 */

@Repository("calendarDao")
public class CalendarDaoImpl extends GenericDaoImpl implements CalendarDao {

    private Criteria criteria;

    @Autowired
    public CalendarDaoImpl(@Qualifier("sessionFactory") SessionFactory sessionFactory) {
        setSessionFactory(sessionFactory);
    }

    /**
     * @see co.logn.dao.calendar.CalendarDao#getCalendarsByType(java.io.Serializable)
     */
    @Override
    public JSONArray getCalendarsByType(Serializable calendarType){
        criteria = getSession().createCriteria(Calendar.class);
        criteria.add(Restrictions.eq("calendarType", calendarType));
        JSONArray calendars = new JSONArray(criteria.list());
        return calendars;
    }

    /**
     * @see co.logn.dao.calendar.CalendarDao#getCalendarsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    @Override
    public JSONArray getCalendarsByTypeByUser(Serializable calendarType, Serializable userId){
        criteria = getSession().createCriteria(Calendar.class);
        criteria.add(Restrictions.eq("calendarType", calendarType))
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray calendars = new JSONArray(criteria.list());
        return calendars;
    }
}

package co.logn.dao.assignment.impl;

import co.logn.dao.assignment.AssignmentDao;
import co.logn.dao.generic.impl.GenericDaoImpl;
import co.logn.model.Assignment;
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
 * @see co.logn.dao.assignment.AssignmentDao
 */

@Repository("assignmentDao")
public class AssignmentDaoImpl extends GenericDaoImpl implements AssignmentDao {

    private Criteria criteria;

    @Autowired
    public AssignmentDaoImpl(@Qualifier("sessionFactory") SessionFactory sessionFactory) {
        setSessionFactory(sessionFactory);
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDate(java.util.Date)
     */
    @Override
    public JSONArray getAssignmentsByDate(Date date){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.eq("dueDate", date));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDatesRange(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getAssignmentsByDatesRange(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.between("dueDate", startDate, endDate));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByType(java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByType(Serializable assignmentType){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.eq("assignmentType", assignmentType));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityStart(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityStart(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.between("visibilityStartDate", startDate, endDate));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityEnd(java.util.Date, java.util.Date)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityEnd(Date startDate, Date endDate){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.between("visibilityEndDate", startDate, endDate));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDateByUser(java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByDateByUser(Date date, Serializable userId){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.eq("dueDate", date))
                .createCriteria("ownerEvent")
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByDatesRangeByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByDatesRangeByUser(Date startDate, Date endDate, Serializable userId){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.between("dueDate", startDate, endDate))
                .createCriteria("ownerEvent")
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByTypeByUser(java.io.Serializable, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByTypeByUser(Serializable assignmentType, Serializable userId){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.eq("assignmentType", assignmentType))
                .createCriteria("ownerEvent")
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityStartByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityStartByUser(Date startDate, Date endDate, Serializable userId){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.between("visibilityStartDate", startDate, endDate))
                .createCriteria("ownerEvent")
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }

    /**
     * @see co.logn.dao.assignment.AssignmentDao#getAssignmentsByVisibilityEndByUser(java.util.Date, java.util.Date, java.io.Serializable)
     */
    @Override
    public JSONArray getAssignmentsByVisibilityEndByUser(Date startDate, Date endDate, Serializable userId){
        criteria = getSession().createCriteria(Assignment.class);
        criteria.add(Restrictions.between("visibilityEndDate", startDate, endDate))
                .createCriteria("ownerEvent")
                .createCriteria("ownerCalendar")
                .createCriteria("owner")
                .add(Restrictions.eq("id", userId));
        JSONArray assignments = new JSONArray(criteria.list());
        return assignments;
    }
}

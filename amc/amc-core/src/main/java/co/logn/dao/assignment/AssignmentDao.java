package co.logn.dao.assignment;

import co.logn.dao.generic.GenericDao;
import org.codehaus.jettison.json.JSONArray;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 * DAO for assignment entity
 */
public interface AssignmentDao extends GenericDao {

    /**
     * Gets all assignments by date
     * @param date
     * @return assignments list
     */
    JSONArray getAssignmentsByDate(Date date);

    /**
     * Gets all assignments by dates range
     * @param startDate
     * @param endDate
     * @return assignments list
     */
    JSONArray getAssignmentsByDatesRange(Date startDate, Date endDate);

    /**
     *  Gets all assignments by type
     * @param assignmentType
     * @return assignments list
     */
    JSONArray getAssignmentsByType(Serializable assignmentType);

    /**
     * Gets all assignments by visibility start date between two dates
     * @param startDate
     * @param endDate
     * @return assignments list
     */
    JSONArray getAssignmentsByVisibilityStart(Date startDate, Date endDate);

    /**
     * Gets all assignments by visibility end date between two dates
     * @param startDate
     * @param endDate
     * @return assignments list
     */
    JSONArray getAssignmentsByVisibilityEnd(Date startDate, Date endDate);

    /**
     * Gets all assignments by date for an user
     * @param date
     * @param userId
     * @return assignments list
     */
    JSONArray getAssignmentsByDateByUser(Date date, Serializable userId);

    /**
     * Gets all assignments by dates range for an user
     * @param startDate
     * @param endDate
     * @param userId
     * @return assignments list
     */
    JSONArray getAssignmentsByDatesRangeByUser(Date startDate, Date endDate, Serializable userId);

    /**
     *  Gets all assignments by type for an user
     * @param assignmentType
     * @param userId
     * @return assignments list
     */
    JSONArray getAssignmentsByTypeByUser(Serializable assignmentType, Serializable userId);

    /**
     * Gets all assignments by visibility start date between two dates for an user
     * @param startDate
     * @param endDate
     * @param userId
     * @return assignments list
     */
    JSONArray getAssignmentsByVisibilityStartByUser(Date startDate, Date endDate, Serializable userId);

    /**
     * Gets all assignments by visibility end date between two dates for an user
     * @param startDate
     * @param endDate
     * @param userId
     * @return assignments list
     */
    JSONArray getAssignmentsByVisibilityEndByUser(Date startDate, Date endDate, Serializable userId);
}

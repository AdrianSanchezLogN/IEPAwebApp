package co.logn.service.user.impl;

import co.logn.dao.calendar.CalendarDao;
import co.logn.dao.user.UserDao;
import co.logn.model.Calendar;
import co.logn.model.User;
import co.logn.service.generic.impl.GenericServiceImpl;
import co.logn.service.user.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jettison.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectRetrievalFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.annotation.PostConstruct;
import java.io.Serializable;

/**
 * @see co.logn.service.user.UserService
 */
@Service("userService")
public class UserServiceImpl extends GenericServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    CalendarDao calendarDao;

    @PostConstruct
    public void init(){
        setGenericDao(userDao);
    }

    private static final Log LOG = LogFactory.getLog(UserServiceImpl.class);

    /**
     *
     * @see co.logn.service.user.UserService#saveIfNew(co.logn.model.User)
     */
    @Override
    @Transactional(readOnly = false)
    public void saveIfNew(User user) {
        if(userDao.findByID(User.class, user.getId()) == null){
            userDao.save(user); // If is new, save it
            LOG.info("New user: " + user + " -was added to local database");
        }
    }

    /**
     *
     * @see co.logn.service.user.UserService#addCalendar(co.logn.model.Calendar, String)
     */
    @Override
    @Transactional(readOnly = false)
    public String addCalendar(Calendar calendar, String userId){
        User user = (User)userDao.findByID(User.class, userId);
        if(user == null){
            LOG.error("User with id:" + userId + " doesnt exist");
            throw new ObjectRetrievalFailureException(User.class, userId);
        }
        else{
//            calendar.setOwnerId(user);
            user.getCalendars().add(calendar);
            userDao.updateById(user);
            return calendar.getId();
        }
    }

    /**
     *
     * @see co.logn.service.user.UserService#getCalendars(String)
     */
    @Override
    public JSONArray getCalendars(String userId){
        User user = (User)userDao.findByID(User.class, userId);
        if(user == null){
            LOG.error("User with id:" + userId + " doesnt exist");
            throw new ObjectRetrievalFailureException(User.class, userId);
        }
        JSONArray calendarsArray = new JSONArray(user.getCalendars());
        return calendarsArray;
    }

    /**
     *
     * @see co.logn.service.user.UserService#deleteCalendarById(String, String)
     */
    @Override
    @Transactional(readOnly = false)
    public void deleteCalendarById(String calendarId, String userId){
        User user = (User)userDao.findByID(User.class, userId);
        if(user == null){
            LOG.error("User with id:" + userId + " doesnt exist");
            throw new ObjectRetrievalFailureException(User.class, user);
        }
        else{
            Calendar calendar = (Calendar)calendarDao.findByID(Calendar.class, calendarId);
            if(calendar == null){
                LOG.error("Calendar with id:" + calendarId + " doesnt exist");
                throw new ObjectRetrievalFailureException(Calendar.class, calendarId);
            }
            else{
                user.getCalendars().remove(calendar);
                userDao.updateById(calendar);
                calendarDao.delete(Calendar.class, calendarId);
                LOG.info("Calendar with id:" + calendarId + " was deleted successfully");
            }
        }
    }

    /**
     * @see co.logn.service.user.UserService#getEventsByUser(java.io.Serializable)
     */
    public JSONArray getEventsByUser(Serializable userId){
        return userDao.getEventsByUser(userId);
    }

    /**
     * @see co.logn.service.user.UserService#getAssignmentsByUser(java.io.Serializable)
     */
    public JSONArray getAssignmentsByUser(Serializable userId){
        return userDao.getAssignmentsByUser(userId);
    }

    /**
     * @see co.logn.service.user.UserService#getNotesByUser(java.io.Serializable)
     */
    public JSONArray getNotesByUser(Serializable userId){
        return userDao.getNotesByUser(userId);
    }
}

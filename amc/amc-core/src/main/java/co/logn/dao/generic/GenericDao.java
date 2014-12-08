package co.logn.dao.generic;

import java.io.Serializable;
import java.util.List;

/**
 * Created by logn on 2/20/14.
 * @author Cristian Sanchez
 * Basics CRUD operations to be implemented by new Daos
 */
public interface GenericDao {

    /**
     *Persists a Calendar instance into the database
     * @param   o The object given to be stored
     */
    String save(final Object o);

    /**
     *Get the Object instance which matches the primary key with given id
     * @param   clazz   Type of class to be stored
     * @param   id      identity of some instance
     * @return  Object  instance which matches the Identity
     */
    Object findByID(final Class<?> clazz, final Serializable id);

    /**
     * Get a list of objects of same table
     * @return objects
     */
    public List<Object> find(Class<?> clazz);

    /**
     *Change some attributes in an instance
     * @param   o   New instance to be stored into table
     */
    void updateById(final Object o);

    /**
     *Delete the given instance
     * @param   clazz   Type of class to be stored
     * @param   id      identity of some instance
     */
    void delete(final Class<?> clazz, final Serializable id);
}

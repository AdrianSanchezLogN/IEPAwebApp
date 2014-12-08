package co.logn.service.generic;

import java.io.Serializable;
import java.util.List;

/**
 * Created by csanchez on 2/20/14.
 * @author Cristian Sanchez
 * CRUD operations for bussiness layer child classes
 */

public interface GenericService {

    /**
     *Persists a Calendar instance into the database
     * @param   o The object given to be stored
     */
    String save(final Object o);

    /**
     *Change some attributes in an instance
     * @param   o   New data instance to be stored
     */
    void updateById(final Object o);

    /**
     *Delete the given instance
     * @param   clazz   Type of class to be stored
     * @param   id      identity of some instance
     */
    void delete(final Class<?> clazz, final Serializable id);

    /**
     *Get the Object instance which matches the primary key with given id
     * @param   clazz   Type of class to be stored
     * @param   id      identity of some instance
     * @return  Object  instance which matches the Identity
     */
    Object findByID(final Class<?> clazz, final Serializable id);

    /**
     * Get the list of objects from the same class
     * @param clazz Type of class to be retrieved
     * @return list of registers
     */
    public List find(Class<?> clazz);

}

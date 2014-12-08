package co.logn.dao.generic.impl;

import co.logn.dao.generic.GenericDao;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.orm.ObjectRetrievalFailureException;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;
import java.io.Serializable;
import java.util.List;

/**
 * @see co.logn.dao.generic.GenericDao
 */
@Repository("genericDao")
public abstract class GenericDaoImpl extends HibernateDaoSupport implements GenericDao {

    /**
     * Logger.
     */
    private static final Log LOG = LogFactory.getLog(GenericDaoImpl.class);

    public GenericDaoImpl(){}

    /**
     * @param clazz Class of the Hibernate entity that should be loaded.
     * @param id Serialized ID.
     * @return Deserialized Object/EntityClass.
     *
     *
     */
    public final Object getObject(final Class<?> clazz, final Serializable id) {
        Object o = getHibernateTemplate().get(clazz, id);
        if (o == null) {
            LOG.error("Error loading object of type " + clazz.toString() + " ID=" + id);
            throw new ObjectRetrievalFailureException(clazz, id);
        }
        return o;
    }

    /**
     *@see  co.logn.dao.generic.GenericDao#save(Object)
     */
    @Override
    public String save(Object o) {
        return getHibernateTemplate().save(o).toString(); // can return a string
    }

    /**
     *@see  co.logn.dao.generic.GenericDao#findByID(Class, java.io.Serializable)
     */
    @Override
    public Object findByID(Class<?> clazz, Serializable id) {
        return getHibernateTemplate().get(clazz, id);
    }

    /**
     * @see co.logn.dao.generic.GenericDao#find(Class)
     */
    @Override
    public List find(Class<?> clazz){
        return getHibernateTemplate().loadAll(clazz);
    }

    /**
     *@see  co.logn.dao.generic.GenericDao#updateById(Object)
     */
    @Override
    public void updateById(Object o) {
        getHibernateTemplate().saveOrUpdate(o);
    }

    /**
     *@see  co.logn.dao.generic.GenericDao#delete(Class, java.io.Serializable)
     */
    @Override
    public void delete(Class<?> clazz, Serializable id) {
        getHibernateTemplate().delete(getObject(clazz, id));
    }

}

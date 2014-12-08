package co.logn.service.generic.impl;

import co.logn.dao.generic.GenericDao;
import co.logn.service.generic.GenericService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

/**
 * @see co.logn.service.generic.GenericService
 */
@Transactional
@Service("genericService")
public class GenericServiceImpl implements GenericService {

    private GenericDao genericDao;

    public GenericDao getGenericDao() {
        return genericDao;
    }

    public void setGenericDao(GenericDao genericDao) {
        this.genericDao = genericDao;
    }

    /**
     *
     * @see co.logn.dao.generic.GenericDao#save(Object)
     */
    @Override
    @Transactional(readOnly = false)
    public String save(Object o) {
        return genericDao.save(o);
    }

    /**
     *
     * @see co.logn.dao.generic.GenericDao#findByID(Class, java.io.Serializable)
     */
    @Override
    public Object findByID(Class<?> clazz, Serializable id) {
        return genericDao.findByID(clazz, id);
    }

    /**
     *
     * @see co.logn.dao.generic.GenericDao#updateById(Object)
     */
    @Override
    @Transactional(readOnly = false)
    public void updateById(Object o) {
        genericDao.updateById(o);
    }

    /**
     *
     * @see co.logn.dao.generic.GenericDao#delete(Class, java.io.Serializable)
     */
    @Override
    @Transactional(readOnly = false)
    public void delete(Class<?> clazz, Serializable id) {
        genericDao.delete(clazz, id);
    }

    /**
     * @see co.logn.service.generic.GenericService#find(Class)
     */
    @Override
    public List find(Class<?> clazz){
        return genericDao.find(clazz);
    }
}

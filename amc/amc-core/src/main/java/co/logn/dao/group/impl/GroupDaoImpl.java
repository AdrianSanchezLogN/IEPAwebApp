package co.logn.dao.group.impl;

import co.logn.dao.generic.impl.GenericDaoImpl;
import co.logn.dao.group.GroupDao;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

/**
 * Created by logn on 3/7/14.
 * @author Cristian Sanchez
 * DAO for the group entity
 */
@Repository("groupDao")
public class GroupDaoImpl extends GenericDaoImpl implements GroupDao{

    @Autowired
    public GroupDaoImpl(@Qualifier("sessionFactory") SessionFactory sessionFactory) {
        setSessionFactory(sessionFactory);
    }
}

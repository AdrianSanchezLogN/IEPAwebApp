package co.logn.service.group.impl;

import co.logn.dao.group.GroupDao;
import co.logn.service.generic.impl.GenericServiceImpl;
import co.logn.service.group.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * @see co.logn.service.group.GroupService
 */
@Service("groupService")
public class GroupServiceImpl extends GenericServiceImpl implements GroupService {

    @Autowired
    GroupDao groupDao;

    @PostConstruct
    public void init(){
        setGenericDao(groupDao);
    }
}

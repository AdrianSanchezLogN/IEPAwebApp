package co.logn.webservice;

import co.logn.model.Grouping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import co.logn.service.group.GroupService;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by logn on 3/5/14.
 * @author Cristian Sanchez
 *
 * Endpoint for responsing data of groups
 */
@Component
@Path("/grouping")
public class GroupingRest {

    @Autowired
    private GroupService groupService;

    // Must validate user is creator type or has privileges
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createGroup(Grouping group, @QueryParam("userId") String userId){
        String groupId = groupService.save(group);
        if(group.getId() == null){
            return Response.serverError().build();
        }
        else{
            return Response.ok(groupId, MediaType.APPLICATION_JSON).build();
        }
    }

    // Must validate if user is able to delete
    @DELETE
    @Path("/{id}")
    public void deleteGroup(@PathParam("id") String id,@QueryParam("userId") String userId){
        groupService.delete(Grouping.class, id);
    }

//    @GET
//    @Path("/{id}")
//    public String findGroups(@PathParam("id") String id){
//        return (String)service.findByID(Grouping.class, id);
//    }
}

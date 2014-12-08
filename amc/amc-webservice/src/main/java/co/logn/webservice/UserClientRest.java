package co.logn.webservice;

import co.logn.model.User;
import co.logn.service.user.UserService;
import co.logn.util.UserClientUtil;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by logn on 3/17/14.
 * @author Cristian Sanchez
 *
 * This is a comsumer for user data from the endpoint from eqa
 */

@Component
@Path("/userClient")
@Produces(MediaType.APPLICATION_JSON)
public class UserClientRest {

    UserClientUtil userClientUtil = new UserClientUtil();

    @Autowired
    UserService userService;

    /**
     * Used to sign in to AMC using an external endpoint for resource: User
     * @param jsonObject
     * @return status response
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(JSONObject jsonObject){
        User user = userClientUtil.login(jsonObject);
        if(user.equals(new User())){
            return Response.noContent().build();
        }
        else{
            userService.saveIfNew(user);
            return Response.ok(user, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Get an user from CSG endpoint by Id
     * @param userId
     * @return user matched
     */
    @GET
    @Path("/{userId}")
    public Response getUser(@PathParam("userId") String userId){
        JSONObject user = userClientUtil.getUser(userId);
        if(user.equals(new User())){
            return Response.noContent().build();
        }
        else{
            return Response.ok(user, MediaType.APPLICATION_JSON).build();
        }
    }
}

package co.logn.webservice;

import co.logn.service.user.UserService;
import org.codehaus.jettison.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by logn on 3/19/14.
 * @author Cristian Sanchez
 *
 * Endpoint for responsing data of local AMC users
 */
@Component
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserRest {

    @Autowired
    UserService userService;

    /**
     * Gets all events for an user
     * @param userId
     * @return status Response
     */
    @GET
    @Path("/events/{userId}")
    public Response getEventsByUser(@PathParam("userId") String userId){
        JSONArray events = userService.getEventsByUser(userId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Gets all assignments for an user
     * @param userId
     * @return status Response
     */
    @GET
    @Path("/assignments/{userId}")
    public Response getAssignmentsByUser(@PathParam("userId") String userId){
        JSONArray assignments = userService.getAssignmentsByUser(userId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Gets all notes for an user
     * @param userId
     * @return status Response
     */
    @GET
    @Path("/notes/{userId}")
    public Response getNotesByUser(@PathParam("userId") String userId){
        JSONArray notes = userService.getNotesByUser(userId);
        if(notes.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(notes.toString(), MediaType.APPLICATION_JSON).build();
        }
    }
}

package co.logn.webservice;

import co.logn.model.Assignment;
import co.logn.service.assignment.AssignmentService;
import co.logn.service.event.EventService;
import org.codehaus.jettison.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;

/**
 * Created by logn on 3/11/14.
 * @author Cristian Sanchez
 *
 * Endpoint for responsing data of assignments
 */

@Component
@Path("/assignment")
@Produces(MediaType.APPLICATION_JSON)
public class AssignmentRest {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private EventService eventService;

    /**
     * Fetch on database for assignments of an event
     * @param eventId
     * @return status Response
     */
    @GET
    @Path("/{eventId}")
    public Response getAssignments(@PathParam("eventId") String eventId){
        JSONArray assignments = eventService.getAssignments(eventId);
        if(assignments == null){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for assignments with filtered date
     * @param date
     * @return status Response
     */
    @GET
    @Path("/date/{date}/{userId}")
    public Response getAssignmentsByDate(@PathParam("date") String date, @PathParam("userId") String userId) throws ParseException {
        JSONArray assignments = assignmentService.getAssignmentsByDateByUser(date, userId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for assignments with filtered date in range
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/dates/{startDate}/{endDate}/range")
    public Response getAssignmentsByDatesRange(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray assignments = assignmentService.getAssignmentsByDatesRange(startDate, endDate);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }


    @GET
    @Path("/dates/{startDate}/{endDate}/range/{userId}")
    public Response getAssignmentsByDatesRange(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate, @PathParam("userId") String userId) throws ParseException{
        JSONArray assignments = assignmentService.getAssignmentsByDatesRangeByUser(startDate, endDate, userId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for assignments with filtered type
     * @param assignmentType
     * @return status Response
     */
    @GET
    @Path("/type/{assignmentType}")
    public Response getAssignmentsByType(@PathParam("assignmentType") String assignmentType){
        JSONArray assignments = assignmentService.getAssignmentsByType(assignmentType);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }


    @GET
    @Path("/type/{assignmentType}/{userId}")
    public Response getAssignmentsByType(@PathParam("assignmentType") String assignmentType, @PathParam("userId") String userId){
        JSONArray assignments = assignmentService.getAssignmentsByTypeByUser(assignmentType, userId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for assignments with filtered visibility start date
     * @param startDate
     * @param endDate
     * @return status Response
     * @throws java.text.ParseException
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/start")
    public Response getAssignmentsByVisibilityStart(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray assignments = assignmentService.getAssignmentsByVisibilityStart(startDate, endDate);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/visibility/{startDate}/{endDate}/start/{userId}")
    public Response getAssignmentsByVisibilityStart(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate, @PathParam("userId") String userId) throws ParseException{
        JSONArray assignments = assignmentService.getAssignmentsByVisibilityStartByUser(startDate, endDate, userId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for assignments with filtered visibility end date
     * @param startDate
     * @param endDate
     * @return status Response
     * @throws java.text.ParseException
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/end")
    public Response getAssignmentsByVisibilityEnd(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray assignments = assignmentService.getAssignmentsByVisibilityEnd(startDate, endDate);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for assignments with filtered visibility end date and user
     * @param startDate
     * @param endDate
     * @return status Response
     * @throws java.text.ParseException
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/end/{userId}")
    public Response getAssignmentsByVisibilityEnd(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate, @PathParam("userId") String userId) throws ParseException{
        JSONArray assignments = assignmentService.getAssignmentsByVisibilityEndByUser(startDate, endDate, userId);
        if(assignments.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(assignments.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Persists on database the sent assignment into specific calendar
     * @param assignment
     * @param eventId
     * @return status Response
     */
    @POST
    @Path("/{eventId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createAsssignment(Assignment assignment, @PathParam("eventId") String eventId){
        eventService.addAssignment(assignment, eventId);
        if(assignment.getId() == null){
            return Response.serverError().build();
        }
        else{
            return Response.ok(assignment, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Updates an specific assignment
     * @param assignment
     * @param eventId
     * @return status Response
     */
    @PUT
    @Path("/{eventId}/{assignmentId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("eventId") String eventId, @PathParam("assignmentId") String assignmentId, Assignment assignment){
        Assignment assignmentPersisted = (Assignment)assignmentService.findByID(Assignment.class, assignmentId);
        if(assignmentPersisted == null){
            return Response.noContent().build();
        }
        else {
            eventService.updateAssignmentById(eventId, assignmentId, assignment);
            return Response.ok(assignment, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Deletes an specified assignment
     * @param assignmentId
     * @param eventId
     * @return status Response
     */
    @DELETE
    @Path("/{eventId}/{assignmentId}")
    public Response delete(@PathParam("eventId") String eventId, @PathParam("assignmentId") String assignmentId){
        Assignment assignment = (Assignment)assignmentService.findByID(Assignment.class, assignmentId);//this is been requested couple times
        if(assignment == null){
            return  Response.noContent().build();
        }
        else{
            eventService.deleteAssignmentById(eventId, assignmentId);
            return Response.ok().build();
        }
    }
}

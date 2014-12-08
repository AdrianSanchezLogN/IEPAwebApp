package co.logn.webservice;

import co.logn.model.Calendar;
import co.logn.service.calendar.CalendarService;
import co.logn.service.user.UserService;
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

/**
 * Created by logn on 3/4/14.
 * @author Cristian Sanchez
 *
 * Endpoint for responsing data of calendars
 */

@Component
@Path("/calendar")
@Produces(MediaType.APPLICATION_JSON)
public class CalendarRest {

    @Autowired
    CalendarService calendarService;

    @Autowired
    UserService userService;

    /**
     * Fetch on database for calendars
     * @return status Response
     */
    @GET
    @Path("/{userId}")
    public Response getCalendars(@PathParam("userId") String userId){
        JSONArray calendars = userService.getCalendars(userId);
        if(calendars.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(calendars.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for calendars with filtered type
     * @param calendarType
     * @return status Response
     */
    @GET
    @Path("/type/{calendarType}")
    public Response getCalendarsByType(@PathParam("calendarType") String calendarType){
        JSONArray calendars = calendarService.getCalendarsByType(calendarType);
        if(calendars.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(calendars.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for calendars with filtered type and user
     * @param calendarType
     * @return status Response
     */
    @GET
    @Path("/type/{calendarType}/{userId}")
    public Response getCalendarByType(@PathParam("calendarType") String calendarType, @PathParam("userId") String userId){
        JSONArray calendars = calendarService.getCalendarsByTypeByUser(calendarType, userId);
        if(calendars.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(calendars.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Persists on database the sent calendar
     * @param calendar
     * @return status Response
     */
    @POST
    @Path("/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createCalendar(@PathParam("userId") String userId, Calendar calendar){
        userService.addCalendar(calendar, userId);
        if(calendar.getId() == null){
            return Response.serverError().build();
        }
        else{
            return Response.ok(calendar, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Updates an specific calendar
     * @param calendar
     * @return status Response
     */
    @PUT
    @Path("/{calendarId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateCalendar(Calendar calendar, @PathParam("calendarId") String calendarId) {
        Calendar calendarPersisted = (Calendar)calendarService.findByID(Calendar.class, calendar.getId());
        if(calendarPersisted == null){
            return Response.notModified().build();
        }
        else{
            calendarService.updateById(calendar);
            return Response.ok(calendar, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Deletes an specified calendar
     * @param calendarId
     * @return status Response
     */
    @DELETE
    @Path("/{calendarId}/{userUd}")
    public Response deleteCalendar(@PathParam("calendarId") String calendarId, @PathParam("userId") String userId){
        Calendar calendar = (Calendar)calendarService.findByID(Calendar.class, calendarId);
        if(calendar == null){
            return Response.noContent().build();
        }
        else{
            userService.deleteCalendarById(calendarId, userId);
            return Response.ok().build();
        }
    }
}

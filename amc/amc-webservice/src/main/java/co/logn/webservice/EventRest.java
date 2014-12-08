package co.logn.webservice;

import co.logn.model.Event;
import co.logn.service.calendar.CalendarService;
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
 * Created by logn on 3/12/14.
 * @author Cristian Sanchez
 *
 * Endpoint for responsing data of events
 */
@Component
@Path("/event")
@Produces(MediaType.APPLICATION_JSON)
public class EventRest {

    @Autowired
    EventService eventService;

    @Autowired
    private CalendarService calendarService;

    /**
     * Fetch on database for events
     * @return status Response
     */
    @GET
    @Path("/{calendarId}")
    public Response getEventsOfCalendar(@PathParam("calendarId") String calendarId){
        JSONArray events = calendarService.getEvents(calendarId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered date
     * @param date
     * @return status Response
     */
    @GET
    @Path("/date/{date}")
    public Response getEventsByDate(@PathParam("date") String date) throws ParseException {
        JSONArray events = eventService.getEventsByDate(date);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered date and user
     * @param date
     * @return status Response
     */
    @GET
    @Path("/date/{date}/{userId}")
    public Response getEventsByDate(@PathParam("date") String date, @PathParam("userId") String userId) throws ParseException {
        JSONArray events = eventService.getEventsByDateByUser(date, userId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events filtered by dates range
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/dates/{startDate}/{endDate}/range")
    public Response getEventsByDatesRange(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray events = eventService.getEventsByDatesRange(startDate, endDate);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events filtered by dates range and user
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/dates/{startDate}/{endDate}/range/{userId}")
    public Response getEventsByDatesRange(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate, @PathParam("userId") String userId) throws ParseException{
        JSONArray events = eventService.getEventsByDatesRangeByUser(startDate, endDate, userId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered type
     * @param eventType
     * @return status Response
     */
    @GET
    @Path("/type/{eventType}")
    public Response getEventsByType(@PathParam("eventType") String eventType){
        JSONArray events = eventService.getEventsByType(eventType);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered type and user
     * @param eventType
     * @return status Response
     */
    @GET
    @Path("/type/{eventType}/{userId}")
    public Response getEventsByType(@PathParam("eventType") String eventType, @PathParam("userId") String userId){
        JSONArray events = eventService.getEventsByTypeByUser(eventType, userId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered visibility start date
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/start")
    public Response getEventsByVisibilityStart(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray events = eventService.getEventsByVisibilityStart(startDate, endDate);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered visibility start date and user
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/start/{userId}")
    public Response getEventsByVisibilityStart(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate, @PathParam("userId") String userId) throws ParseException{
        JSONArray events = eventService.getEventsByVisibilityStartByUser(startDate, endDate, userId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered visibility end date
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/end")
    public Response getEventsByVisibilityEnd(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate) throws ParseException{
        JSONArray events = eventService.getEventsByVisibilityEnd(startDate, endDate);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Fetch on database for events with filtered visibility end date and user
     * @param startDate
     * @param endDate
     * @return status Response
     */
    @GET
    @Path("/visibility/{startDate}/{endDate}/end/{userId}")
    public Response getEventsByVisibilityEnd(@PathParam("startDate") String startDate, @PathParam("endDate") String endDate, @PathParam("userId") String userId) throws ParseException{
        JSONArray events = eventService.getEventsByVisibilityEndByUser(startDate, endDate, userId);
        if(events.length() == 0){
            return Response.noContent().build();
        }
        else{
            return Response.ok(events.toString(), MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Persists on database the sent event into specific calendar
     * @param event
     * @param calendarId
     * @return status Response
     */
    @POST
    @Path("/{calendarId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createAsssignment(Event event, @PathParam("calendarId") String calendarId){
        calendarService.addEvent(event, calendarId);
        if(event.getId() == null){
            return Response.serverError().build();
        }
        else{
            return Response.ok(event, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Updates an specific event
     * @param event
     * @param calendarId
     * @return status Response
     */
    @PUT
    @Path("/{calendarId}/{eventId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("calendarId") String calendarId, @PathParam("eventId")String eventId, Event event){
        if(event.getId() == null){
            return Response.serverError().build();
        }
        Event eventPersisted = (Event)eventService.findByID(Event.class, event.getId());
        if(eventPersisted == null){
            return Response.noContent().build();
        }
        else {
            calendarService.updateEventById(calendarId, eventId, event);
            return Response.ok(event, MediaType.APPLICATION_JSON).build();
        }
    }

    /**
     * Deletes an specified event
     * @param eventId
     * @param calendarId
     * @return status Response
     */
    @DELETE
    @Path("/{calendarId}/{eventId}")
    public Response delete(@PathParam("calendarId") String calendarId, @PathParam("eventId") String eventId){
        Event event = (Event)eventService.findByID(Event.class, eventId);
        if(event == null){
            return  Response.noContent().build();
        }
        else{
            calendarService.deleteEventById(calendarId, eventId);
            return Response.ok().build();
        }
    }


}

package co.logn.services;

import co.logn.model.*;
import co.logn.service.assignment.AssignmentService;
import co.logn.service.calendar.CalendarService;
import co.logn.service.event.EventService;
import co.logn.service.note.NoteService;
import co.logn.service.user.UserService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

/**
 * Created by csanchez on 3/25/14.
 */
public class flowApp {

    @Autowired
    private static UserService userService;

    @Autowired
    private static CalendarService calendarService;

    @Autowired
    private static EventService eventService;

    @Autowired
    private static AssignmentService assignmentService;

    @Autowired
    private static NoteService noteService;


    @Test
    public void flowTest(){
        User user = new User();
        user.setRole("student");
        user.setId("01010101-4455-1c64-8144-56a121ce0004");
        userService.saveIfNew(user);
        Calendar calendar = new Calendar();
        calendar.setName("calendar1");
        calendar.setCalendarType("student");
        calendar.setPermissions("all");
        calendar.setOwnerName("cristian");
        calendar.setOwnerId(user.getId());
        userService.addCalendar(calendar, user.getId());
        Event event = new Event();
        event.setName("event1");
        event.setPermissions("all");
        event.setAssignmentType("eventType");
        event.setAssociatedIntegrationPartner("AssociatedIntegrationPartner");
        event.setOwnerCalendarId(calendar.getId());
        event.setNotificationSubject("NotificationSubject");
        event.setNotificationBody("NotificationBody");
        event.setDescription("Event description");
        event.setDueDate(new Date(20140822));
        event.setEventMetaData("Event METADATA");
        event.setNoteBody("Note body");
        event.setVisibilityStartDate(new Date(20140401));
        event.setVisibilityEndDate(new Date(20140422));
        calendarService.addEvent(event, calendar.getId());
        Assignment assignment = new Assignment();
        assignment.setName("assignment");
        assignment.setDescription("description for assignment");
        assignment.setDueDate(new Date(20140422));
        assignment.setAssignmentType("optional");
        assignment.setVisibilityStartDate(new Date(20140415));
        assignment.setVisibilityEndDate(new Date(20140420));
        eventService.addAssignment(assignment, event.getId());
        Note eventNote = new Note();

        Note assignmentNote = new Note();
    }
}

package co.logn.model;

import org.hibernate.annotations.ForeignKey;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlTransient;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;
import java.util.Date;
import java.util.List;

/**
 * Created by logn on 3/8/14.
 * @author Cristian Sanchez
 *
 * Entity used to map events table
 */

@Entity
@XmlRootElement
@Table(name = "event")
public class Event extends EntityClass {

    @Column(name = "due_date")
    private Date dueDate;

    @Column(name = "name", length = 20)
    private String name;

    @Column(name = "description", length = 80)
    private String description;

    @Column(name = "event_type", length = 10)
    private String eventType;

    @Column(name = "event_meta_data", length = 40)
    private String eventMetaData; // Object

    @Column(name = "visibility_start_date")
    private Date visibilityStartDate;

    @Column(name = "visibility_end_date")
    private Date visibilityEndDate;

    @Column(name = "associated_integration_partner")
    private String associatedIntegrationPartner;

    @Column(name = "permissions")
    private String permissions;

    @Column(name = "note_body", length = 80)
    private String noteBody;

    @Column(name = "notification_subject", length = 20)
    private String notificationSubject;

    @Column(name = "notification_body", length = 80)
    private String notificationBody;

    @Column(name = "is_send_notification")
    private boolean isSendNotification;

    @JoinColumn(name = "calendar_id", referencedColumnName = "id", updatable = false, insertable = false)
    @ForeignKey(name = "event_calendar_id")
    @ManyToOne
    private Calendar ownerCalendar;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id")
    private List<Assignment> assignments;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id")
    private List<Note> notes;

    /**
     * Obtains the due date of this event
     * @return date
     */
    @XmlElement
    public Date getDueDate() {
        return dueDate;
    }

    /**
     * Assigns the due date for this event
     * @param dueDate
     */
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    /**
     * Obtains the name of this event
     * @return date
     */
    @XmlElement
    public String getName() {
        return name;
    }

    /**
     * Assigns the name for this event
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Obtains the descritpion of this event
     * @return date
     */
    @XmlElement
    public String getDescription() {
        return description;
    }

    /**
     * Assigns the description for this event
     * @param description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Obtains the assignment type of this event
     * @return date
     */
    @XmlElement
    public String getEventType() {
        return eventType;
    }

    /**
     * Assigns the event type for this event
     * @param eventType
     */
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    /**
     * Obtains the ID of owner calendar of this event
     * @return date
     */
    @XmlTransient
    public Calendar getOwnerCalendar() {
        return ownerCalendar;
    }

    /**
     * Assigns the ID for the owner calendar for this event
     * @param ownerCalendar
     */
    public void setOwnerCalendarId(Calendar ownerCalendar) {
        this.ownerCalendar = ownerCalendar;
    }

    /**
     * Obtains the event metadata of this event
     * @return date
     */
    @XmlElement
    public String getEventMetaData() {
        return eventMetaData;
    }

    /**
     * Assigns the event metadata for this event
     * @param eventMetaData
     */
    public void setEventMetaData(String eventMetaData) {
        this.eventMetaData = eventMetaData;
    }

    /**
     * Obtains the visibility start date of this event
     * @return date
     */
    @XmlElement
    public Date getVisibilityStartDate() {
        return visibilityStartDate;
    }

    /**
     * Assigns the visibility start date for this event
     * @param visibilityStartDate
     */
    public void setVisibilityStartDate(Date visibilityStartDate) {
        this.visibilityStartDate = visibilityStartDate;
    }

    /**
     * Obtains the visibility last date of this event
     * @return date
     */
    @XmlElement
    public Date getVisibilityEndDate() {
        return visibilityEndDate;
    }

    /**
     * Assigns the visibility last date for this event
     * @param visibilityEndDate
     */
    public void setVisibilityEndDate(Date visibilityEndDate) {
        this.visibilityEndDate = visibilityEndDate;
    }

    /**
     * Obtains the associated integration partner of this event
     * @return date
     */
    @XmlElement
    public String getAssociatedIntegrationPartner() {
        return associatedIntegrationPartner;
    }

    /**
     * Assigns the associated integration partner for this event
     * @param associatedIntegrationPartner
     */
    public void setAssociatedIntegrationPartner(String associatedIntegrationPartner) {
        this.associatedIntegrationPartner = associatedIntegrationPartner;
    }

    /**
     * Obtains the due date of this event
     * @return date
     */
    @XmlElement
    public String getPermissions() {
        return permissions;
    }

    /**
     * Assigns the permissions for this event
     * @param permissions
     */
    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }

    /**
     * Obtains the note body of this event
     * @return date
     */
    @XmlElement
    public String getNoteBody() {
        return noteBody;
    }

    /**
     * Assigns the note body for this event
     * @param noteBody
     */
    public void setNoteBody(String noteBody) {
        this.noteBody = noteBody;
    }

    /**
     * Obtains the notification subject of this event
     * @return date
     */
    @XmlElement
    public String getNotificationSubject() {
        return notificationSubject;
    }

    /**
     * Assigns the notification subject for this event
     * @param notificationSubject
     */
    public void setNotificationSubject(String notificationSubject) {
        this.notificationSubject = notificationSubject;
    }

    /**
     * Obtains the notification body of this event
     * @return date
     */
    @XmlElement
    public String getNotificationBody() {
        return notificationBody;
    }

    /**
     * Assigns the notification body for this event
     * @param notificationBody
     */
    public void setNotificationBody(String notificationBody) {
        this.notificationBody = notificationBody;
    }

    /**
     * Obtains if a notification is sent for this event
     * @return date
     */
    @XmlElement
    public boolean isSendNotification() {
        return isSendNotification;
    }

    /**
     * Assigns the value for if notification is sent
     * @param isSendNotification
     */
    public void setSendNotification(boolean isSendNotification) {
        this.isSendNotification = isSendNotification;
    }

    /**
     * Gets the list assignments of this event
     * @return assignments list
     */
    @XmlElement
    public List<Assignment> getAssignments() {
        return assignments;
    }

    /**
     * Assigns the assignments for this event
     * @param assignments
     */
    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }

    /**
     * Gets the list of notes of this event
     * @return notes list
     */
    @XmlElement
    public List<Note> getNotes() {
        return notes;
    }

    /**
     * Assigns the notes for this event
     * @param notes
     */
    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    /**
     * Prints this class in text format
     * @return string
     */
    @Override
    public String toString() {
        return "Event{" +
                "dueDate=" + dueDate +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", eventType='" + eventType + '\'' +
                ", eventMetaData='" + eventMetaData + '\'' +
                ", visibilityStartDate=" + visibilityStartDate +
                ", visibilityEndDate=" + visibilityEndDate +
                ", associatedIntegrationPartner='" + associatedIntegrationPartner + '\'' +
                ", permissions='" + permissions + '\'' +
                ", noteBody='" + noteBody + '\'' +
                ", notificationSubject='" + notificationSubject + '\'' +
                ", notificationBody='" + notificationBody + '\'' +
                ", isSendNotification=" + isSendNotification +
                ", assignments=" + assignments +
                ", notes=" + notes +
                '}';
    }

    /**
     * Compares if an object is equals to this
     * @param o
     * @return true / false
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Event event = (Event) o;

        if (isSendNotification != event.isSendNotification) return false;
        if (eventType != null ? !eventType.equals(event.eventType) : event.eventType != null)
            return false;
        if (assignments != null ? !assignments.equals(event.assignments) : event.assignments != null) return false;
        if (associatedIntegrationPartner != null ? !associatedIntegrationPartner.equals(event.associatedIntegrationPartner) : event.associatedIntegrationPartner != null)
            return false;
        if (description != null ? !description.equals(event.description) : event.description != null) return false;
        if (dueDate != null ? !dueDate.equals(event.dueDate) : event.dueDate != null) return false;
        if (eventMetaData != null ? !eventMetaData.equals(event.eventMetaData) : event.eventMetaData != null)
            return false;
        if (name != null ? !name.equals(event.name) : event.name != null) return false;
        if (noteBody != null ? !noteBody.equals(event.noteBody) : event.noteBody != null) return false;
        if (notes != null ? !notes.equals(event.notes) : event.notes != null) return false;
        if (notificationBody != null ? !notificationBody.equals(event.notificationBody) : event.notificationBody != null)
            return false;
        if (notificationSubject != null ? !notificationSubject.equals(event.notificationSubject) : event.notificationSubject != null)
            return false;
        if (permissions != null ? !permissions.equals(event.permissions) : event.permissions != null) return false;
        if (visibilityEndDate != null ? !visibilityEndDate.equals(event.visibilityEndDate) : event.visibilityEndDate != null)
            return false;
        if (visibilityStartDate != null ? !visibilityStartDate.equals(event.visibilityStartDate) : event.visibilityStartDate != null)
            return false;

        return true;
    }

    /**
     * Return a hashcode for an object of event type
     * @return number
     */
    @Override
    public int hashCode() {
        int result = dueDate != null ? dueDate.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (eventType != null ? eventType.hashCode() : 0);
        result = 31 * result + (eventMetaData != null ? eventMetaData.hashCode() : 0);
        result = 31 * result + (visibilityStartDate != null ? visibilityStartDate.hashCode() : 0);
        result = 31 * result + (visibilityEndDate != null ? visibilityEndDate.hashCode() : 0);
        result = 31 * result + (associatedIntegrationPartner != null ? associatedIntegrationPartner.hashCode() : 0);
        result = 31 * result + (permissions != null ? permissions.hashCode() : 0);
        result = 31 * result + (noteBody != null ? noteBody.hashCode() : 0);
        result = 31 * result + (notificationSubject != null ? notificationSubject.hashCode() : 0);
        result = 31 * result + (notificationBody != null ? notificationBody.hashCode() : 0);
        result = 31 * result + (isSendNotification ? 1 : 0);
        result = 31 * result + (assignments != null ? assignments.hashCode() : 0);
        result = 31 * result + (notes != null ? notes.hashCode() : 0);
        return result;
    }
}

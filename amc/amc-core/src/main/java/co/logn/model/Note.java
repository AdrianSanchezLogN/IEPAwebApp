package co.logn.model;

import org.hibernate.annotations.ForeignKey;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import java.util.Date;

/**
 * Created by logn on 3/7/14.
 * @author Cristian Sanchez
 *
 * Entity used to map calendars table
 */

@Entity
@Table(name = "note")
@XmlRootElement
public class Note extends EntityClass {

    @Column(name = "owner_calendar_id", length = 40)
    private String ownerCalendarId;

    @Column(name = "note_date")
    private Date noteDate;

    @Column(name = "title", length = 60)
    private String title;

    @Column(name = "body", length = 80)
    private String body;

    @Column(name = "notification_subject", length = 20)
    private String notificationSubject;

    @Column(name = "notification_body", length = 80)
    private String notificationBody;

    @Column(name = "is_send_notification")
    private boolean isSendNotification;

    @JoinColumn(name = "event_id", referencedColumnName = "id", updatable = false, insertable = false)
    @ForeignKey(name = "note_event_id")
    @ManyToOne
    private Event ownerIfEvent;

    @JoinColumn(name = "assignment_id", referencedColumnName = "id", updatable = false, insertable = false)
    @ForeignKey(name = "note_assignment_id")
    @ManyToOne
    private Assignment ownerIfAssignment;

    public Note(){}

    /**
     * Gets the owner calendar of the note
     * @return string
     */
    @XmlElement
    public String getOwnerCalendarId() {
        return ownerCalendarId;
    }

    /**
     * Assigns the owner calendar of the note
     * @param ownerCalendarId
     */
    public void setOwnerCalendarId(String ownerCalendarId) {
        this.ownerCalendarId = ownerCalendarId;
    }

    /**
     * Gets the date of the note
     * @return Date
     */
    @XmlElement
    public Date getNoteDate() {
        return noteDate;
    }

    /**
     * Assigns the date of the note
     * @param noteDate
     */
    public void setNoteDate(Date noteDate) {
        this.noteDate = noteDate;
    }

    /**
     * Gets the title of the note
     * @return string
     */
    @XmlElement
    public String getTitle() {
        return title;
    }

    /**
     * Assigns the title of the note
     * @param title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the body of the note
     * @return string
     */
    @XmlElement
    public String getBody() {
        return body;
    }

    /**
     * Assigns the body of the note
     * @param body
     */
    public void setBody(String body) {
        this.body = body;
    }

    /**
     * Gets the notification subject of the note
     * @return string
     */
    @XmlElement
    public String getNotificationSubject() {
        return notificationSubject;
    }

    /**
     * Assigns the notification subject of the note
     * @param notificationSubject
     */
    public void setNotificationSubject(String notificationSubject) {
        this.notificationSubject = notificationSubject;
    }

    /**
     * Gets the notification body of the note
     * @return string
     */
    @XmlElement
    public String getNotificationBody() {
        return notificationBody;
    }

    /**
     * Assigns the notification body of the note
     * @param notificationBody
     */
    public void setNotificationBody(String notificationBody) {
        this.notificationBody = notificationBody;
    }

    /**
     * Gets if notification is sent
     * @return true/false
     */
    @XmlElement
    public boolean isSendNotification() {
        return isSendNotification;
    }

    /**
     * Assigns the send state
     * @param isSendNotification
     */
    public void setSendNotification(boolean isSendNotification) {
        this.isSendNotification = isSendNotification;
    }

    /**
     * Gets the owner identifier if is an event
     * @return string
     */
    @XmlTransient
    public Event getOwnerIfEvent() {
        return ownerIfEvent;
    }

    /**
     * Assigns the owner if is an event
     * @param ownerEvent
     */
    public void setOwnerIfEvent(Event ownerEvent) {
        this.ownerIfEvent = ownerEvent;
    }

    /**
     * Gets the owner identifier if is an assignment
     * @return string
     */
    @XmlTransient
    public Assignment getOwnerIfAssignment() {
        return ownerIfAssignment;
    }

    /**
     * Assigns the owner if is an assignment
     * @param ownerAssignment
     */
    public void setOwnerIfAssignment(Assignment ownerAssignment) {
        this.ownerIfAssignment = ownerAssignment;
    }

    /**
     * Util for comparing two objects of note type
     * @param o
     * @return true/false
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Note)) return false;

        Note note = (Note) o;

        if (isSendNotification != note.isSendNotification) return false;
        if (body != null ? !body.equals(note.body) : note.body != null) return false;
        if (noteDate != null ? !noteDate.equals(note.noteDate) : note.noteDate != null) return false;
        if (notificationBody != null ? !notificationBody.equals(note.notificationBody) : note.notificationBody != null)
            return false;
        if (notificationSubject != null ? !notificationSubject.equals(note.notificationSubject) : note.notificationSubject != null)
            return false;
        if (ownerCalendarId != null ? !ownerCalendarId.equals(note.ownerCalendarId) : note.ownerCalendarId != null)
            return false;
        if (title != null ? !title.equals(note.title) : note.title != null) return false;

        return true;
    }

    /**
     * Util for generate hash code for using hash table
     * @return int
     */
    @Override
    public int hashCode() {
        int result = ownerCalendarId != null ? ownerCalendarId.hashCode() : 0;
        result = 31 * result + (noteDate != null ? noteDate.hashCode() : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (body != null ? body.hashCode() : 0);
        result = 31 * result + (notificationSubject != null ? notificationSubject.hashCode() : 0);
        result = 31 * result + (notificationBody != null ? notificationBody.hashCode() : 0);
        result = 31 * result + (isSendNotification ? 1 : 0);
        return result;
    }

    /**
     * Return readable class of note
     * @return string
     */
    @Override
    public String toString() {
        return "Note{" +
                "ownerCalendarId=" + ownerCalendarId +
                ", noteDate=" + noteDate +
                ", title=" + title +
                ", body=" + body +
                ", notificationSubject=" + notificationSubject +
                ", notificationBody=" + notificationBody +
                ", isSendNotification=" + isSendNotification +
                '}';
    }
}

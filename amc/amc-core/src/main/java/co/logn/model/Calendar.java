package co.logn.model;

import org.hibernate.annotations.ForeignKey;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlTransient;
import java.util.List;

/**
 * Created by logn on 2/19/14.
 * @author Cristian Sanchez
 *
 * Entity used to map calendars table
 */

@Entity
@Table(name = "calendar")
@XmlRootElement
public class Calendar extends EntityClass {

    @Column(name = "name", length = 20)
    private String name;

    @JoinColumn(name = "user_id", referencedColumnName = "user_id", updatable = false, insertable = false)
    @ForeignKey(name = "calendar_user_id")
    @ManyToOne
    private User owner;

    @Column(name = "owner_name", length = 20)
    private String ownerName;

    @Column(name = "calendar_type", length = 10)
    private String calendarType;

    @Column(name = "permissions")
    private String permissions; // Object

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id")
    private List<Event> events;

    public Calendar(){}

    /**
     * Gets the name of the calendar
     * @return name
     */
    @XmlElement
    public String getName() {
        return this.name;
    }

    /**
     * Assign the name to the instance of calendar
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the owner of this calendar
     * @return identifier
     */
    @XmlTransient
    public User getOwner() {
        return this.owner;
    }

    /**
     * Assign the owner of this calendar
     * @param owner
     */
    public void setOwner(User owner) {
        this.owner = owner;
    }

    /**
     * Get the name of the owner of this book
     * @return String name
     */
    @XmlElement
    public String getOwnerName() {
        return this.ownerName;
    }

    /**
     * Assign the owner name for this calendar
     * @param ownerName
     */
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    /**
     * Get the type of a calendar
     * @return String calendarType
     */
    @XmlElement
    public String getCalendarType() {
        return this.calendarType;
    }

    /**
     * Assign the type of this calendar
     * @param calendarType
     */
    public void setCalendarType(String calendarType) {
        this.calendarType = calendarType;
    }

    /**
     * Get the permissions for this calendar
     * @return Object permissions
     */
    @XmlElement
    public String getPermissions() { return this.permissions; }

    /**
     * Assign the permissions for this calendar
     * @param permissions
     */
    public void setPermissions(String permissions) { this.permissions = permissions; }

    /**
     * Get the events for this calendar
     * @return events list
     */
    @XmlElement
    public List<Event> getEvents() {
        return this.events;
    }

    /**
     * Assign the events for this calendar
     * @param events
     */
    public void setEvents(List<Event> events) {
        this.events = events;
    }

    /**
     * Prints this class in text format
     * @return data in text form
     */
    @Override
    public String toString() {
        return "Calendar{" +
                "name='" + name + '\'' +
                ", ownerName='" + ownerName + '\'' +
                ", calendarType='" + calendarType + '\'' +
                ", permissions='" + permissions + '\'' +
                ", events=" + events +
                '}';
    }
    /**
     * Compares if other object is equal to this if its an instance of calendar
     * @param o
     * @return true / false
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Calendar calendar = (Calendar) o;

        if (calendarType != null ? !calendarType.equals(calendar.calendarType) : calendar.calendarType != null)
            return false;
        if (events != null ? !events.equals(calendar.events) : calendar.events != null) return false;
        if (name != null ? !name.equals(calendar.name) : calendar.name != null) return false;
        if (owner != null ? !owner.equals(calendar.owner) : calendar.owner != null) return false;
        if (ownerName != null ? !ownerName.equals(calendar.ownerName) : calendar.ownerName != null) return false;
        if (permissions != null ? !permissions.equals(calendar.permissions) : calendar.permissions != null)
            return false;

        return true;
    }

    /**
     * Generates the hash code based on its attributes
     * @return hash code number
     */
    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (owner != null ? owner.hashCode() : 0);
        result = 31 * result + (ownerName != null ? ownerName.hashCode() : 0);
        result = 31 * result + (calendarType != null ? calendarType.hashCode() : 0);
        result = 31 * result + (permissions != null ? permissions.hashCode() : 0);
        result = 31 * result + (events != null ? events.hashCode() : 0);
        return result;
    }
}

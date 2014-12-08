package co.logn.model;

import org.hibernate.annotations.ForeignKey;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import java.util.Date;
import java.util.List;

/**
 * Created by logn on 3/11/14.
 * @author Cristian Sanchez
 *
 * Entity used to map assignments table
 */

@Entity
@Table(name = "assignment")
@XmlRootElement
public class Assignment extends EntityClass {

    @Column(name = "name", length = 20)
    private String name;

    @Column(name = "due_date")
    private Date dueDate;

    @Column(name = "description", length = 80)
    private String description;

    @Column(name = "assignment_type", length = 10)
    private String assignmentType; // Required - Optional

    @Column(name = "visibility_start_date")
    private Date visibilityStartDate;

    @Column(name = "visibility_end_date")
    private Date visibilityEndDate;

    @ManyToOne
    @ForeignKey(name = "assignment_event_id")
    @JoinColumn(name = "event_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Event ownerEvent;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id")
    private List<Note> notes;

    public Assignment(){}

    /**
     * Obtains the name of this Assignment
     * @return name
     */
    @XmlElement
    public String getName() {
        return name;
    }

    /**
     * Assigns the name for this name
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Obtains the duedate for the assignment
     * @return duedate
     */
    @XmlElement
    public Date getDueDate() {
        return dueDate;
    }

    /**
     * Assigns the duedate for the assignment
     * @param dueDate
     */
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    /**
     * Obtains the description of the assignment
     * @return description
     */
    @XmlElement
    public String getDescription() {
        return description;
    }

    /**
     * Assigns the description for the assignment
     * @param description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Obtains the type of assignment
     * @return type descriptor
     */
    @XmlElement
    public String getAssignmentType() {
        return assignmentType;
    }

    /**
     * Assigns the type for this assignment
     * @param assignmentType
     */
    public void setAssignmentType(String assignmentType) {
        this.assignmentType = assignmentType;
    }

    /**
     * Obtains the date when assignment going to be visible
     * @return visibility start date
     */
    @XmlElement
    public Date getVisibilityStartDate() {
        return visibilityStartDate;
    }

    /**
     * Assigns the date when assignment going to be visible
     * @param visibilityStartDate
     */
    public void setVisibilityStartDate(Date visibilityStartDate) {
        this.visibilityStartDate = visibilityStartDate;
    }

    /**
     * Obtains the date when assignment doesnt be visible
     * @return visibility end date
     */
    @XmlElement
    public Date getVisibilityEndDate() {

        return visibilityEndDate;
    }

    /**
     * Assigns the date when assignment doesnt be visible
     * @param visibilityEndDate
     */
    public void setVisibilityEndDate(Date visibilityEndDate) {
        this.visibilityEndDate = visibilityEndDate;
    }

    /**
     * Gets the owner event of the assignment
     * @return Event
     */
    @XmlTransient
    public Event getOwnerEvent() {
        return ownerEvent;
    }

    /**
     * Assigns the owner event of the assignment
     * @param ownerEvent
     */
    public void setOwnerEvent(Event ownerEvent) {
        this.ownerEvent = ownerEvent;
    }

    /**
     * Gets the notes of this assignment
     * @return notes list
     */
    public List<Note> getNotes() {
        return notes;
    }

    /**
     * Assigns the notes for this assignment
     * @param notes
     */
    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    /**
     * Util for comparing objects in this class format
     * @param o
     * @return boolean
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Assignment that = (Assignment) o;

        if (assignmentType != null ? !assignmentType.equals(that.assignmentType) : that.assignmentType != null)
            return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (dueDate != null ? !dueDate.equals(that.dueDate) : that.dueDate != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (notes != null ? !notes.equals(that.notes) : that.notes != null) return false;
        if (visibilityEndDate != null ? !visibilityEndDate.equals(that.visibilityEndDate) : that.visibilityEndDate != null)
            return false;
        if (visibilityStartDate != null ? !visibilityStartDate.equals(that.visibilityStartDate) : that.visibilityStartDate != null)
            return false;

        return true;
    }

    /**
     * Util for generate an hash code for an object
     * @return hash code int
     */
    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (dueDate != null ? dueDate.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (assignmentType != null ? assignmentType.hashCode() : 0);
        result = 31 * result + (visibilityStartDate != null ? visibilityStartDate.hashCode() : 0);
        result = 31 * result + (visibilityEndDate != null ? visibilityEndDate.hashCode() : 0);
        result = 31 * result + (notes != null ? notes.hashCode() : 0);
        return result;
    }

    /**
     * Get this object in text format readable for an user
     * @return object in string format
     */
    @Override
    public String toString() {
        return "Assignment{" +
                "name='" + name + '\'' +
                ", dueDate=" + dueDate +
                ", description='" + description + '\'' +
                ", assignmentType='" + assignmentType + '\'' +
                ", visibilityStartDate=" + visibilityStartDate +
                ", visibilityEndDate=" + visibilityEndDate +
                ", notes=" + notes +
                '}';
    }
}

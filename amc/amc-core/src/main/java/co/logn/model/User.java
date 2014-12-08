package co.logn.model;

import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.OneToMany;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;
import java.util.List;

/**
 * Created by logn on 3/3/14.
 * @author Cristian Sanchez
 *
 * This works as User who belongs to a Group
 */

@Entity
@Table(name = "user")
@XmlRootElement
public class User {

    @Id
    @Column(name = "user_id")
    private String id;

    @Column(name = "role")
    private String role;

//    @ManyToMany(fetch = FetchType.LAZY) // fetch all data and store into <List> but only when it's needed
//    @JoinTable(name = "user_grouping",
//            joinColumns =
//                    {@JoinColumn(name = "user_id", referencedColumnName = "id")},
//            inverseJoinColumns =
//                    {@JoinColumn(name = "grouping_id", referencedColumnName = "id")})
//    private List<Grouping> groupings;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private List<Calendar> calendars;

    public User() { }


    /**
     * Gets the identifier for this user
     * @return id
     */
    @XmlElement
    public String getId() { return this.id; }

    /**
     * Assigns the identifier for the user
     * @param id
     */
    public void setId(String id) {this.id = id;}

    /**
     * Get the role off this user
     * @return role
     */
    @XmlElement
    public String getRole() {
        return role;
    }

    /**
     * Assigns the role for this user
     * @param role
     */
    public void setRole(String role) {
        this.role = role;
    }

//    /**
//     * Gets a list of groups where this user exists
//     * @return List of groups or empty list
//     */
//    public List<Grouping> getGroups() {
//        return groupings;
//    }
//
//    /**
//     * Assign groups for this user
//     * @param groups
//     */
//    public void setGroups(List<Grouping> groups) {
//        this.groupings = groups;
//    }

    /**
     * Gets a list of calendars where this user exists
     * @return List of calendars or empty list
     */
    @XmlElement
    public List<Calendar> getCalendars() {
        return calendars;
    }

    /**
     * Assign calendars for this user
     * @param calendars
     */
    public void setCalendars(List<Calendar> calendars) {
        this.calendars = calendars;
    }

    /**
     * Get this object in text format readable for an user
     * @return object in string format
     */
    @Override
    public String toString() {
        return "User{" +
                "role=" + role +
//                ", groupings=" + groupings +
                ", calendars=" + calendars +
                '}';
    }

    /**
     * Util for comparing objects in this class format
     * @param o
     * @return boolean
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;

        User user = (User) o;

        if (calendars != null ? !calendars.equals(user.calendars) : user.calendars != null) return false;
//        if (groupings != null ? !groupings.equals(user.groupings) : user.groupings != null) return false;
        if (role != user.role) return false;

        return true;
    }

    /**
     * Util for generate an hash code for an object
     * @return hash code int
     */
    @Override
    public int hashCode() {
        int result = role != null ? role.hashCode() : 0;
//        result = 31 * result + (groupings != null ? groupings.hashCode() : 0);
        result = 31 * result + (calendars != null ? calendars.hashCode() : 0);
        return result;
    }
}

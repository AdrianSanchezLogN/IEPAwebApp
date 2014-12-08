package co.logn.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by logn on 3/4/14.
 * @author Cristian Sanchez
 *
 * Entity used to map calendars table
 */

@XmlRootElement
@Entity
@Table(name = "grouping")
public class Grouping extends EntityClass {

    @Column(name = "name", length = 20)
    private String name;

    @Column(name = "number")
    private int number;

//    @Column(name = "creator")
//    private User creator;

//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "groupings")
//    private List<User> students;

    /**
     *Obtains the name for this group
     * @return name info
     */
    @XmlElement
    public String getName() {
        return name;
    }

    /**
     *Assigns the name for the group
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     *Obtains the number of this group
     * @return number
     */
    public int getNumber() {
        return number;
    }

    /**
     *Assigns the number of group
     * @param number
     */
    public void setNumber(int number) {
        this.number = number;
    }

//    /**
//     *Obtains the list of students of this group
//     * @return students list in Json format
//     */
//    public List<User> getStudents() {
//        return students;
//    }
//
//    /**
//     *Assigns the list of students to this group
//     * @param students as list
//     */
//    public void setStudents(List<User> students) {
//        this.students = students;
//    }

//    /**
//     * Gets the creator of this calendar
//     * @return user
//     */
//    public User getCreator() {
//        return creator;
//    }
//
//    /**
//     * Assigns the creator of this calendar
//     * @param creator
//     */
//    public void setCreator(User creator) {
//        this.creator = creator;
//    }

    /**
     * Converts the method to return Json format
     * @return this class in text format
     */
    @Override
    public String toString() {
        return "Grouping{" +
                "name='" + name + '\'' +
                ", number=" + number +
//                ", creator=" + creator +
//                ", students=" + students +
                '}';
    }

    /**
     * Compares if other object is equal to this if its an instance of group
     * @param o
     * @return true / false
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Grouping grouping = (Grouping) o;

        if (number != grouping.number) return false;
//        if (creator != null ? !creator.equals(grouping.creator) : grouping.creator != null) return false;
        if (name != null ? !name.equals(grouping.name) : grouping.name != null) return false;
//        if (students != null ? !students.equals(grouping.students) : grouping.students != null) return false;

        return true;
    }

    /**
     * Generates the hash code based on its attributes
     * @return hash code number
     */
    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + number;
//        result = 31 * result + (creator != null ? creator.hashCode() : 0);
//        result = 31 * result + (students != null ? students.hashCode() : 0);
        return result;
    }
}

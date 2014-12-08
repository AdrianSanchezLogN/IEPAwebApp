package co.logn.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.xml.bind.annotation.XmlElement;
import java.io.Serializable;

/**
 * Created by logn on 2/20/14.
 * @author Cristian Sanchez
 *
 * Parent class for entity classes
 */
@MappedSuperclass
public abstract class EntityClass implements Serializable{

    /**
     * EntityClass primary key
     * UUID identifier formatted as a String, used as primary key
     */
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid", parameters = {@Parameter(name = "separator", value = "-")})
    @Column(name = "id", length = 40)
    private String id;

    public EntityClass() {}

    /**
     * Get the class unique identifier
     * @return Calendar identifier
     */
    @XmlElement
    public String getId() {
        return id;
    }

    /**
     *Assign the unique value to the ID of the class
     * @param id
     */
    public void setId(String id) {
        this.id = id;
    }
}

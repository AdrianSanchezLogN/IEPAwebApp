package co.logn.model.util;

/**
 * Created by logn on 27/03/14.
 * @author Cristian Sanchez
 *
 * Contains different types for user's roles
 */
public enum RoleType {

    INSTRUCTOR("instructor"),
    STUDENT("student");

    private String value;

    private RoleType(String val) { value = val; }

    public String getValue() { return value; }
}

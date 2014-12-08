package co.logn.model.util;

/**
 * Created by logn on 27/03/14.
 * @author Cristian Sanchez
 *
 * Contains the types of calendars that AMC manages
 */
public enum CalendarType {

    INSTRUCTOR("instructor"),
    STUDENT("student"),
    GENERIC("generic");

    private String value;

    private CalendarType(String val) { value = val; }

    public String getValue() { return value; }
}

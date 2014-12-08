package co.logn.util;

import co.logn.model.User;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import javax.annotation.PostConstruct;
import javax.ws.rs.core.MediaType;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by logn on 3/27/14.
 * @author Cristian Sanchez
 *
 * This util carries the external endpoints requests
 */
public class UserClientUtil {

    private Client client = Client.create();
    private WebResource webResource;
    private ClientResponse response;
    private String urlBase = "http://iqa.bluesky.lognllc.com/csg/api/v2";
    private String urlLogin = "/authentication/login";
    private String urlGetUser = "/user";
    private String headerAuthorization = "CSG apikey=77f29002-7a0d-11e3-be93-8a729cb7c09e, sessiontoken=a099078c-b5bd-4653-b835-110905f6b765";


    @PostConstruct
    public void init() throws IOException{
        loadPropertiesFromFile("co/logn/resources/amc.properties");
    }

    /**
     * Gets the user data when login CSG API
     * @param jsonUser
     * @return user
     */
    public User login(JSONObject jsonUser){
        User user = new User();
        try{
            webResource = client.resource(urlBase + urlLogin);
            response = webResource.type(MediaType.APPLICATION_JSON).header("Authorization", headerAuthorization).post(ClientResponse.class, jsonUser);
            if(response.getStatus() != 200){
                return user;
            }
            JSONObject ExternalJsonObject = new JSONObject(response.getEntity(String.class));
            user.setId(ExternalJsonObject.getString("userId"));
            user.setRole(ExternalJsonObject.getJSONArray("userRoles").get(0).toString());
            user.setId(ExternalJsonObject.getString("userId"));
            return user;
        }
        catch(JSONException e){
            e.printStackTrace();
            return user;
        }
    }

    /**
     * Gets an specific user with all his information
     * @param userId
     * @return json object
     */
    public JSONObject getUser(String userId){
        JSONObject user = new JSONObject();
        try{
            webResource = client.resource(urlBase + urlGetUser + "/" + userId);
            response = webResource.accept(MediaType.APPLICATION_JSON).header("Authorization", headerAuthorization).get(ClientResponse.class);
            user = response.getEntity(JSONObject.class);
            return user;
        }
        catch (Exception e){
            e.printStackTrace();
            return user;
        }
    }

    /**
     * Load all properties from file
     * @param filename
     * @throws IOException
     */
    private void loadPropertiesFromFile(String filename) throws IOException{
        try (FileReader reader = new FileReader(filename)){
            Properties properties = new Properties();
            properties.load(reader);
            urlBase = properties.getProperty("url.base");
            urlLogin = properties.getProperty("url.login");
            urlGetUser = properties.getProperty("url.getuser");
            headerAuthorization = properties.getProperty("header.authorization");
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }
}

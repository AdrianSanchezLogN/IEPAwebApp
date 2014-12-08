#! /bin/sh

echo "****************" mvn clean install  "****************"
mvn clean install -Dmaven.test.skip=true -o

echo "****************" UNDEPLOYING AMC WAR: amc-webservice.war "****************"
rm -rf  $CATALINA_HOME/webapps/am*
cp amc-webservice/target/amc.war $CATALINA_HOME/webapps/
echo "****************" Copy to webapp amc.war "****************"
if this is your first time setting up the sonarqube and jenkins servers, run:
```bash
cd docker
docker-compose up -d
```
launch your jenkins server on http://localhost:8080/. then in your terminal, run:
```bash
docker ps
```
copy the container id of your jenkins server
```bash
docker exec -it <jenkins-container-id> /bin/bash
cat /var/jenkins_home/secrets/initialAdminPassword 
```
past the initial password into your jenkins, and install the suggested plugins

launch your sonarqube server on http://localhost:9000/. then log in with username and password: admin. reset this as you wish. next, click on your profile icon on the top right > "My Account" > "Security" tab. Generate a user token e.g. jenkins-token

open jenkins, and click "Manage Jenkins" > under the Security section, click "Credentials" > under Stores scoped to Jenkins, click "System" > "Global credentials (unrestricted)" > "Add Credentials". change kind to "Secret Text". paste the token you generated in sonarqube under "Secret", and give your secret a name under "ID" e.g. sonar-jenkins-token



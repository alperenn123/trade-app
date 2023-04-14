# trade-app

To run this project, you will need to have Docker and Docker Compose installed on your system.

Clone the repository:  
`git clone https://github.com/<username>/<repository>.git`


Navigate to the project directory:  
`cd <repository>`


Start the Docker containers:  
`docker compose up --build -d && docker compose logs -f`


This will build the Docker image and start the containers in detached mode and also you will be able to see the logs with docker compose logs command. You should see output in the console indicating that the app is running.  


I exported the **Postman** collection and commit it as **postman-collection.json**, it can be imported to **Postman** to use the endpoints.  


When closing the docker containers, it is advisable to delete the volume with this command:  
`docker compose down --volumes`


Configuration  
The app is configured to listen on port **3000**. You can change this by editing the **docker-compose.yml** file.  


License  
This project is licensed under the MIT License.  

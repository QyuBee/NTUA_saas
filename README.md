# Mychart
Student: Quentin BARON (ERASMUS)

## Installation
You can use the script [docker-compose.yaml](./docker-compose.yaml), it will create the stack with the last image build from repository. Or you can build the image from [Dockerfile](./Dockerfile).
You need to specify the environnement variable inside [docker-compose.yaml](./docker-compose.yaml) such as GOOGLE_ID, GOOGLE_SECRET and NEXTAUTH_SECRET.

## Demo
This project is accessible on [dev.qyubee.fr](https://dev.qyubee.fr). This is a private server where I excecute this project.

## Stress Test

I don't think I have enough time to do it. I may be very late because I don't know when to return the project.

## ULM
As my free trial of Visual Paradigm run out, I could use it for my diagram. I hope theses schemes will be fine for you. 
### Class Diagram
![Class Diagram](docs/class_diagram.png)

### Deployement Diagram
![Deployement Diagram](docs/deployement_diagram.png)

### Component Diagram
![Component Diagram](docs/component_diagram.png)

### Sequence Diagram : MyCharts
![sequence diagram My Charts](docs/seq_diagram_My_Charts.png)
### Sequence Diagram : Create User
![sequence diagram Create User](docs/seq_diagram_Create_user.png)

### Sequence Diagram : Create Chart
![sequence diagram Create Chart](docs/seq_diagram_Create_chart.png)
### Sequence Diagram : Purchase Credits
![sequence diagram Purchase Credit](docs/seq_diagram_Purchase_Credit.png)
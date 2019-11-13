# System Integration Mini Project 2: EIP

Assignment: [Link to PDF](https://github.com/datsoftlyngby/soft2019fall-si/blob/master/docs/MiniProjects/GP2.pdf)

## Authors Details
- Mathias Bigler (cph-mb493@cphbusiness.dk)
- Stanislav Novitski (cph-sn183@cphbusiness.dk) 
- Alexander Winther Hørsted-Andersen (cph-ah353@cphbusiness.dk)

## System architecture
![Weee](<assets/Miniproject2.png>)
*Architecture and simple sequence illustration*

## Requirements & How to run

Created in NodeJS
### Installation
*Requires NodeJS installed*

```javascript
npm install
```

We are running everything locally, except RabbitMQ, so we need some terminals to get this running.

* (JSON data source) Run the server in **/json-data-server/server.js**: node server.js 
* (TXT data source) Run the server in **/txt-data-server/server.js**: node server.js
* (The actual car rental service CLI) run the server in **/getDataMOMService/server.js**: node server.js
* RabbitMQ already runs on www.mathiasbigler.com:15672
* Main CLI run the program with **root folder**: node main.js
* (Consumer of bookings) run the server in **/carrentalMOMConsumer/server.js**: node server.js

## Overview

We have created a system that uses MOM as an integration platform. Our setup of MOM is done by setting up a
[RabbitMQ](https://www.rabbitmq.com/) server on one of our servers. Specifically on www.mathiasbigler.com:15672.

The RabbitMQ instance runs in a Docker container instantiated
by this command: 
````
docker run -d -p 15672:15672 -p 5672:5672 -p 5671:5671 --hostname my-rabbitmq --name my-rabbitmq-container rabbitmq:3-management
````

## Business Process
The general idea behind the process is that a user can define a search criteria which resolves in a response with a list of cars based on the criteria. The user can then choose a specific car and send a booking to the car rental company.

* The user chooses car make and minimum year of creation of car.
* The request is sent to car rental service.
* The service sends a filtered list back to user.
* The user chooses from returned list, enters booking details, and sends car booking request.
* Car rental company (Or Mathias Bigler) accepts booking.

![Business Process Management Notation image](<assets/MiniProject2_BPMN_Diagram.png>)

## Enterprise Integration Patterns

We have tried to implement, at least, the following Enterprise Integration Patterns in the project:

- [Request-reply](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html)
    - To transfer of messages between the Client Application and the Car Rental Service
- [Aggregator (slightly)](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Aggregator.html)
    - To collect cars from diffent data sources (json and txt files) and return them as a combined list of cars.
- [Messaging Channel](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageChannel.html)
    - To send the final booking from the Client to the RabbitMQ server, thus allowing the Car Rental Broker to accept the booking.
- [Message](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Message.html)
    - To transfer of messages between the Client Application and the Car Rental Broker (Mathias Bigler)
- [Return Address](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ReturnAddress.html)
    - To transfer a message back (through the request-reply pattern) to the correct sender.

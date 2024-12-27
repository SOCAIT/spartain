// import {
//     REACT_APP_BACKEND_URL, 
//     REACT_APP_BACKEND_URL_EXODIA,
//     REACT_APP_BACKEND_URL_EXODIA_PAY,
//     REACT_APP_BACKEND_URL_PAY,
//     REACT_APP_BACKEND_URL_EXODIA_GRAPH,
//     REACT_APP_BACKEND_URL_GRAPH

// } from "@env"


var backend_url_exodia = "https://demo.entangle-app.com/api/"

var backend_url_neo4j = "http://192.168.2.22:8000/graph/";
//var backend_url_neo4j = "http://192.168.2.17:8000/graph/";
//var backend_url_neo4j= "http://192.168.0.108:8000/graph/";
//var backend_url_neo4j= "http://192.168.0.108:8000/graph/";
//var backend_url_neo4j = "http://172.20.249.129:8000/graph/";

var backend_url_payments = "https://demo.entangle-app.com/payments/";
//var backend_url_payments = "http://192.168.2.17:8000/payments/";
//var backend_url_payments= "http://192.168.0.108:8000/payments/";
//var backend_url_payments= "http://192.168.0.108:8000/payments/";
//var backend_url_payments = "http://172.20.249.129:8000/graph/";


// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    
//     //Development
//     backend_url_exodia=REACT_APP_BACKEND_URL
//     backend_url_payments= REACT_APP_BACKEND_URL_PAY
//     backend_url_neo4j= REACT_APP_BACKEND_URL_GRAPH

//     // backend_url_exodia = REACT_APP_BACKEND_URL_EXODIA
//     // backend_url_payments= REACT_APP_BACKEND_URL_EXODIA_PAY
//     // backend_url_neo4j= process.env.REACT_APP_BACKEND_URL_EXODIA_GRAPH

//     console.log(process.env.REACT_APP_BACKEND_URL)
// } else {
//    backend_url_exodia = REACT_APP_BACKEND_URL_EXODIA
//    backend_url_payments= REACT_APP_BACKEND_URL_EXODIA_PAY
//    backend_url_neo4j= process.env.REACT_APP_BACKEND_URL_EXODIA_GRAPH
// }

backend_url_exodia= "https://d0ac-31-216-76-175.ngrok-free.app/api/";


// var backend_url= "http://192.168.1.6:3001/";

var backend_url = "https://socait.com:80/"

backend_url = "https://b928-31-216-76-175.ngrok-free.app/api/"

// backend_url ="http://34.102.246.190:80/api/"
//token
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUxNDEzNDU4LCJpYXQiOjE2NTE0MDk4NTgsImp0aSI6ImM2YWU4NTJmODU5MzQ0ZTU5NjE3ZWYyNzE0YmJmN2QzIiwidXNlcl9pZCI6N30.Oq1N45uSpn3MzYADepm-_5oCQGib5qwsn9XwWDfIhGc"

const publishableKey = ""

const lelouch_photo = "https://slifer.s3.amazonaws.com/Lelouch-Zero.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5MWUER255TQW3LTS%2F20220718%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20220718T112528Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=63c4c79d74efd3589b1bf44c6d0f1b6838ae3f1a8219743436a3fe1bd6703b28"



module.exports = {backend_url};
      
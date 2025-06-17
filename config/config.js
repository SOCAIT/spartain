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

backend_url_exodia= "https://8930-31-216-76-175.ngrok-free.app/api/";


// var backend_url= "http://192.168.1.6:3001/";

var backend_url = "https://socait.com:80/"

backend_url = "https://api.syntrafit.com/api/"
var agent_url = "https://ersebpxznd.eu-west-3.awsapprunner.com/chat"
//agent_url = "http://localhost:8000/chat"
var vision_url = "https://ni9upzgef8.eu-west-3.awsapprunner.com/"

//agent_url = "http://localhost:8080/chat"

// backend_url ="http://34.102.246.190:80/api/"

const USDA_API_KEY = "F5Jya9rrfbPA5nBtVQmThPdQRajXLBPITdNZyoOS"


module.exports = {backend_url, agent_url, vision_url, USDA_API_KEY};
      
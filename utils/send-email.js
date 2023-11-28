var nodemailer = require('nodemailer');

function SendEmail(req, res) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ermyas.tsedalu25@gmail.com',
            pass: 'bzsfglfawbflwuco'
        }
    });

    var emailHtml = `
<!DOCTYPE html>
<html>
<head>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <style>
   .card {
       box-shadow: 8px 4px 8px 8px rgba(4,4,4,4);
       transition: 0.3s;
       width: 40%;
       border-color:red;

       margin: auto;
       width: 50%;
       border-radius:5px;
       padding: 10px;
   }

   .card:hover {
   box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
   }

   .container {
   padding: 2px 16px;
   }
   </style>
</head>
<body style="background-color:#f3f2f0;">   
 <br/>       
   <div class="card" style="background-color:white;align:center;">
    
    <h2 style="align:center;color:green;">${req.body.title}</h2>
       <div class="container">
           <h4><b>${req.body.commandMessage}</b></h4> 
           <p> click here <a class="myLink" href="${req.body.url}">Create Password</a> </p> 
       </div>
   </div>
 <br/>
</body>
</html> 
`

    var mailOptions = {
        //from: 'ermyas.tsedalu25@gmail.com',
        to: req.body.email, //'mahletkidanemariam14@gmail.com',//'aregawhaileyesus@gmail.com',//'mahletkidanemariam14@gmail.com',
        subject: req.body.title,
        //text: `Click the link to create password for your tenant ` + <a class="myLink" href=""></a>
        html: emailHtml
    };



    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



module.exports = { SendEmail };


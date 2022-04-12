const { workerData } = require("worker_threads");
const nodeMailer = require("nodemailer")

async function main() {
    console.log(workerData.description);

    //Transporter configuration
    let transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4f32aaf03c55ee",
          pass: "a411b866326eab"
        }
    })

    var mailOptions = {
        from: 'chfrancisff@gmail.com',
        to: workerData.email,
        subject: 'Testmail',
        //text: 'Hi'+ workerData.email+' here is your conversation ID : [' + workerData.id +']  visit link https://function on'+ workerData.date,
        
        html:`
        

          <div style="">
            <div style="padding: 2px 16px;">
                <p> here are the details for your conversation ....</p>
                <p>Date : `+workerData.date+`</p>
                <p>conversationId : [`+workerData.id+`]  <small>(keep this secreet)</small></p>
                <p>conversationLink : <a href='http://127.0.0.1:3000/start-appointment'> link</a>  </p>

                visit the converation link on the set date
            </div>
          </div>  
        `,
      };

    //Email configuration
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

main().catch(err => console.log(err))
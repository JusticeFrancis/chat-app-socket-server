const express = require('express');
const Appointment = require("../models/appointmentModel");
const Bree = require('bree')
const dayjs = require('dayjs')
const moment = require('moment')



//converting string date to timestamp
const toTimestamp = (strDate) => {
    const dt = new Date(strDate).getTime();
    return dt / 1000;   
  } 




 async function createAppointment(req, res) {
     let reqDate = req.body.date
     let date  = reqDate.replace(/T/g,' ')+':00'
     console.log(date)
     let email = req.body.email

    if(req.body.date === '' || req.body.date === '')
    {
        return res.json('fill in input fields')
    }

    try {
        const newAppointment = new Appointment({date,email})
        newAppointment.save()
        let id = newAppointment.id
        console.log(id  )
        //bree instance
        const bree = new Bree({
            jobs : [{
            name : 'sendEmail',
            date : moment( date, 'YYYY-MM-DD h:m:s').toDate(),
            worker : {
                workerData : {
                description : "This job will send emails.",
                email : email,
                date : date,
                id : id
                }
            }
            }]
        })

        bree.start()

        
          
        return res.json({'appointment': newAppointment , 'message' : 'successfull'})
    } catch (error) {
        return res.json(error)
    }
};

module.exports.createAppointment = createAppointment





async function verifyAppointment(req , res){
    let id = req.body.id
    try {
        Appointment.findById(id)
        .then((doc)=>{
            let dateNow = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') 
            let nowDateTs = toTimestamp(dateNow)//0
            let appDateTs = toTimestamp(doc.date) //1000




            if(appDateTs >= nowDateTs){
                let timeDiff = appDateTs - nowDateTs
                let msg

                
                msg = 'come back later'
                return res.json({'msg' : msg, 'date' : doc.date,  'type' : 'error', 'id': doc.id} )

            }
            else{
                let timeDiff = appDateTs - nowDateTs
                let msg
                if(timeDiff > -3600){
                    msg = 'enter conversation'
                    return res.json({'msg' : msg, 'date' : doc.date ,  'type' : 'success', 'id': doc.id} )
                }
                else{
                    msg = 'make a new appointment, Appointment Id has expired'
                    return res.json({'msg' : msg, 'date' : doc.date ,  'type' : 'error', 'id': doc.id} )
                }
            }

        

         }).catch((err)=>{
             let msg = 'appointment id is invalid'
            return res.json({'msg' : msg, 'type' : 'failed'} )
         });
    } catch (error) {
        console.log(error)
    }
}

module.exports.verifyAppointment = verifyAppointment
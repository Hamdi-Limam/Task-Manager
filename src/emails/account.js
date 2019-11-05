const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'houssemzerai@gmail.com',
        subject:'Welcome to the app',
        text:`welcome to the app ${name} `
    })
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'houssemzerai@gmail.com',
        subject:'Cancelation email',
        text:`we are sorry that you are going to leave us ${name} `
    })
}
module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}
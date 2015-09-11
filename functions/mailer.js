var nodemailer = require('nodemailer');
function Mailer(email, id, user){
	this.email = email
	this.sendEmail = function(){
		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.SERVEREMAIL,
				pass: process.env.SERVERPASSWORD
			}
		});
		var html = "<h3>" + user + "</h3><h2>Thank you for registering!</h2> <br><a href=\"localhost:3000/#/login/" + id + "\">Activate your account</a><h5>Or visit localhost:3000/#/login/" + id + " and log in if the above link does not work.</h5>";
		//Non-HTML Email
		var text = "Thank you for registering! Visit visit localhost:3000/#/login/" + id + " and Log In"
		var mailOptions = {
			from: 'Ronald Porch <' + process.env.SERVEREMAIL + '>',
			to: email,
			subject: 'Registered for Angular Challenge!',
			text: text,
			html: html
		};

		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
		console.log('Message sent: ' + info.response);
		})	
	}
}
module.exports = Mailer;
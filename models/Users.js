var mongoose = require('mongoose')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
	username: {type:String, lowercase: true, unique: true},
	email: {type:String, lowercase: true, unique: true},
	active: {type:Boolean, default: false},
	hash: String,
	salt: String
})
UserSchema.methods.activate = function(){
	this.active = true;
}
UserSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}
UserSchema.methods.validPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash
}
UserSchema.methods.generateJWT = function(){
	var today = new Date()
	var exp = new Date(today)
	exp.setTime(exp.getTime() + (3*24*60*60*1000))

	return jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime()),
	},'SECRET');
};

mongoose.model('User',UserSchema)
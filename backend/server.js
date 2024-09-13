const express =require('express');
const sequelize=require('./config/connectdb');
const app=require('./app');
async function connectpsql()
 {
  try{
    await sequelize.authenticate();
    console.log('connected to database');
  }
    catch(error){
      console.error('error connecting'); 
    }
}
console.log('server getting called');
connectpsql();

app.listen({ port: 3000 }, function (err, address) {
	if (err) {
		express.log.error(err);
		process.exit(1);
	}
	console.log('Listening on port 3000');      
  // server code
});

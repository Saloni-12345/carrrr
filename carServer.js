let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods",
   "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD");
 res.header("Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-type, Accept");
 next();
});
var port = process.env.PORT||2410;
app.listen(port,() => console.log(`Node app listening on port ${port}!`));

let {carData } = require("./carData.js");
let {carMaster,cars} = carData;
app.get("/cars",function(req,res){
  let arr1 = cars;
  let minprice = req.query.minprice;
  let maxprice = req.query.maxprice;
  let fuel = req.query.fuel;
  let type = req.query.type;
  let sort = req.query.sort;
  if(minprice)
  arr1 = arr1.filter((a1)=>a1.price>=minprice);
  if(maxprice)
  arr1 = arr1.filter((a1)=>a1.price<=maxprice);
  if(fuel)
  arr1 = arr1.filter((a1)=>carMaster.find((c1)=>c1.model===a1.model).fuel===fuel);
  if(type)
  arr1 = arr1.filter((a1)=>carMaster.find((c1)=>c1.model===a1.model).type===type);
  if(sort==="kms")
  arr1.sort((a1,a2)=>+a1.kms-(+a2.kms));
  if(sort==="price")
  arr1.sort((a1,a2)=>+a1.price-(+a2.price));
  if(sort==="year")
  arr1.sort((a1,a2)=>+a1.year-(+a2.year));
  res.send(arr1);
});
app.get("/cars/:id",function(req,res){
  let id = req.params.id;
  let car = cars.find((c1)=>c1.id===id);
  if(car) res.send(car);
  else res.status(404).send("No car found");
})
app.get("/carmaster",function(req,res){
    let arr = carMaster;
    res.send(arr);
})
app.post("/cars",function(req,res){
  let body = req.body;
  let newCar = {...body};
  cars.push(newCar);
  res.send(newCar);
});
app.put("/cars/:id",function(req,res){
 let id = req.params.id;
 let body = req.body;
 let index = cars.findIndex((c1)=>c1.id===id);
 if(index>=0){
  let updateCar = {id:id,...body};
  cars[index] = updateCar;
  res.send(updateCar);
 }
 else res.status(404).send("No car found");
});
app.delete("/cars/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let index = cars.findIndex((c1)=>c1.id===id);
    if(index>=0){
       let car = cars.splice(index,1);
       res.send(car);
    }
    else res.status(404).send("No car found");
})

const express = require('express');
const app= express();
const mongoose=require('mongoose');
const url = "mongodb://localhost:27017/week6doctors";
const print= console.log;
const doctors=require("./models/doctors");
const patient=require("./models/patient");
const path=require("path");
let viewsPath = __dirname + "/views/";



app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.static("public/img"));
app.use(express.static("public/css"));
//Homepage request
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"views","index.html"));
})
//Add doctor page
app.get("/adddoctor",function(req,res){
    console.log("Add new doctor request")
    res.sendFile(path.join(__dirname,"views","adddoctor.html"));
})
//post request for doctor
app.post("/doctorpost",function(req,res){
    let newDocObj=req.body;
    let aDoctor= new doctors({
        fullname:newDocObj.fullname,
        lastname:newDocObj.lastname,
        dob:newDocObj.dob,
        state:newDocObj.state,
        suburb:newDocObj.suburb,
        street:newDocObj.street,
        unit:newDocObj.unit*1,

});
//saving process for new doctor
aDoctor.save(function(err){
    if(err){
        print(err);
        return;
    }
    console.log("Saved successfully");
    res.redirect("/listdoctor");
})
});
//post request for patient
app.post("/patientpost",function(req,res){
    let newPatObj=req.body;
    let aPatient= new patient({
        fullname:newPatObj.fullname,
        doctor:newPatObj.doctor,
        age:newPatObj.age,
        dateofvisit:newPatObj.dateofvisit,
        casedesc:newPatObj.casedesc,

});
//saving process for new patient
aPatient.save(function(err){
    if(err){
        print(err);
        return;
    }
    res.send("Saved successfully");
    res.redirect("/listpatient");
})
});
//Add patient page
app.get("/addpatient",function(req,res){
    console.log("Add new patient request")
    res.sendFile(path.join(__dirname,"views","addpatient.html"));
})

//delete patient page
app.get("/deletepatient",function(req,res){
    console.log("delete patient request")
    res.sendFile(path.join(__dirname,"views","deletepatient.html"));
})
//post request for delete patient
app.post("/deletepatient",function(req,res){
   let newPatObj= req.body;
   let filter ={fullname:newPatObj.fullname};
   patient.deleteOne(filter,function(err,doc){
   res.redirect("/listpatient");//redirect the client to list patient page
   })
   }
)
//patient list page
app.get("/listpatient",function(req,res){
    patient.find({},function(err,patient){
        res.render('/listpatient',{patient:patient});
    });
})
//doctor list page
app.get("/listdoctor",function(req,res){
    console.log("doctorlist request")
    doctors.find({},function(err,doctors){
        res.render('/listdoctor',{doctors:doctors});
    });
})
//update doctor page
app.get("/updatedoctor",function(req,res){
    console.log("update doctor request")
    res.sendFile(path.join(__dirname,"views","updatedoctor.html"));
})
//post request for update doctor
app.post("/updatedoctor",function(req,res){
    // let newDocObj=req.body;
    // let filter={numberPatients:newDocObj.numberPatients+1};
    // doctors.updateOne(filter,function(err,doc){
    //     res.redirect("/listdoctor");
    // })
    doctors.findOneAndUpdate({_id:doctors._id},
        {$inc:{numberPatients:1}} ,
        function(err,doc){
            res.redirect("/listdoctor");

        } )
})
//404 page
app.get("*",function(req,res){
    res.render("error.html");
})

mongoose.connect(url,function(err){
    if(err){
        print(err);
        return;
    }
    print("Successfully connected");

});

//extra task
app.get("/listdoctor1",function(req,res){
   doctors.find({numberPatients:{$lte:5}},function(err,doctors){
    res.render('/listpatient',{patient:patient});
    });
})

//insert a doctor to the collection
// let aDoctor= new doctors({
//     //_id:new mongoose.Types.ObjectId(),
//     //auto generate an id
//     fullname:"Mason Z",
//     numberPatients:21
    
// });
// aDoctor.save(function(err){
//     if(err){
//         print(err);
//         return;
//     }
//     print("Saved successfully");
// })
app.listen(8080);
const mongoose= require ("mongoose");

const patientSchema= mongoose.Schema({
_id: {type:mongoose.Schema.Types.ObjectId,
auto:true},
fullname:{
    type:String,
    required:true,//cannot be empty
},
doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Doctors'
},
age:{
    type:Number,
    validate:{
        validator:function(ageValue){
            return ageValue >=0 && ageValue<=120;
        }
    }
},
dateofvisit:{
    type:Date,
    default: Date.now
},
casedesc:{
    type:String,
    required:true,
    minLength:[10]
},
});

module.exports = mongoose.model('Patient', patientSchema);
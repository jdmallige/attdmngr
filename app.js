const express= require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const url = require('url')


//Database schema and model
var subSchema=mongoose.Schema({name:String,total:String});
var logSchema=mongoose.Schema({usn:String,time:{type:Date,default:Date.now()}})
var subModel=mongoose.model('subject',subSchema);
var logModel=mongoose.model('log',logSchema);
var schema=mongoose.Schema({ name: String,
    usn:String,
    me:String,
    cn:String,
    dbms:String,
    oomd:String,
    ai:String,
    atc:String,
    dbmsl:String,
    cnl:String,
    asd:String,
    cnt:String,
    dbmst:String,});
var connect=mongoose.connect('mongodb://jagdish123:mallige123@ds111192.mlab.com:11192/attddb');
var stdModel = mongoose.model('student',schema);


//port starting
var server=app.listen(process.env.PORT||3000);



//setting and middleware
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


//basic routes

//home route 
app.get('/',function(req,res){
    //console.log(req.cookies.user);
    
    res.render('home');
});

app.post('/',function(req,res){
    var usn=req.body.usn.toUpperCase();
    console.log(usn);
    if(usn)
    var stdData=stdModel.findOne({'usn':usn},{'_id':0,'v':0}).then(function(data,err){
      console.log(err);  
        if(data){
            res.cookie('user',usn,{maxAge:60*1000*4});
            var log=new logModel({usn:usn,date:Date.now()});
            log.save(function(err){if(err)console.log(err);});
    res.render('home1',{usn:usn});}
    else{
        res.render('404',{error:"wrong usn entered"});
    }
});
});

// script for saving the records in db runs once a week 

app.get('/save',function(req,res){
var i;
stdModel.deleteMany({},function(err){
    if(err)console.log(err);
});

    for( i=1;ise[i];i++)
{       
   var name=ise[i].NAME,usn=ise[i].ROLLNO,me=ise[i].ME,cn=ise[i].CN,atc=ise[i].ATC,dbms=ise[i].DBMS,oomd=ise[i].OOAD,ai=ise[i].AL;
   var cnt=ise[i].CNTUT,dbmst=ise[i].DBMSTUT,dbmsl=ise[i].DBMSLAB,cnl=ise[i].CNLAB,asd=ise[i].ASD;
    var std=new stdModel({ name: name,
        usn:usn,
        me:me,
        cn:cn,
        dbms:dbms,
        oomd:oomd,
        ai:ai,
        atc:atc,
        cnt:cnt,
        dbmst:dbmst,
        dbmsl:dbmsl,
        cnl:cnl,
        asd:asd});
    std.save(function(err){
       if(err) console.log(err);
    });
}
var tot=[
    {name:'me',total:ise[0].ME},
    {name:'cn',total:ise[0].CN},
    {name:'dbms',total:ise[0].DBMS},
    {name:'oomd',total:ise[0].OOAD},
    {name:'ai',total:ise[0].AL},
    {name:'atc',total:ise[0].ATC},
    {name:'cnt',total:ise[0].CNTUT},
    {name:'dbmst',total:ise[0].DBMSTUT},
    {name:'dbmsl',total:ise[0].DBMSLAB},
    {name:'cnl',total:ise[0].CNLAB},
    {name:'asd',total:ise[0].ASD}]
;

for(i=0;i<tot.length;i++)
{
    var sub=new subModel({name:tot[i].name,total:tot[i].total});
    sub.save(function(err){
        if(err)
        console.log(err);
        else
        {console.log("saved");}
    });
}
res.end("SAVED");
});

// bunk page route just displays a form to predict the % of a particular subject

app.get('/bunk',function(req,res){
    
    res.render('bunk',{});
});

// 
// 
app.post('/predict',function(req,res){
var usn=req.cookies.user;
var sub= req.body.sub,num=req.body.number,day=new Date(req.body.day).getUTCDay()-1;
console.log(sub+num+day);
time=[
    {"1":"AI","2":"ATC","3":"DBMS","4":"OOMD","5":"ME","6":"CN","day":"Monday"},
    {"1":"DBMS","2":"ASD","3":"ATC","4":"CN","5":"DBMS(T)","6":"OOMD","day":"Tuesday"},
    {"1":"ATC","2":"CN","3":"OOMD","4":"CN(T)","5":"ME","6":"AI","day":"Wednesday"},
    {"1":"ME","2":"AI","3":"DBMS","4":"CN","5":"LAB CN-1","6":"LAB DB-2","day":"Thursday"},
    {"1":"LAB CN-2","2":"LAB DB-1","3":"AI","4":"ME","5":"DBMS","6":"ATC","day":"Friday"}
    ];
    
    if(usn)
    var stdData=stdModel.findOne({'usn':usn},{'_id':0,'v':0}).then(function(data){
       
    var old=data[sub];
   
    var totalw=0;
    day=day>4?4:day;
    for(var i=0;i<=day;i++)
    {
        for(var j=1;j<=6;j++)
        
        if(time[i][j].toLowerCase()==sub)
         totalw++;
        
    }
    
    old= old.split( '' ).reverse( ).join( '' );
    //console.log(old);
    var attended=old.charAt(1);

    var total;
        subModel.findOne({name:sub},{_id:0}).then(function(data){
            console.log(data);
            total=data.total;
        console.log(total);
        total=parseInt(total);
        console.log(total);
        var a=parseInt(attended),n=parseInt(num),t=parseInt(totalw);
        // attended=parseInt(attended);
         var percent=(a+t-n)/(total+t)*100;
         var percent=Math.floor(percent);
         var d={attended:a+t-n,total:total+t,per:percent,sub:sub};
      res.render('predict',d);

    });
    
   
});

else
{
    res.render('404',{error:"relogin USN nt found"});
}
});

app.get('/attd',function(req,res){
    var usn=req.cookies.user;
   
    console.log(req.cookies.user);
    
   // var urlp=url.parse(req.url,true);
   // var usn=urlp.query.usn;
    
    if(req.cookies.user)
    {   
        if(usn)
       { res.cookie('user',usn,{maxAge:60*1000*8}); 
        
    
        
    
    var tot={name: ise[0].NAME,
        usn:ise[0].ME,
        me:ise[0].ME,
        cn:ise[0].CN,
        dbms:ise[0].DBMS,
        oomd:ise[0].OOAD,
        ai:ise[0].AL,
        atc:ise[0].ATC,
        cnt:ise[0].CNTUT,
        dbmst:ise[0].DBMSTUT,
        dbmsl:ise[0].DBMSLAB,
        cnl:ise[0].CNLAB,
        asd:ise[0].ASD}
    ;
    var stdData=stdModel.findOne({'usn':usn},{'_id':0,'v':0}).then(function(data){
       // console.log(data);
        if(data==null)
        {res.render('404',{error:"Wrong USN entered try again"});}
        else{
        
    res.render('attd',{d:[
        {"1":"AI","2":"ATC","3":"DBMS","4":"OOMD","5":"ME","6":"CN","day":"Monday"},
        {"1":"DBMS","2":"ASD","3":"ATC","4":"CN","5":"DBMS(T)","6":"OOMD","day":"Tuesday"},
        {"1":"ATC","2":"CN","3":"OOMD","4":"CN(T)","5":"ME","6":"AI","day":"Wednesday"},
        {"1":"ME","2":"AI","3":"DBMS","4":"CN","5":"LAB CN-1","6":"LAB DB-2","day":"Thursday"},
        {"1":"LAB CN-2","2":"LAB DB-1","3":"AI","4":"ME","5":"DBMS","6":"ATC","day":"Friday"}
        ],data,tot});
            
        }
        });
        }}
        else{
            res.render('404',{error:"enter the usn again session timed out"})
        }    

});

const ise[]; // holds the json attd data removed for privacy reasons

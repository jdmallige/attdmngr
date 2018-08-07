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
app.get('/',function(req,res){
    //console.log(req.cookies.user);
    
    res.render('home');
});

app.post('/',function(req,res){
    var usn=req.body.usn.toUpperCase();
    console.log(usn);
    if(usn)
    var stdData=stdModel.findOne({'usn':usn},{'_id':0,'v':0}).then(function(data){
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
//saving the records in db

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
    {name:'oomd',total:ise[0].OOMD},
    {name:'ai',total:ise[0].AI},
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

});

app.get('/bunk',function(req,res){
    
    res.render('bunk',{});
});

//predictor
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
        subModel.findOne({name:sub},{_id:0,_v:0}).then(function(data){
        total=data.total;
        total=parseInt(total);
        var a=parseInt(attended),n=parseInt(num),t=parseInt(totalw);
        // attended=parseInt(attended);
         var percent=(a+t-n)/(total+t)*100;
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

const ise=[
    {"ROLLNO":"main","NAME":"main","ME":"4","CN":"4","DBMS":"4","ATC":"4","CNTUT":"1","DBMSTUT":"1","ASD":"1","AL":"4","OOAD":"3","Batch":"1(1)/2(1)","CNLAB":"","DBMSLAB":""},
    {"ROLLNO":"1PE14IS086","NAME":"RUTHVIK V","ME":"25%(1)","CN":"100%(4)","DBMS":"50%(2)","ATC":"50%(2)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"50%(2)","OOAD":"-","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE15IS029","NAME":"CHINTAN D K","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"66%(2)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE15IS037","NAME":"GARVIT PATNI","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"0%(0)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE15IS052","NAME":"LOKESH","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE15IS070","NAME":"NITESH KALAL","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"66%(2)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE15IS098","NAME":"SHIVANG HARSH","ME":"75%(3)","CN":"100%(4)","DBMS":"50%(2)","ATC":"50%(2)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE15IS109","NAME":"TANISHA MUKHUPADHAYA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE15IS118","NAME":"VIDISH SRIVASTAVA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE15IS132","NAME":"RAJ PRATIM KALITA","ME":"100%(3/3)","CN":"100%(2/2)","DBMS":"100%(2/2)","ATC":"100%(2/2)","CNTUT":"100%(1/1)","DBMSTUT":"-%(-/-)","ASD":"-%(-/-)","AL":"100%(2/2)","OOAD":"100%(2/2)","Batch":"1","CNLAB":"100%(1/1)","DBMSLAB":"0%(0/1)"},
    {"ROLLNO":"1PE16IS001","NAME":"A ANUSHA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS003","NAME":"ABHILASH KULKARNI","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS004","NAME":"ABHINEET KUMAR SINGH","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"33%(1)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS005","NAME":"ABHISHEK AGARWAL","ME":"100%(4)","CN":"50%(2)","DBMS":"75%(3)","ATC":"75%(3)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"0%(0)","AL":"75%(3)","OOAD":"66%(2)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS006","NAME":"ABHISHEK SRIVASTAVA","ME":"25%(1)","CN":"0%(0)","DBMS":"0%(0)","ATC":"25%(1)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"33%(1)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS007","NAME":"ABHISHEK KUMAR JHA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS008","NAME":"ABHISHEK U AKKI","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS009","NAME":"ADITHYA L BHAT","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS010","NAME":"ADITI DUTTA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS012","NAME":"ADITYA SANTOSH G","ME":"100%(4)","CN":"100%(4)","DBMS":"75%(3)","ATC":"75%(3)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS013","NAME":"AKHIL UPADHYAY","ME":"75%(3)","CN":"75%(3)","DBMS":"75%(3)","ATC":"50%(2)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"66%(2)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS014","NAME":"AMAN SHARMA","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"0%(0)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS015","NAME":"AMAN SINGH","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS016","NAME":"ANJALI KUMARI","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"0%(0)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS017","NAME":"ANKIT KUMAR JAYSWAL","ME":"25%(1)","CN":"25%(1)","DBMS":"25%(1)","ATC":"25%(1)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"25%(1)","OOAD":"66%(2)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS018","NAME":"ANSHUL KUMAR JAIN","ME":"25%(1)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"33%(1)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS019","NAME":"ANWARBASHA A SHAIKH","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS020","NAME":"ARAVINDA V","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS021","NAME":"ARSHIYA ABDUL LATHEEF","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS022","NAME":"ASHUTOSH GAUR","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"0%(0)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS023","NAME":"AVANTIKA PANDEY","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS024","NAME":"AYUSH","ME":"75%(3)","CN":"100%(4)","DBMS":"75%(3)","ATC":"75%(3)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"66%(2)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS025","NAME":"B HARSHITHA","ME":"100%(4)","CN":"75%(3)","DBMS":"75%(3)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"66%(2)","Batch":"1","CNLAB":"0%(0)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS026","NAME":"BHAWINI KUMAR","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"1","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS027","NAME":"BINDU S","ME":"50%(2)","CN":"50%(2)","DBMS":"50%(2)","ATC":"50%(2)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"50%(2)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS028","NAME":"CHARAN N","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS031","NAME":"DEEPIKA M S","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS032","NAME":"DENZIL JOSTEVE FERNANDES","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS033","NAME":"DHAVAL VASANI","ME":"75%(3)","CN":"100%(4)","DBMS":"75%(3)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS034","NAME":"FAKHRUDDIN KUTBUDDIN NALAWALA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS035","NAME":"GOKUL VASUDEVA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS036","NAME":"HARDIK SAKHUJA","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"0%(0)","Batch":"2","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS037","NAME":"HARSH GUPTA","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"0%(0)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"0%(0)","Batch":"2","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS038","NAME":"HARSHA R","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS040","NAME":"HEMANTHA REDDY S","ME":"100%(4)","CN":"75%(3)","DBMS":"75%(3)","ATC":"75%(3)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"75%(3)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS041","NAME":"JAGADISH","ME":"75%(3)","CN":"75%(3)","DBMS":"75%(3)","ATC":"75%(3)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"75%(3)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS042","NAME":"KAJOL PATIRA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS043","NAME":"KANISHKAR P","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS044","NAME":"KARAN KUMBHANI","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS045","NAME":"KARTHIKEYAN P","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS046","NAME":"KASHISH BARNWAL","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS047","NAME":"KAVANA K","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS048","NAME":"KESHAV MITTAL","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS049","NAME":"KRUTHI K","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"0%(0)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"66%(2)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS050","NAME":"KUMAR AISHWARY","ME":"50%(2)","CN":"0%(0)","DBMS":"0%(0)","ATC":"25%(1)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"33%(1)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS051","NAME":"MANASA M HEGDE","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS052","NAME":"MANASA U HEGDE","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS053","NAME":"MANISH KUMAR","ME":"0%(0)","CN":"0%(0)","DBMS":"0%(0)","ATC":"25%(1)","CNTUT":"0%(0)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"0%(0)","Batch":"2","CNLAB":"0%(0)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS054","NAME":"MANOJ M G","ME":"75%(3)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"75%(3)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS056","NAME":"MD NASEEM","ME":"25%(1)","CN":"0%(0)","DBMS":"0%(0)","ATC":"50%(2)","CNTUT":"100%(1)","DBMSTUT":"0%(0)","ASD":"0%(0)","AL":"0%(0)","OOAD":"33%(1)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"0%(0)"},
    {"ROLLNO":"1PE16IS057","NAME":"MICHELLE VIVITA","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS058","NAME":"MIHIR CHHATRE","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"75%(3)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS060","NAME":"MUDIT NIGAM","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS061","NAME":"N SANTOSH GOKUL","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS062","NAME":"NAAZNEEN AHMED","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS101","NAME":"THARANATH RAI MITHRAMPADY","ME":"100%(4)","CN":"100%(4)","DBMS":"100%(4)","ATC":"100%(4)","CNTUT":"100%(1)","DBMSTUT":"100%(1)","ASD":"100%(1)","AL":"100%(4)","OOAD":"100%(3)","Batch":"2","CNLAB":"100%(1)","DBMSLAB":"100%(1)"},
    {"ROLLNO":"1PE16IS403","NAME":"BHARATH N","ME":"100%(3/3)","CN":"100%(2/2)","DBMS":"100%(2/2)","ATC":"100%(2/2)","CNTUT":"100%(1/1)","DBMSTUT":"-%(-/-)","ASD":"-%(-/-)","AL":"100%(2/2)","OOAD":"100%(2/2)","Batch":"1","CNLAB":"100%(1/1)","DBMSLAB":"100%(1/1)"}
    ];


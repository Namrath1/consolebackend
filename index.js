import express  from 'express';
import mongoose from 'mongoose';
import data from './gain.js';
import cors  from 'cors';




  const mongoUrl = `mongodb+srv://namrath1:namrath1@cluster0.rwwiyus.mongodb.net/console`
  mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(()=>console.log("Connected Succesfully"))
  .catch((err)=>console.log(err))

const reportSchema = {
    Date: String,
    ScripName:String,
    Quantity:Number,
    Profit:Number,
    BuyAmt:Number,
    SellAmt:Number,
}
const Report = new mongoose.model("Fy2024", reportSchema);

let app = express();

app.use(express.json());
app.use(cors())

app.get("/getreport",(req,res)=>{
    Report.find({}).then((resp)=>{
        console.log(resp);
        res.json(resp)
    }
    ).catch((err)=>console.log(err))
})

app.post("/landingpage",(req,res)=>{
    let date = req.body.date
    let symbol = req.body.symbol
    let profit = req.body.profit

    const Reports = new Report({
       Date:date,
       Symbol:symbol,
       Profit:profit,
    })

    Reports.save().then(doc => res.status(200).json({ message: doc }));
})

app.post("/getselected",(req,res)=>{
    let date = req.body.isActivated
    Report.find({Date:date})
    .then((resp)=>res.send(resp))
    .catch((err)=>console.log(err))
    
    
})

app.get("/getsummary",(req,res)=>{
    
    let sum=0;
    let charges=0;
    let net = 0;
    for (let index = 0; index < data.length; index++) {
        sum+=data[index].Profit
        charges+=(data[index].Charges+data[index].STTCTT)
        
    }
    net = (sum-charges)
    res.json({sum,charges,net})
})

app.get("/getdata",(req,res)=>{
    Report.find({}).then((resp)=>{
        console.log(resp);
        res.json(resp)
    }
    ).catch((err)=>console.log(err))
})

app.post("/newentry",(req,res)=>{
    let date = req.body.Date
    let symbol = req.body.Symbol
    let profit = req.body.Profit
    let qty = req.body.Quantity
    let bprice = req.body.BuyingPrice*qty
    let sprice = req.body.SellingPrice*qty
    console.log(sprice);
    
    const Reports = new Report({
        Date:date,
        ScripName:symbol,
        Quantity:qty,
        Profit:profit,
        BuyAmt:bprice,
        SellAmt:sprice,
    })

    insertIfNotExist(Reports)

    async function insertIfNotExist(document) {
        try {
            
            const existingDocument = await Report.findOne({ Date: document.Date });
    
            if (existingDocument) {
                console.log("Document already exists:", existingDocument);
                res.json({message:"Entered Date already exists"})
            } else {
                // Document doesn't exist, so insert it
                Reports.save().then(doc => res.status(200).json({ message: doc }));
                
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
   


})

app.listen(3000 || process.env.PORT, function () {
    console.log("Server started on port 3000");
});

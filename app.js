const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
var _ = require('lodash');
var http = require('http');
var pdf = require('html-pdf');

let mainInf = "";
let counter = 0;
let group = [];
let sum = 0;
let rating = [];
let simple = 0;
let diff = [];
let maxFirst = [0.5, 0.4, 0.5, 0.2, 0.2, 0.4, 0.3]
let maxSecond = [0.2, 0.2, 0.4, 0.1, 0.2, 0.1, 0.4, 0.2, 0.2, 0.3, 0.2, 0.3]
let method = ""

function summary(arr) {
    sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

function sumObj1(obj) {
    sum = 0;
    for (let i = 0; i < Object.keys(obj).length; i++) {
        if (i < 7) {
            sum += Number(Object.values(obj)[i])
        }
    }
    return sum;
}

let sum1 = 0;
function sumObj2(obj) {
    sum1 = 0;
    for (let i = 0; i < Object.keys(obj).length; i++) {
        if (i > 7) {
            sum1 += Number(Object.values(obj)[i])
        }
    }
    return sum1;
}

function reckonlev(data) {
    if(Number(data.expertLev)===7){
        data.expertLev = 8;
    } else if (Number(data.expertLev)===8){
        data.expertLev = 10;
    }
    data.expOverall = parseFloat(((((Number(data.expertExp) + Number(data.expertPub) + Number(data.expertLev)) / 10 + Number(data.expertMar) + Number(data.expertS)) / 5) * Number(data.radioLev)).toFixed(4))
    data.expGenCon = 0;
    sum += data.expOverall;

    return data;
}

function reckonLevSimple(data) {
    if(Number(data.expertLev)===7){
        data.expertLev = 8;
    } else if (Number(data.expertLev)===8){
        data.expertLev = 10;
    }
    data.expOverall = parseFloat(((((Number(data.expertExp) + Number(data.expertPub) + Number(data.expertLev)) / 10 + Number(data.expertMar)) / 4) * Number(data.radioLev)).toFixed(4))
    data.expGenCon = 0;
    sum += data.expOverall;

    return data;
}

function contribution() {
    for (let i = 0; i < group.length; i++) {
        group[i].expGenCon = parseFloat((group[i].expOverall / sum).toFixed(4))
    }
    sum = 0;
}

function findDiff() {
    let j = 0;
    diff = []
    for (let i = 0; i < Object.keys(rating[0]).length; i++) {
        if (Object.values(rating[j])[i] !== Object.values(rating[j + 1])[i] || Object.values(rating[j])[i] !== Object.values(rating[j + 2])[i]) {
            if(diff.includes(i)){
                continue;
            } else {
                diff.push(i)
            }
            
        }
    }
}

let finalResult;
let qualityResult;
let credE;
let secondCred;
let thirdCred;
let firstExp;
let secondExp;
let thirdExp;

let firstExpC;
let secondExpC;
let thirdExpC;

function quality(result) {
    if (result >= 0.01 && result < 0.15) {
        qualityResult = "Інформація майже напевно недостовірна";
    } else if (result >= 0.15 && result < 0.4) {
        qualityResult = "Вірогідно, інформація недостовірна";

    } else if (result >= 0.4 && result < 0.6) {
        qualityResult = "Шанси приблизно однакові";

    } else if (result >= 0.6 && result < 0.85) {
        qualityResult = "Вірогідно, інформація достовірна";

    } else if (result >= 0.85 && result <= 0.99) {
        qualityResult = "Інформація майже напевно достовірна";
    }
}
let first = 0;
let second = 0;
let firstM = 0;
let secondM = 0;
let creds = [];
function credArr(){
    for (let t = 0; t < 3; t++) {
        first = sumObj1(rating[t]);
        second = sumObj2(rating[t]);
        credE = (first / firstM + second / secondM) / 2;
        credE = parseFloat((credE).toFixed(5))
        creds.push(credE)
    }
}
function expAssign() {
    if (simple != 1) {
        firstExp = Object.values(group[0])[8]
        secondExp = Object.values(group[1])[8]
        thirdExp = Object.values(group[2])[8]

        firstExpC = Object.values(group[0])[9]
        secondExpC = Object.values(group[1])[9]
        thirdExpC = Object.values(group[2])[9]
    } else {
        firstExp = Object.values(group[0])[7]
        secondExp = Object.values(group[1])[7]
        thirdExp = Object.values(group[2])[7]

        firstExpC = Object.values(group[0])[8]
        secondExpC = Object.values(group[1])[8]
        thirdExpC = Object.values(group[2])[8]
    }
}

function calcRes() {
    credArr()
    expAssign()
    finalResult = firstExpC * creds[0] + secondExpC * creds[1] + thirdExpC * creds[2];
    finalResult = parseFloat((finalResult).toFixed(5))
    quality(finalResult)
}

const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
})

app.post("/", (req, res) => {
    mainInf = req.body.mainInf;
    res.render("choseMethod", { mainInf: mainInf });
})

app.get("/docs", (req, res) => {
    res.render("docs");
})

app.get("/download", (req, res) => {
    var html = 'html';
    pdf.create(html).toStream((err, stream) => {

        if (err) {
    
          console.error(err);
          res.status(500);
          res.end(JSON.stringify(err));
    
          return;
        }
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Algoritm.pdf;');
    
        stream.pipe(res);
    });
})

app.get("/contact", (req, res) => {
    res.render("contact");
})

app.get("/standart", (req, res) => {
    res.render("standart");
    method = "Звичайний метод";
})

app.get("/simple", (req, res) => {
    res.render("simple", { mainInf: mainInf });
    method = "Спрощений метод";

})

app.post("/standart", (req, res) => {
    
    group[counter] = reckonlev(req.body)
    counter++;
    simple = 0
    if (counter == 3) {
        contribution();
        counter = 0;
        sum = 0;

        res.redirect("/expert-results")
    }
})

app.post("/simple", (req, res) => {
    group[counter] = reckonLevSimple(req.body)
    counter++;

    if (counter == 3) {
        simple = 1;
        contribution();
        counter = 0;
        sum = 0;
        res.redirect("/expert-results")
    }
})


app.get("/assessment", (req, res) => {
    res.render("assessment", { mainInf: mainInf, method:method})
})

app.post("/assessment", (req, res) => {

    rating[counter] = req.body
    counter++;
    if (counter === 3) {
        findDiff();
    }
    if (counter === 3 && simple === 0 && Array.isArray(diff) && diff.length) {
        
        res.redirect("/argumentation")
        counter = 0;
    } else if (counter === 3) {
        counter = 0;
  
        res.redirect("/results")
    }
})

app.get("/argumentation", (req, res) => {
    res.render("argumentation", { mainInf: mainInf })

})

let i = 0;
let argum = [];



app.post("/argumentation", (req, res) => {
    argum[i] = req.body
    i++;
    if (i == 3) {
        res.redirect("/secondAssess")
        i = 0;
    }
})

app.get("/secondAssess", (req, res) => {
    res.render("secondAssess", { mainInf: mainInf })
})

let change = {};

let obj = {}
let j = 0;
app.post("/secondAssess", (req, res) => {
    change = req.body;

    _.merge(rating[j], change)

    j++;
    if (j == 3) {
        res.redirect("/results")
        j = 0;
    }
})

app.get("/results", (req, res) => {
    firstM = summary(maxFirst);
    secondM = summary(maxSecond);
    calcRes()
    console.log("Виконано розрахунок!")
    res.render("results", { mainInf: mainInf, finalResult: finalResult, qualityResult: qualityResult, firstCred : creds[0], secondCred: creds[1], thirdCred: creds[2], firstExp: firstExp, secondExp: secondExp, thirdExp: thirdExp, method:method });
    creds = []
    sum = 0;
})

app.get('/diff', function (req, res) {
    res.json(diff);
});

app.get("/expert-results", (req, res) => {
    res.render("expertsRes")

})


app.get('/api', function (req, res) {
    res.json(group);
});

app.get('/argum', function (req, res) {

    res.json(argum);
});



app.listen(3000, () => {
    console.log("Listen on port 3000..")
})



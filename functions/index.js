const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');
const { use } = require("express/lib/router");
admin.initializeApp()



app.get('/', function (req, res) {
    res.json({ "name": "Raghul" })
})

app.post('/', async (req, res) => {
    const usr = []
    const user = req.body.username

    let checkUser = (await admin.firestore().collection('users').where("username", "==", user).get())

    if (checkUser.docs.length > 0) {
        for (let user2 of checkUser.docs) {
            usr.push(user2.data())
        }
        if (usr[0].password == req.body.password && usr[0].username == req.body.username) {
            res.status(200).json({ "code": "200", username: user, login: "success" })
        } else {
            res.status(401).json({ code: "401", message: "unauthorized" })
        }
        // res.send({ login: "successs" })
    } else {
        return res.status(401).json({ code: "401", message: "unauthorized" })
    }
})


app.post('/createcustomer', async (req, res) => {
    const creation = req.body
    if (!req.body) {
        return res.status(404).json({ code: "401", "message": "demo" })
    }
    await admin.firestore().collection('customer').add(creation)
    return res.json({ code: 201, message: "success" })
})

app.post('/createstaff', async (req, res) => {
    const creation = req.body
    if (!req.body) {
        return res.status(404).json({ code: "401", "message": "invalid request" })
    }
    await admin.firestore().collection('staff').add(creation)
    return res.status(201).json({ code: 201, message: "success" })
})

app.get('/customerdetails', async (req, res) => {
    let usr = []
    if (!req.body) {
        return res.status(404).json({ code: "401", "message": "invalid request" })
    }
    let customerDetails = await admin.firestore().collection('customer').get()
    if (customerDetails.docs.length > 0) {
        for (const user of customerDetails.docs) {
            usr.push(user.data())
            console.log(user.data())

        }
    }
    return res.json(usr)

})

app.get('/staffdetails', async (req, res) => {
    let usr = []
    if (!req.body) {
        return res.status(404).json({ code: "401", "message": "invalid request" })
    }
    let customerDetails = await admin.firestore().collection('staff').get()
    if (customerDetails.docs.length > 0) {
        for (const user of customerDetails.docs) {
            usr.push(user.data())
            console.log(user.data())

        }
    }
    return res.json(usr)

})


exports.user = functions.https.onRequest(app);
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

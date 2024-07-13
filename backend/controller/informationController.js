const informationModel = require("../model/informationModel")
// const { getEmailData } = require("../getEmails2")

module.exports.getInformations = async (req, res) => {
    const info = await informationModel.find()
    console.log(info)
    res.send(info)
}

module.exports.saveInformations = async (req, res) => {

    const objectInformation = req.body

    informationModel.create(objectInformation)
    .then((data) => {
        console.log("Saved Successfully...");
        res.status(201).send(data)
    }).catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something went wrong!"})
    })
}

module.exports.updateInformations = async (req, res) => {

    const {id} = req.params
    const objectInformation = req.body
    // const { name } = req.body

    informationModel.findByIdAndUpdate(id, objectInformation)
    .then(() => res.send("Updated successfully"))
    .catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something went wrong!"})
    })
}

module.exports.deleteInformations = async (req, res) => {

    const {id} = req.params

    informationModel.findByIdAndDelete(id)
    .then(() => res.send("Deleted successfully"))
    .catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something went wrong!"})
    })
}
const {Router} = require("express")

const { 
    getInformations, 
    saveInformations, 
    updateInformations, 
    deleteInformations 
} = require("../controller/informationController")

const router = Router();

router.get("/get", getInformations);
router.post("/save", saveInformations);
router.put("/update/:id", updateInformations);
router.delete("/delete/:id", deleteInformations);

module.exports = router;
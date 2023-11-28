const express = require("express");
const Experience = require("../models/experience");
const years = require("../utils/years");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/experience", verifyToken, async (req, res) => {
    const experiences = await Experience.find(); // Fetch experiences

    var yearsList = years;

    res.render("experience", {
        title: "Experience",
        years: yearsList,
        experiences: experiences,
        formData: '',
        errors: '',
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
    });
});

router.post("/experience", (req, res) => {
    const experience = new Experience({
        position: req.body.position,
        employeer: req.body.employeer,
        address: req.body.address,
        from: req.body.from,
        to: req.body.to,
        description: req.body.description
    });

    experience.save()
        .then(savedInstance => {
            req.session.message = {
                type: 'success',
                message: 'experience addedd successfully'
            };

            res.redirect('/experience');
        })
        .catch(async (err) => {
            //res.json({ message: err.message, type: 'danger' })
            var yearsList = years;
            const experiences = await Experience.find();
            res.render('experience', {
                errors: err.errors, // Assuming your error object has an 'errors' property
                formData: req.body, // Pass the form data back to the view
                years: yearsList,
                experiences: experiences,
                isAuthenticated: req.session.isAuthenticated,
                userRoles: req.session.userRoles,
            });
        });
});

module.exports = router;
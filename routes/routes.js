const express = require("express");
const Education = require("../models/education");
const Experience = require("../models/experience");
const years = require("../utils/years");
const upload = require("../middleware/upload");
const cv = require("../models/cv");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", (req, res) => {
    //res.send("Home");
    const kk = req.session.isAuthenticated;
    res.render("index", {
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
        title: "Home Page"
    })
});

router.get("/resume", async (req, res) => {

    const educations = await Education.find(); // Fetch educations
    const experiences = await Experience.find(); // Fetch experiences

    res.render("resume", {
        title: "Resume",
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
        educations: educations,
        experiences: experiences // Sending both educations and experiences to the EJS template
    });
});

router.get("/project", (req, res) => {
    res.render("project", {
        title: "Project Page",
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
    })
});

router.get("/education", verifyToken, (req, res) => {
    var yearsList = years;
    Education.find()
        .then(educations => {
            res.render("education", {
                title: "Education",
                years: yearsList,
                educations: educations,
                isAuthenticated: req.session.isAuthenticated,
                userRoles: req.session.userRoles,
            });
        })
        .catch(err => {
            res.json({ message: err.message });

            res.render("education", {
                title: "Education",
                message: err.message,
                isAuthenticated: req.session.isAuthenticated,
                userRoles: req.session.userRoles,
            });
        });
});

router.post("/education", (req, res) => {
    const education = new Education({
        qualification: req.body.qualification,
        department: req.body.department,
        school: req.body.school,
        from: req.body.from,
        to: req.body.to,
        address: req.body.address,
        description: req.body.description
    });

    education.save()
        .then(savedInstance => {
            req.session.message = {
                type: 'success',
                message: 'user addedd successfully'
            };

            res.redirect('/education');
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' })
        });
});

router.post('/upload_cv', verifyToken, upload.single('myCv'), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Fetch existing file paths associated with the table
        const existingFiles = await cv.find({}); // Replace 'YourModel' with your actual Mongoose model name

        // // Delete existing files from the file system
        // existingFiles.forEach(async (file) => {
        //     const existingFilePath = path.join(__dirname, file.filePath);
        //     //fs.unlinkSync(existingFilePath);

        //     fs.access(existingFilePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
        //         if (err) {
        //             console.error('File does not exist or cannot be accessed.');
        //             return;
        //         }

        //         // Check if the file is writable
        //         fs.access(existingFilePath, fs.constants.W_OK, (accessErr) => {
        //             if (accessErr) {
        //                 // If not writable, change file permissions to read and write for the owner
        //                 fs.chmod(existingFilePath, 0o600, (chmodErr) => {
        //                     if (chmodErr) {
        //                         console.error('Error changing file permissions:', chmodErr);
        //                         return;
        //                     }
        //                     console.log('File permissions changed successfully.');

        //                     // Delete the file after permissions are set
        //                     fs.unlink(existingFilePath, (unlinkErr) => {
        //                         if (unlinkErr) {
        //                             console.error('Error deleting file:', unlinkErr);
        //                             return;
        //                         }
        //                         console.log('File deleted successfully.');
        //                     });
        //                 });
        //             } else {
        //                 // File is already writable, directly delete the file
        //                 fs.unlink(existingFilePath, (unlinkErr) => {
        //                     if (unlinkErr) {
        //                         console.error('Error deleting file:', unlinkErr);
        //                         return;
        //                     }
        //                     console.log('File deleted successfully.');
        //                 });
        //             }
        //         });
        //     });

        // });

        // Update the database with the new file path
        await cv.deleteMany({}); // Delete all existing records
        await cv.create({ filePath }); // Create a new record with the new file path

        req.session.message = {
            type: 'success',
            message: 'File uploaded successfully'
        };

        res.redirect('/resume');
        //res.send('File uploaded and document created successfully.');
    } catch (err) {
        //res.status(500).send('Error uploading file: ' + err.message);

        res.render("resume", {
            title: "Resume",
            message: 'Error uploading file: ' + err.message,
            isAuthenticated: req.session.isAuthenticated,
            userRoles: req.session.userRoles,
        });
    }
});

router.get('/download', async (req, res) => {
    try {
        // Find the user document with the file path
        const myc = await cv.findOne(); // Add conditions to find a specific user if needed

        if (!myc) {
            //return res.status(404).send('cv not found');

            res.render("resume", {
                title: "Resume",
                message: 'Cv not found',
                isAuthenticated: req.session.isAuthenticated,
                userRoles: req.session.userRoles,
            });
        }

        const filePath = myc.filePath;

        // Send the file for download
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                //res.status(404).send('File not found');

                res.render("resume", {
                    title: "Resume",
                    message: 'File not found',
                    isAuthenticated: req.session.isAuthenticated,
                    userRoles: req.session.userRoles,
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Internal Server Error');

        res.render("resume", {
            title: "Resume",
            message: 'Internal Server Error',
            isAuthenticated: req.session.isAuthenticated,
            userRoles: req.session.userRoles,
        });
    }
});

module.exports = router;
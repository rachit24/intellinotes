const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchUser');

//ROUTE 1: Get All Notes GET: "/api/notes/fetchallnotes".Login required
router.get('/fetchallnotes',fetchuser , async (req,res)=>{
    try{
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured!");
    }
});

//ROUTE 2: Add a new Note POST: "/api/notes/addnote".Login required
router.post('/addnote',fetchuser ,[
    body('title','Enter a valid title ').isLength({min:3}),
    body('description','Must be atleast 5 characters').isLength({min:5}),
], async (req,res)=>{

    try{
        const {title,description,tag} = req.body;
        const errors = validationResult(req);
        //If errors, return Bad Request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title,description,tag,user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured!");
    }
});

//ROUTE 3: Update an Existing Note PUT: "/api/notes/updatenote". Login required
router.put('/updatenote/:id',fetchuser ,async (req,res)=>{
    try {
        const {title, description, tag} = req.body;
        //Create a new note
        const newNote = {};
        if(title){newNote.title = title;}
        if(description){newNote.description = description;}
        if(tag){newNote.tag = tag;}

        //Finding the note to be updated
        let note = await Note.findById(req.params.id);
        if(!note){res.status(404).send("Not Found")}
        //Verify the User
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({newNote});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured!");
    }
})

//ROUTE 4: Delete Note DELETE: "/api/notes/deletenote". Login required
router.delete('/deletenote/:id',fetchuser ,async (req,res)=>{
    try {
        //Finding the note to be deleted
        let note = await Note.findById(req.params.id);
        if(!note){res.status(404).send("Not Found")}

        //Verify the User
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been Deleted", note:note});   
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured!");
    }
})

module.exports = router;
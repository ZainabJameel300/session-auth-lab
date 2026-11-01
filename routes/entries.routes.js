const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const Entry = require('../models/Entry')

router.get('/new',isSignedIn,(req,res)=>{
    res.render('create-entry.ejs')
})

router.post('/new',isSignedIn, async (req,res)=>{
    
 req.body.isPublic = req.body.isPublic === 'on'
 const newEntry = await Entry.create({
    title: req.body.title,
    entryBody: req.body.entryBody,
    isPublic : req.body.isPublic,
    owner: req.session.user._id
 })
 res.redirect('/entries')
})

router.get('/',isSignedIn, async(req,res)=>{
    const allEntries = await Entry.find({isPublic:true})
    res.render('all-entries.ejs',{entry:allEntries})
})

router.get('/my-entries',isSignedIn,async(req,res)=>{
    const myEntries = await Entry.find({owner: req.session.user._id})
    res.render('my-entries.ejs',{entry:myEntries})
})

router.get('/:entryid/edit', async (req,res)=>{
    const foundEntry = await Entry.findById(req.params.entryid)
    res.render('edit-entry.ejs',{entry: foundEntry})
})

router.put('/:entryid', async (req,res)=>{
    req.body.isPublic = req.body.isPublic === 'on' // converts the isReadyToEat to a Boolean

    const updatedEntry = await Entry.findByIdAndUpdate(req.params.entryid, req.body)
    
    res.redirect('/entries')
})


module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");
const wikiSchema = {
  title: String,
  content:String
}
const wikiItem = mongoose.model("topic", wikiSchema);
app.listen(3000,function(){
  console.log("Server is fired up");
});
app.route("/articles")
.get(function(req,res){
  wikiItem.find({},function(err,found){
    const item=found;
    console.log(item);
    if(!err){
      res.send(found);
    }else{
      res.send(err);
    }
  });
})
.post(function(req,res){
  const newArticle=new wikiItem({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save();
})
.delete(function(req,res){
  wikiItem.deleteMany(function(err){
    if(!err){
      console.log("successfully deleted");
    }
  });
});
app.route("/articles/:userArticle")
.get(function(req,res){
  wikiItem.findOne({title:req.params.userArticle},function(err,found){
    if(found){
      res.send(found);
    }else{
      res.send("not found");
    }
  })
})
.put(function(req,res){
  wikiItem.update({title:req.params.userArticle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
    if(!err){
      res.send("updated successfully");
    }else{
      res.send(err);
    }
  })
})
.patch(function(req,res){
  wikiItem.update({title:req.params.userArticle},{$set:req.body},function(err){
    if(!err){
      res.send("update successful");
    }
  });
})
.delete(function(req,res){
  wikiItem.deleteOne({title:req.params.userArticle},function(err){
    if(!err){
      res.send("deleted successful");
    }
  })
});

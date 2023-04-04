const exp = require("express");
const app = exp();
const date = require(__dirname + "/date.cjs");
//requiring a module that is stored locally in the same folder.
// console.log(date);
// this console logs whatever object is exported from the module stored in it.

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); //important code for ejs.
//this line of code tells our app to use ejs as our view engine.

app.use(exp.static("public")); //this is to include all the static files such as the css and the js in the webpage
//from the public folder

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://rakesh:Rakesh2001@cluster0.wwa1wrm.mongodb.net/todoListDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const newItem = mongoose.model("Item", itemsSchema);

const item1 = new newItem({
  name: "Buy Groceries",
});
const item2 = new newItem({
  name: "Cook Food",
});
const item3 = new newItem({
  name: "Eat Food",
});
const defaultItems = [item1, item2, item3];

let day= date.getDate();
app.get("/", function (req, res) {
  var today =
    new Date(); /*it is used to get the current day using a js objects just like we did with 
  playing audios*/

  let k1;
  if (today.getDay() == 0 || today.getDay() == 6) {
    //getDay gets the day no. in num, 0 for sunday and 6 for sat
    k1 = "Weekend";
  } else {
    k1 = "Weekday";
  }
  
  newItem.find()
    .then((item) => {
      // console.log(item);
      if (item.length === 0) {
        newItem.insertMany(defaultItems)
          //the insertMany function is expecting an array to store it in the db.
          .then(function () {
            console.log("Successfully saved default items to DB"); //this function is it insert many goes as it
            //is supposed to
          })
          .catch(function (err) {
            console.log(err); //this catches the error that occurs if the insertion did not take place as it is supposed to
          });
        res.redirect("/");
      }
      else{
        res.render("list", { listTitle: day, newItems: item });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //adding more than one items to render in the ejs page. we seperate them by using ,
});

app.post("/", function (req, res) {
  let newListItem = req.body.newItem;
  let listTitle=req.body.list;

  const enteredItem=new newItem({
    name:newListItem,
  });

  if (listTitle === day) {
    
    // console.log(enteredItem);
      enteredItem.save();
    res.redirect("/"); //we are redirecting the page after we click the cubmit button to our home route.

  } 
  else {
    customList.findOne({name:listTitle})
    .then((foundList)=>{
      foundList.items.push(enteredItem);
      foundList.save();
      res.redirect("/"+listTitle);
    })
  }
});


const listSchema=new mongoose.Schema({
  name:String,
  items:[itemsSchema]
})
const customList=new mongoose.model("customList",listSchema);

app.get("/:listTitle", (req, res)=>{
  let listTitle=req.params.listTitle;
  listTitle=listTitle.toUpperCase();

  customList.findOne({name:listTitle})
  .then((foundList)=>{
    if(!foundList){//this means ki list does not exists so we need to create a new list
      //create list
      const list=new customList({
        name:listTitle,
        items:defaultItems
      })
      list.save();
      console.log("item saved in db");
      res.redirect("/"+listTitle);
    }
    else{// this means ki list exists so we need to show the already created list
      res.render("list", { listTitle: foundList.name, newItems: foundList.items });
    }
    
    
  })
  .catch((err)=>{
    console.log(err);
  }) 
});


app.post("/delete",(req,res)=>{
  // console.log(req.body);
  const listName=req.body.listName;
  const id=req.body.checkbox;
  if(listName===day){
    newItem.deleteOne({_id:id})
  .then(()=>{
    console.log("Deleted");
    res.redirect("/");
  })
  .catch(err =>{
    console.log(err);
  })
  }
  else{
    customList.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}})
    //pull from an items array that can be identified using id for _id
    .then((foundList)=>{
      res.redirect("/"+listName);
    })
    .catch(err=>{
      console.log(err);
    })
  }
})

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen("3300", function (req, res) {
  console.log("Server running on port 3300.");
});

//exports is a shortcut for module.exports

//module.exports is a js object so we can store multiple things in it like this
// console.log(module);

exports.getDate=function() {//another way of declaring object is objects.function_name=anonymous_functino(){}
  var today = new Date();
  /*it is used to get the current day using a js objects just like we did with 
    playing audios*/

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };//contains what all is to be printed in the date thing and their data types.

  let day = today.toLocaleDateString("en-US", options);
  //this gives the day in english with us as the local location.  hi-IN will give it in hindi


  return day;
}

// module.exports.getDay=getDay;

exports.getDay=function() {
    var today = new Date();
  
    let options = {
      weekday: "long"
    }
  
    let day = today.toLocaleDateString("en-US", options);
    return day;
  }

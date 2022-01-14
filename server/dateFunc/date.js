

module.exports.getDateAndTime = function() {
  let options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  let today = new Date(); //Defaults to today

  return today.toLocaleDateString("en-US", options);;
}

module.exports.getDay = function() {
  let options = {
    weekday: "long",
  };

  let today = new Date(); //Defaults to today

  return today.toLocaleDateString("en-US", options);;
}

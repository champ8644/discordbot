const { format } = require("date-fns");

console.log("Node daily runs at", format(new Date(), "eee d MMMM yyyy, H:mm"));

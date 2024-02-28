// Define your functions
function time() {
  console.log(new Date());
}

function greet() {
  console.log("Hello!");
}

// Create a map of function names to their corresponding functions
var functionMap = {
  time: time,
  greet: greet,
};

// Define your JSON object
var json = {
  function: "time",
};

// Parse the JSON object and call the function by its name
var functionName = json.function;
if (
  functionMap.hasOwnProperty(functionName) &&
  typeof functionMap[functionName] === "function"
) {
  functionMap[functionName](); // Call the function by name
} else {
  console.log("Function " + functionName + " not found.");
}

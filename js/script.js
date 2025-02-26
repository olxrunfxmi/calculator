// GLOBAL VARIABLES
let operation_array = [];
let tracker = "0";
let typed = false;
let isDisabled = false;

// DOM REFERENCES
const operationBar = document.querySelector("#operation");
const outputBar = document.querySelector("#output");
const buttons = document.querySelectorAll("button");
const visualTracker = document.querySelector("#visual_bar");
const historyFrame = document.querySelector("ul.history_frame");

// SET CALCULATOR
operationBar.textContent = operation_array.join(" ");
outputBar.textContent = tracker;

// PROCESS
buttons.forEach((button) => {
	button.addEventListener("click", () => {
		if (isNumber(button.id)) {
			updateVisualTracker(button.id);
			executeNumberPress(button.id);
			updateOutputScreen();
		} else if (isOperationKey(button.id)) {
			updateVisualTracker(button.id);
			executeOperationKeys(button.textContent);
			updateOutputScreen();
		} else if (button.id === "AC") {
			updateVisualTracker(button.id);
			executeAC();
			updateOutputScreen();
		} else if (button.id === "plusMinus") {
			updateVisualTracker(button.id);
			executePlusMinus();
			updateOutputScreen();
		} else if (button.id === "clear") {
			updateVisualTracker(button.id);
			executeClear();
			updateOutputScreen();
		} else if (button.id === "decimal") {
			updateVisualTracker(button.id);
			addDecimal();
			updateOutputScreen();
		} else if (button.id === "equals") {
			updateVisualTracker(button.id);
			executeCalculation();
			updateOutputScreen();
		}
	});
});

// Keyboard Event
// document.addEventListener("keydown", (e) => {

// });

// FUNCTIONS
function isNumber(value) {
	const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	return numbers.includes(value);
}

function isOperationKey(value) {
	const operationKeys = ["percent", "divide", "multiply", "subtract", "add"];
	return operationKeys.includes(value);
}

function executeNumberPress(value) {
	typed = true;
	if (tracker === "Infinity" || tracker === "NaN") return;
	if (value === "0" && tracker === "0") return;
	if (value !== "0" && tracker === "0") {
		tracker = value;
	} else {
		tracker += value;
	}
}

function executeAC() {
	tracker = "0";
	typed = false;
	operation_array = [];
	if (isDisabled) {
		ableCalc();
	}
}

function executePlusMinus() {
	if (tracker === "0") return;
	if (tracker[0] === "-") {
		tracker = tracker.slice(1, tracker.length);
	} else if (tracker[0] !== "-") {
		tracker = "-" + tracker;
	}
}

function executeOperationKeys(key) {
	if (operation_array.length !== 0 && typed === false && tracker === "0") {
		operation_array[1] = key;
		return;
	}

	if (operation_array.length === 3) {
		operation_array = [];
		operation_array.push(tracker);
		operation_array.push(key);
		tracker = "0";
		typed = false;
		return;
	}

	operation_array.push(tracker);
	if (operation_array.length === 3) {
		const result = operate(operation_array);
		const temp_array = operation_array;
		operation_array = [];
		operation_array.push(result);
		tracker = result;
		addCalcHistory(temp_array, tracker);
		if (tracker == "NaN") {
			disableCalc();
			isDisabled = true;
		}
	}
	operation_array.push(key);
	tracker = "0";
	typed = false;
}

function executeClear() {
	if (tracker === "Infinity" || tracker === "NaN") return;
	if (tracker.length !== 1) {
		tracker = tracker.slice(0, tracker.length - 1);
	} else if (tracker.length === 1) {
		tracker = "0";
		typed = false;
	}
}

function executeCalculation() {
	if (operation_array.length === 2) {
		operation_array.push(tracker);
		const result = operate(operation_array);
		tracker = String(result);
		addCalcHistory(operation_array, tracker);
		if (tracker == "NaN") {
			disableCalc();
			isDisabled = true;
		}
	}
}

function addDecimal() {
	if (tracker === "Infinity" || tracker === "NaN") return;
	if (typeof tracker === "string" && !tracker.includes(".")) {
		tracker = tracker + ".";
	}
}

function updateOutputScreen() {
	outputBar.textContent = tracker;
	operationBar.textContent = operation_array.join(" ");
}

function updateVisualTracker(operation) {
	switch (operation) {
		case "clear":
			visualTracker.textContent = "Backspace ←";
			visualTracker.style.color = "#A9FF29";
			break;
		case "divide":
			visualTracker.textContent = "Division /";
			visualTracker.style.color = "#FFD429";
			break;
		case "multiply":
			visualTracker.textContent = "Multiplication *";
			visualTracker.style.color = "#FF6629";
			break;
		case "subtract":
			visualTracker.textContent = "Subtraction -";
			visualTracker.style.color = "#FF3729";
			break;
		case "add":
			visualTracker.textContent = "Addition +";
			visualTracker.style.color = "#03CE3C";
			break;
		case "percent":
			visualTracker.textContent = "Percentage %";
			visualTracker.style.color = "#29A6FF";
			break;
		case "equals":
			visualTracker.textContent = "Solve [~/]";
			visualTracker.style.color = "#FF29AD";
			break;
		default:
			visualTracker.textContent = "Blank_";
			visualTracker.style.color = "#E8E8E8";
			break;
	}
}

function operate(operation_array) {
	const operation = operation_array[1];
	const firstNum = Number(operation_array[0]);
	const secondNum = Number(operation_array[2]);

	switch (operation) {
		case "+":
			return add(firstNum, secondNum);
			break;
		case "-":
			return subtract(firstNum, secondNum);
			break;
		case "*":
			return multiply(firstNum, secondNum);
			break;
		case "÷":
			return divide(firstNum, secondNum);
			break;
		case "%":
			return percentage(firstNum, secondNum);
			break;
	}
}

function add(firstNum, secondNum) {
	return firstNum + secondNum;
}

function subtract(firstNum, secondNum) {
	return firstNum - secondNum;
}

function multiply(firstNum, secondNum) {
	return firstNum * secondNum;
}

function divide(firstNum, secondNum) {
	return firstNum / secondNum;
}

function percentage(firstNum, secondNum) {
	return firstNum * (secondNum / 100);
}

function addCalcHistory(operation_array, result) {
	const calc = operation_array.join(" ") + " = " + result;
	const li = document.createElement("li");
	li.textContent = calc;
	historyFrame.appendChild(li);
}

function disableCalc() {
	buttons.forEach((button) => {
		if (button.id !== "AC") {
			button.disabled = true;
		}
	});
}

function ableCalc() {
	buttons.forEach((button) => {
		if (button.id !== "AC") {
			button.disabled = false;
		}
	});
}

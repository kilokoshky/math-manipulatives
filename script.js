// Get the elements we need
const equation = document.getElementById("equation");
const workArea = document.getElementById("work-area");
const buttons = document.querySelectorAll("button");

const operationCheckboxes = document.querySelectorAll(
    "#operation-options input"
);

const nextButton = buttons[0];

// Get the operations the user selected
function getSelectedOperations() {
	const selectedOperations = [];
	
	operationCheckboxes.forEach(checkbox => {
	
	if (checkbox.checked) {
        
	selectedOperations.push(checkbox.id);
        
	}
	
	});
	
	return selectedOperations;
}


// Store the current problem
let number1;
let number2;
let currentOperation;

const emojiOptions = [
    "🍎",
    "⭐",
    "🐶",
    "🐱",
    "🚗",
    "🍕",
    "🐸",
    "🌈",
    "🦋",
    "🍓"
];

let additionEmoji1;
let additionEmoji2;
let currentEmoji;
let draggedSource = null;


// Create a new addition problem
function newProblem() {

    const selectedOperations = getSelectedOperations();

    if (selectedOperations.length === 0) {
        equation.textContent = "Select an operation";
        answer.value = "";
        workArea.innerHTML = "<p>Select an operation above.</p>";
        return;
    }

    const operation =
        selectedOperations[
            Math.floor(Math.random() * selectedOperations.length)
        ];

currentOperation = operation

if (operation === "addition") {
    number1 = Math.floor(Math.random() * 9) + 1;
    number2 = Math.floor(Math.random() * 9) + 1;

    additionEmoji1 =
        emojiOptions[Math.floor(Math.random() * emojiOptions.length)];

    do {
        additionEmoji2 =
            emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
    } while (additionEmoji2 === additionEmoji1);
}

if (operation === "subtraction") {
    number1 = Math.floor(Math.random() * 9) + 1;
    number2 = Math.floor(Math.random() * number1) + 1;

    currentEmoji =
        emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
}

if (operation === "multiplication") {
    number1 = Math.floor(Math.random() * 9) + 1;
    number2 = Math.floor(Math.random() * 9) + 1;

    currentEmoji =
        emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
}

if (operation === "division") {
    number2 = Math.floor(Math.random() * 9) + 1;
    const quotient = Math.floor(Math.random() * 10) + 1;
    number1 = number2 * quotient;

    currentEmoji =
        emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
}

    	if (operation === "addition") {
        equation.textContent = number1 + " + " + number2 + " =";
    	}
	if (operation === "subtraction") {
    	equation.textContent = number1 + " - " + number2 + " =";
	}
	if (operation === "multiplication") {
    	equation.textContent = number1 + " × " + number2 + " =";
	}
	if (operation === "division") {
   	equation.textContent = number1 + " ÷ " + number2 + " =";
	}

updateManipulatives(operation);

    answer.value = "";

    workArea.innerHTML = "<p>Drag your manipulatives here.</p>";
}

function updateManipulatives(operation) {

    const manipulatives = document.getElementById("manipulatives");

    manipulatives.innerHTML = "";

    	if (operation === "addition") {
    manipulatives.innerHTML = `
        <div class="manipulative-source" draggable="true" data-emoji="${additionEmoji1}">${additionEmoji1}</div>
        <div class="manipulative-source" draggable="true" data-emoji="${additionEmoji2}">${additionEmoji2}</div>
    `;
}

    	if (operation === "subtraction") {
    manipulatives.innerHTML = `
        <div class="manipulative-source" draggable="true" data-emoji="${currentEmoji}">${currentEmoji}</div>
    `;
}
	
	if (operation === "multiplication") {
    manipulatives.innerHTML = `
        <div class="manipulative-source" draggable="true" data-emoji="${currentEmoji}">${currentEmoji}</div>
    `;

    const product = number1 * number2;

    if (product > 40) {
        manipulatives.firstElementChild.style.fontSize = "20px";
    } else if (product > 25) {
        manipulatives.firstElementChild.style.fontSize = "25px";
    } else if (product > 15) {
        manipulatives.firstElementChild.style.fontSize = "30px";
    } else if (product > 10) {
        manipulatives.firstElementChild.style.fontSize = "35px";
    }
}
	
	if (operation === "division") {
    for (let i = 0; i < number1; i++) {
        const manipulative = document.createElement("div");

        manipulative.className = "manipulative-source";
	manipulative.draggable = true;
	manipulative.dataset.emoji = currentEmoji;
	manipulative.id = "division-" + i;
	manipulative.textContent = currentEmoji;

        manipulatives.appendChild(manipulative);
    }
}

makeSourcesDraggable();
setManipulativeSize();
}

function makeSourcesDraggable() {

    const sources = document.querySelectorAll(".manipulative-source");

    sources.forEach(source => {

        source.addEventListener("dragstart", function(event) {

    draggedSource = source;
    event.dataTransfer.setData("type", source.dataset.type);
    event.dataTransfer.setData("emoji", source.dataset.emoji);

});

    });

}

// Allow manipulatives to be dropped into the work area
workArea.addEventListener("dragover", function(event) {
    event.preventDefault();
});

workArea.addEventListener("drop", function(event) {

    event.preventDefault();

    const type = event.dataTransfer.getData("type");

    let manipulative;

    if (currentOperation === "division" && draggedSource) {

        manipulative = draggedSource;
        manipulative.className = "manipulative";
        manipulative.draggable = false;

    } else {

        manipulative = document.createElement("div");

        manipulative.className = "manipulative";

        if (currentOperation === "addition" ||
    currentOperation === "subtraction" ||
    currentOperation === "multiplication") {
    manipulative.textContent = event.dataTransfer.getData("emoji");
}

    }

    manipulative.style.position = "absolute";

    workArea.appendChild(manipulative);

    draggedSource = null;

    const workAreaRect = workArea.getBoundingClientRect();
    const manipulativeRect = manipulative.getBoundingClientRect();

    manipulative.style.left =
        (event.clientX - workAreaRect.left -
        manipulativeRect.width / 2) + "px";

    manipulative.style.top =
        (event.clientY - workAreaRect.top -
        manipulativeRect.height / 2) + "px";

    makeCounterMovable(manipulative);
    setManipulativeSize();

});


// Generate a new problem when Next is clicked
nextButton.addEventListener("click", function() {

    workArea.innerHTML = "<p>Drag your manipulatives here.</p>";

    newProblem();

});


// Create the first problem
newProblem();

function makeCounterMovable(counter) {

    counter.addEventListener("mousedown", function(event) {

        event.preventDefault();

        const workAreaRect = workArea.getBoundingClientRect();

        const offsetX = event.clientX - counter.getBoundingClientRect().left;
        const offsetY = event.clientY - counter.getBoundingClientRect().top;

        function moveCounter(event) {

            counter.style.left =
                (event.clientX - workAreaRect.left - offsetX) + "px";

            counter.style.top =
                (event.clientY - workAreaRect.top - offsetY) + "px";
        }

        function stopMoving() {

            document.removeEventListener("mousemove", moveCounter);
            document.removeEventListener("mouseup", stopMoving);

        }

        document.addEventListener("mousemove", moveCounter);
        document.addEventListener("mouseup", stopMoving);

    });

}

function setManipulativeSize() {

    const manipulatives = document.querySelectorAll(
        ".manipulative, .manipulative-source"
    );

    let count = manipulatives.length;

    if (currentOperation === "multiplication") {
        count = number1 * number2;
    }

    let size = 40;

    if (count > 40) {
        size = 20;
    } else if (count > 25) {
        size = 25;
    } else if (count > 15) {
        size = 30;
    } else if (count > 10) {
        size = 35;
    }

    manipulatives.forEach(manipulative => {
        manipulative.style.fontSize = size + "px";
    });
}
let result = document.querySelector(".display");
let buttons = document.querySelectorAll(".buttons button");
let sound = document.getElementById("clicksound");
let holdThreshold = 1000;
let clearTimer;
let lastChar;
let stack = [];
let operators = ["+", "-", "*", "/"];

function updateDisplay(value) {
  result.textContent = value;
  result.scrollLeft = result.scrollWidth;
}

function calculateResult() {
  try {
    let evalResult = eval(result.textContent);
    if (!isFinite(evalResult)) {
      updateDisplay("Error: Division by zero");
    } else if (evalResult.toString().length >= 7) {
      evalResult = evalResult.toExponential(2);
      updateDisplay(evalResult.toString());
    } else {
      updateDisplay(parseFloat(evalResult.toFixed(2)).toString());
    }
  } catch (error) {
    updateDisplay("Error");
  }
}

buttons.forEach((button) => {
  button.addEventListener("mousedown", function () {
    let currentDisplay = result.textContent;

    if (this.value === "C") {
      lastChar === ")" ? stack.push(lastChar) : null;
      updateDisplay(currentDisplay.slice(0, -1) || "0");

      clearTimer = setTimeout(() => {
        stack.length = 0;
        updateDisplay("0");
      }, holdThreshold);
    } else if (this.value === "=") {
      calculateResult();
    } else if (this.classList.contains("operator")) {
      if (lastChar !== "(" && !operators.includes(lastChar)) {
        if (operators.includes(lastChar)) {
          updateDisplay(currentDisplay.slice(0, -1) + this.value);
        } else {
          updateDisplay(currentDisplay + this.value);
        }
      }
    } else if (this.value === "(") {
      if (operators.includes(lastChar) || lastChar === "(") {
        stack.push(this.value);
        updateDisplay(
          currentDisplay === "0" ? this.value : currentDisplay + this.value
        );
      }
    } else if (this.value === ")") {
      if (
        stack.length > 0 &&
        !operators.includes(lastChar) &&
        lastChar !== "("
      ) {
        stack.pop();
        updateDisplay(currentDisplay + this.value);
      }
    } else {
      if (lastChar !== ")") {
        updateDisplay(
          currentDisplay === "0" ? this.value : currentDisplay + this.value
        );
      }
    }
    lastChar = result.textContent.slice(-1);
    sound.play();
  });
});

document.addEventListener("mouseup", () => {
  clearTimeout(clearTimer);
});

document.addEventListener("mouseleave", () => {
  clearTimeout(clearTimer);
});

var show = true;
let Keyboard = window.SimpleKeyboard.default;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button)
});

// Update simple-keyboard when input is changed directly
document.querySelector(".input").addEventListener("input", event => {
  keyboard.setInput(event.target.value);
});

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  // Enter button press event
  if (button === "{enter}"){
      if (show){
        form_data.name = $("#field").val();
        var r = confirm("Is your name spelled correctly: " + form_data.name + "?")
        if (r){
            hist.push("#q2");        
            $("#keyb").hide();
            $(hist[hist.length-2]).hide()
            $(hist[hist.length-1]).show()
            $("#back").show();
            show = false;
        }
        else {
            form_data.name = null;
        }
      }
  }

  // Toggle caps
  if (button === "{shift}" || button === "{lock}") handleShift();
}   

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}


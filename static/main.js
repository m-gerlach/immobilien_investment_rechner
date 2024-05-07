import Input from "./input.js"
import ReturnCalculator from "./return_calculator.js"

const input = new Input();

// Main function which is called on load
window.onload = function(){
  input.handle_changes();
  input.show();

  const return_calculator = new ReturnCalculator(input);
  return_calculator.plot_annuitaetendarlehen();
  return_calculator.plot_zins_pro_eigenkapitalanteil();
}

// make `update()` function available in HTML
window.update = function() { input.update(); }

// make `compute_return()` function available in HTML
window.compute_return = function() {
  const return_calculator = new ReturnCalculator(input);
  return_calculator.plot_net_return_for_variable_eigenkapital();
}

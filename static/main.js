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
window.update_rendite_pro_eigenkapital = function() { input.update_rendite_pro_eigenkapital(); }
window.update_einzelfallrechner = function() { input.update_einzelfallrechner(); }

// make `compute_rendite_pro_eigenkapital()` function available in HTML
window.compute_rendite_pro_eigenkapital = function() {
  const return_calculator = new ReturnCalculator(input);
  return_calculator.plot_net_return_for_variable_eigenkapital();
}

// make `compute_einzelfall()` function available in HTML
window.compute_einzelfall = function() {
  const return_calculator = new ReturnCalculator(input);
  return_calculator.display_timeline_for_fixed_eigenkapital();
}

import Input from "./input.js"
import ReturnCalculator from "./return_calculator.js"

const input = new Input();

// Main function which is called if the page is loaded initially
window.onload = function(){
  input.load();
  input.handle_form_changes("rendite_pro_eigenkapital_form");
  input.show();

  input.update_darlehensrechner();

  const return_calculator = new ReturnCalculator(input);
  return_calculator.plot_zins_pro_eigenkapitalanteil();
  return_calculator.display_darlehensverlauf();

  // Reload page to clear URL from input.
  // Note: the input is cached at this point.
  if(window.location.href.includes("?")) {
    window.location.href = window.location.pathname
  }
}

// make `update()` function available in HTML
window.update_rendite_pro_eigenkapital = function() { input.update_rendite_pro_eigenkapital(); }

window.update_einzelfallrechner = function() { input.update_einzelfallrechner(); }

window.update_darlehensrechner = function() {
  input.update_darlehensrechner();
  const return_calculator = new ReturnCalculator(input);
  return_calculator.display_darlehensverlauf();
}

// make `compute_rendite_pro_eigenkapital()` function available in HTML
window.compute_rendite_pro_eigenkapital = function() {
  const return_calculator = new ReturnCalculator(input);
  return_calculator.plot_net_return_for_variable_eigenkapital();
}

// make `compute_einzelfall()` function available in HTML
window.compute_einzelfall = function() {
  console.log(window.location.origin + window.location.pathname + "?" + new URLSearchParams(input).toString());
  const return_calculator = new ReturnCalculator(input);
  return_calculator.display_timeline_for_fixed_eigenkapital();
}


// make `copy_link_to_clipboard()` function available in HTML
window.copy_link_to_clipboard = function() {
  const url = window.location.origin + window.location.pathname + "?" + new URLSearchParams(input).toString();
  // Copy the text inside the text field
  navigator.clipboard.writeText(url);
  // Alert the copied text
  alert("URL kopiert!");
}

// make `prepare_rendite_pro_eigenkapital()` function available in HTML
window.prepare_rendite_pro_eigenkapital = function() {
  Plotly.Plots.resize('rendite_div');
}

// make `prepare_einzelfallrechner()` function available in HTML
window.prepare_einzelfallrechner = function() {}

// make `prepare_sollzinsverlauf()` function available in HTML
window.prepare_sollzinsverlauf = function() {
  Plotly.Plots.resize('zins_div');
}

// make `prepare_darlehensrechner()` function available in HTML
window.prepare_darlehensrechner = function() {
  Plotly.Plots.resize('darlehen_div');
}

import SollzinsRechner from "./sollzinsrechner.js";

export default class Input {
  constructor() {
    this.eigenkapital                                   = 10000;
    this.netto_kaufpreis                                = 59000;
    this.zusätzliche_modernisierungskosten              = 1000;
    this.erwartete_jahreskaltsmiete                     = 4500;
    this.wohnfläche                                     = 50;
    this.set_default_laufende_kosten_pro_jahr           = true;
    this.laufende_kosten_pro_jahr                       = "";
    this.finanzierungsdauer_in_jahren                   = 10;
    this.baujahr                                        = 1990;
    this.set_default_sollzins                           = true;
    this.sollzins                                       = "";
    this.tilgungsrate_pro_jahr                          = 1;
    this.maklercourtage                                 = 3.57;
    this.rücklagen_enthalten_in_kaufpreis               = 0;
    this.zusätzliche_enthaltente_werte_in_kaufpreis     = 0;
    this.notarkosten                                    = 1.5;
    this.grunderwerbssteuersatz                         = 6;
    this.set_default_grund_und_bodenwert                = true;
    this.grund_und_bodenwert                            = "";
    this.gewerblich_vermietet                           = false;
    this.denkmalgeschützt                               = false;
    this.einkommenssteuersatz                           = 30;
    this.erwerb_durch_vermögensverwaltende_körperschaft = false;
  }

  /**
   * Update the displayed data in the rendite_pro_eigenkapital form and act on changes.
  */
 update_rendite_pro_eigenkapital() {
   this.read_rendite_pro_eigenkapital_input();
   this.handle_form_changes("rendite_pro_eigenkapital_form");
   this.save();
   this.show();
  }

  /**
   * Update the displayed data in the einzelfallrechner form and act on changes.
  */
 update_einzelfallrechner() {
   this.read_einzelfallrechner_input();
   this.handle_form_changes("einzelfallrechner_form");
   this.save();
   this.show();
  }

  /**
   * Read the input from the rendite_pro_eigenkapital form and load it to the data set.
   */
  read_rendite_pro_eigenkapital_input() {
    this.netto_kaufpreis = Number(document.forms["rendite_pro_eigenkapital_form"]["netto_kaufpreis"].value);
    this.zusätzliche_modernisierungskosten = Number(document.forms["rendite_pro_eigenkapital_form"]["zusätzliche_modernisierungskosten"].value);
    this.erwartete_jahreskaltsmiete = Number(document.forms["rendite_pro_eigenkapital_form"]["erwartete_jahreskaltsmiete"].value);
    this.wohnfläche = Number(document.forms["rendite_pro_eigenkapital_form"]["wohnfläche"].value);
    this.set_default_laufende_kosten_pro_jahr = Boolean(document.forms["rendite_pro_eigenkapital_form"]["set_default_laufende_kosten_pro_jahr"].checked);
    this.finanzierungsdauer_in_jahren = Number(document.forms["rendite_pro_eigenkapital_form"]["finanzierungsdauer_in_jahren"].value);
    this.baujahr = Number(document.forms["rendite_pro_eigenkapital_form"]["baujahr"].value);
    this.tilgungsrate_pro_jahr = Number(document.forms["rendite_pro_eigenkapital_form"]["tilgungsrate_pro_jahr"].value);
    this.maklercourtage = Number(document.forms["rendite_pro_eigenkapital_form"]["maklercourtage"].value);
    this.rücklagen_enthalten_in_kaufpreis = Number(document.forms["rendite_pro_eigenkapital_form"]["rücklagen_enthalten_in_kaufpreis"].value);
    this.zusätzliche_enthaltente_werte_in_kaufpreis = Number(document.forms["rendite_pro_eigenkapital_form"]["zusätzliche_enthaltente_werte_in_kaufpreis"].value);
    this.notarkosten = Number(document.forms["rendite_pro_eigenkapital_form"]["notarkosten"].value);
    this.grunderwerbssteuersatz = Number(document.forms["rendite_pro_eigenkapital_form"]["grunderwerbssteuersatz"].value);
    this.set_default_grund_und_bodenwert = Boolean(document.forms["rendite_pro_eigenkapital_form"]["set_default_grund_und_bodenwert"].checked);
    this.grund_und_bodenwert = Number(document.forms["rendite_pro_eigenkapital_form"]["grund_und_bodenwert"].value);
    this.gewerblich_vermietet = Boolean(document.forms["rendite_pro_eigenkapital_form"]["gewerblich_vermietet"].checked);
    this.denkmalgeschützt = Boolean(document.forms["rendite_pro_eigenkapital_form"]["denkmalgeschützt"].checked);
    this.einkommenssteuersatz = Number(document.forms["rendite_pro_eigenkapital_form"]["einkommenssteuersatz"].value);
    this.erwerb_durch_vermögensverwaltende_körperschaft = Boolean(document.forms["rendite_pro_eigenkapital_form"]["erwerb_durch_vermögensverwaltende_körperschaft"].checked);
  }

  /**
   * Read the input from the rendite_pro_eigenkapital form and load it to the data set.
   */
  read_einzelfallrechner_input() {
    this.eigenkapital = Number(document.forms["einzelfallrechner_form"]["eigenkapital"].value);
    this.netto_kaufpreis = Number(document.forms["einzelfallrechner_form"]["netto_kaufpreis"].value);
    this.zusätzliche_modernisierungskosten = Number(document.forms["einzelfallrechner_form"]["zusätzliche_modernisierungskosten"].value);
    this.erwartete_jahreskaltsmiete = Number(document.forms["einzelfallrechner_form"]["erwartete_jahreskaltsmiete"].value);
    this.wohnfläche = Number(document.forms["einzelfallrechner_form"]["wohnfläche"].value);
    this.set_default_laufende_kosten_pro_jahr = Boolean(document.forms["einzelfallrechner_form"]["set_default_laufende_kosten_pro_jahr"].checked);
    this.finanzierungsdauer_in_jahren = Number(document.forms["einzelfallrechner_form"]["finanzierungsdauer_in_jahren"].value);
    this.baujahr = Number(document.forms["einzelfallrechner_form"]["baujahr"].value);
    this.set_default_sollzins = Boolean(document.forms["einzelfallrechner_form"]["set_default_sollzins"].checked);
    this.sollzins = Number(document.forms["einzelfallrechner_form"]["sollzins"].value);
    this.tilgungsrate_pro_jahr = Number(document.forms["einzelfallrechner_form"]["tilgungsrate_pro_jahr"].value);
    this.maklercourtage = Number(document.forms["einzelfallrechner_form"]["maklercourtage"].value);
    this.rücklagen_enthalten_in_kaufpreis = Number(document.forms["einzelfallrechner_form"]["rücklagen_enthalten_in_kaufpreis"].value);
    this.zusätzliche_enthaltente_werte_in_kaufpreis = Number(document.forms["einzelfallrechner_form"]["zusätzliche_enthaltente_werte_in_kaufpreis"].value);
    this.notarkosten = Number(document.forms["einzelfallrechner_form"]["notarkosten"].value);
    this.grunderwerbssteuersatz = Number(document.forms["einzelfallrechner_form"]["grunderwerbssteuersatz"].value);
    this.set_default_grund_und_bodenwert = Boolean(document.forms["einzelfallrechner_form"]["set_default_grund_und_bodenwert"].checked);
    this.grund_und_bodenwert = Number(document.forms["einzelfallrechner_form"]["grund_und_bodenwert"].value);
    this.gewerblich_vermietet = Boolean(document.forms["einzelfallrechner_form"]["gewerblich_vermietet"].checked);
    this.denkmalgeschützt = Boolean(document.forms["einzelfallrechner_form"]["denkmalgeschützt"].checked);
    this.einkommenssteuersatz = Number(document.forms["einzelfallrechner_form"]["einkommenssteuersatz"].value);
    this.erwerb_durch_vermögensverwaltende_körperschaft = Boolean(document.forms["einzelfallrechner_form"]["erwerb_durch_vermögensverwaltende_körperschaft"].checked);
  }

  handle_form_changes(source_form_name) {
    // Handle default laufende_kosten_pro_jahr
    if(this.set_default_laufende_kosten_pro_jahr) {
      this.laufende_kosten_pro_jahr = this.compute_default_laufende_kosten_pro_jahr();
      document.forms["rendite_pro_eigenkapital_form"]["laufende_kosten_pro_jahr"].setAttribute("disabled", "");
      document.forms["einzelfallrechner_form"]["laufende_kosten_pro_jahr"].setAttribute("disabled", "");
    }
    else {
      this.laufende_kosten_pro_jahr = document.forms[source_form_name]["laufende_kosten_pro_jahr"].value;
      document.forms["rendite_pro_eigenkapital_form"]["laufende_kosten_pro_jahr"].removeAttribute("disabled");
      document.forms["einzelfallrechner_form"]["laufende_kosten_pro_jahr"].removeAttribute("disabled");
    }

    // Handle default grund_und_bodenwert
    if(this.set_default_grund_und_bodenwert) {
      this.grund_und_bodenwert = this.compute_default_grund_und_bodenwert();
      document.forms["rendite_pro_eigenkapital_form"]["grund_und_bodenwert"].setAttribute("disabled", "");
      document.forms["einzelfallrechner_form"]["grund_und_bodenwert"].setAttribute("disabled", "");
    }
    else {
      this.grund_und_bodenwert = document.forms[source_form_name]["grund_und_bodenwert"].value;
      document.forms["rendite_pro_eigenkapital_form"]["grund_und_bodenwert"].removeAttribute("disabled");
      document.forms["einzelfallrechner_form"]["grund_und_bodenwert"].removeAttribute("disabled");
    }

    // Handle default sollzins
    if(this.set_default_sollzins) {
      this.sollzins = this.compute_default_sollzins();
      document.forms["einzelfallrechner_form"]["sollzins"].setAttribute("disabled", "");
    }
    else {
      this.sollzins = document.forms[source_form_name]["sollzins"].value;
      document.forms["einzelfallrechner_form"]["sollzins"].removeAttribute("disabled");
    }
  }

  /**
   * Display the stored values of this class.
   */
  show() {
    // rendite_pro_eigenkapital_form
    document.forms["rendite_pro_eigenkapital_form"]["netto_kaufpreis"].value = this.netto_kaufpreis;
    document.forms["rendite_pro_eigenkapital_form"]["zusätzliche_modernisierungskosten"].value = this.zusätzliche_modernisierungskosten;
    document.forms["rendite_pro_eigenkapital_form"]["erwartete_jahreskaltsmiete"].value = this.erwartete_jahreskaltsmiete;
    document.forms["rendite_pro_eigenkapital_form"]["wohnfläche"].value = this.wohnfläche;
    document.forms["rendite_pro_eigenkapital_form"]["set_default_laufende_kosten_pro_jahr"].checked = this.set_default_laufende_kosten_pro_jahr;
    document.forms["rendite_pro_eigenkapital_form"]["laufende_kosten_pro_jahr"].value = this.laufende_kosten_pro_jahr;
    document.forms["rendite_pro_eigenkapital_form"]["finanzierungsdauer_in_jahren"].value = this.finanzierungsdauer_in_jahren;
    document.forms["rendite_pro_eigenkapital_form"]["baujahr"].value = this.baujahr;
    document.forms["rendite_pro_eigenkapital_form"]["tilgungsrate_pro_jahr"].value = this.tilgungsrate_pro_jahr;
    document.forms["rendite_pro_eigenkapital_form"]["maklercourtage"].value = this.maklercourtage;
    document.forms["rendite_pro_eigenkapital_form"]["rücklagen_enthalten_in_kaufpreis"].value = this.rücklagen_enthalten_in_kaufpreis;
    document.forms["rendite_pro_eigenkapital_form"]["zusätzliche_enthaltente_werte_in_kaufpreis"].value = this.zusätzliche_enthaltente_werte_in_kaufpreis;
    document.forms["rendite_pro_eigenkapital_form"]["notarkosten"].value = this.notarkosten;
    document.forms["rendite_pro_eigenkapital_form"]["grunderwerbssteuersatz"].value = this.grunderwerbssteuersatz;
    document.forms["rendite_pro_eigenkapital_form"]["set_default_grund_und_bodenwert"].checked = this.set_default_grund_und_bodenwert;
    document.forms["rendite_pro_eigenkapital_form"]["grund_und_bodenwert"].value = this.grund_und_bodenwert;
    document.forms["rendite_pro_eigenkapital_form"]["gewerblich_vermietet"].checked = this.gewerblich_vermietet;
    document.forms["rendite_pro_eigenkapital_form"]["denkmalgeschützt"].checked = this.denkmalgeschützt;
    document.forms["rendite_pro_eigenkapital_form"]["einkommenssteuersatz"].value = this.einkommenssteuersatz;
    document.forms["rendite_pro_eigenkapital_form"]["erwerb_durch_vermögensverwaltende_körperschaft"].checked = this.erwerb_durch_vermögensverwaltende_körperschaft;
    // einzelfallrechner_form
    document.forms["einzelfallrechner_form"]["eigenkapital"].value = this.eigenkapital;
    document.forms["einzelfallrechner_form"]["netto_kaufpreis"].value = this.netto_kaufpreis;
    document.forms["einzelfallrechner_form"]["zusätzliche_modernisierungskosten"].value = this.zusätzliche_modernisierungskosten;
    document.forms["einzelfallrechner_form"]["erwartete_jahreskaltsmiete"].value = this.erwartete_jahreskaltsmiete;
    document.forms["einzelfallrechner_form"]["wohnfläche"].value = this.wohnfläche;
    document.forms["einzelfallrechner_form"]["set_default_laufende_kosten_pro_jahr"].checked = this.set_default_laufende_kosten_pro_jahr;
    document.forms["einzelfallrechner_form"]["laufende_kosten_pro_jahr"].value = this.laufende_kosten_pro_jahr;
    document.forms["einzelfallrechner_form"]["finanzierungsdauer_in_jahren"].value = this.finanzierungsdauer_in_jahren;
    document.forms["einzelfallrechner_form"]["baujahr"].value = this.baujahr;
    document.forms["einzelfallrechner_form"]["set_default_sollzins"].checked = this.set_default_sollzins;
    document.forms["einzelfallrechner_form"]["sollzins"].value = this.sollzins;
    document.forms["einzelfallrechner_form"]["tilgungsrate_pro_jahr"].value = this.tilgungsrate_pro_jahr;
    document.forms["einzelfallrechner_form"]["maklercourtage"].value = this.maklercourtage;
    document.forms["einzelfallrechner_form"]["rücklagen_enthalten_in_kaufpreis"].value = this.rücklagen_enthalten_in_kaufpreis;
    document.forms["einzelfallrechner_form"]["zusätzliche_enthaltente_werte_in_kaufpreis"].value = this.zusätzliche_enthaltente_werte_in_kaufpreis;
    document.forms["einzelfallrechner_form"]["notarkosten"].value = this.notarkosten;
    document.forms["einzelfallrechner_form"]["grunderwerbssteuersatz"].value = this.grunderwerbssteuersatz;
    document.forms["einzelfallrechner_form"]["set_default_grund_und_bodenwert"].checked = this.set_default_grund_und_bodenwert;
    document.forms["einzelfallrechner_form"]["grund_und_bodenwert"].value = this.grund_und_bodenwert;
    document.forms["einzelfallrechner_form"]["gewerblich_vermietet"].checked = this.gewerblich_vermietet;
    document.forms["einzelfallrechner_form"]["denkmalgeschützt"].checked = this.denkmalgeschützt;
    document.forms["einzelfallrechner_form"]["einkommenssteuersatz"].value = this.einkommenssteuersatz;
    document.forms["einzelfallrechner_form"]["erwerb_durch_vermögensverwaltende_körperschaft"].checked = this.erwerb_durch_vermögensverwaltende_körperschaft;
  }

  compute_default_laufende_kosten_pro_jahr() {
    // Following https://www.homeday.de/de/immobilienwissen/instandhaltungskosten-haus/ accessed on 20.04.2024
    const year = new Date().getFullYear();
    if(year - this.baujahr < 22) { return 7.10 * this.wohnfläche; }
    if(year - this.baujahr < 32) { return 9 * this.wohnfläche; }
    return 11.50 * this.wohnfläche;
  }

  compute_default_grund_und_bodenwert() {
    return 0.2*this.netto_kaufpreis;
  }

  compute_default_sollzins() {
    return (100*SollzinsRechner.zins_pro_eigenkapitalanteil(this.eigenkapital/this.netto_kaufpreis)).toFixed(2);
  }

  /**
   * Save fields to session storage.
   */
  save() {
    sessionStorage.setItem('input', JSON.stringify(this));
  }

  /**
   * Load fields from session storage.
  */
 load() {
    // Try loading input from session storage
    var loaded_input = null;
    try {
      loaded_input = JSON.parse(sessionStorage.getItem('input'));
    }
    catch(e){ return; }
    if(loaded_input == null) { return; }

    // Set individual fields
    for(var key in this) {
      if(loaded_input[key] != null) {
        this[key] = loaded_input[key];
      }
    }
  }
}

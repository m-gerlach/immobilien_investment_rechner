export default class Input {
  constructor() {
    this.netto_kaufpreis                                = 59000;
    this.zusätzliche_modernisierungskosten              = 1000;
    this.erwartete_jahreskaltsmiete                     = 4500;
    this.wohnfläche                                     = 50;
    this.set_default_laufende_kosten_pro_jahr           = true;
    this.laufende_kosten_pro_jahr                       = "";
    this.finanzierungsdauer_in_jahren                   = 10;
    this.baujahr                                        = 1990;
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
   * Update the displayed data and act on changes.
  */
 update() {
   this.read_input();
   this.handle_changes();
   this.show();
  }

  /**
   * Read the input from the form and load it to the data set.
   */
  read_input() {
    this.netto_kaufpreis = Number(document.forms["house_data_form"]["netto_kaufpreis"].value);
    this.zusätzliche_modernisierungskosten = Number(document.forms["house_data_form"]["zusätzliche_modernisierungskosten"].value);
    this.erwartete_jahreskaltsmiete = Number(document.forms["house_data_form"]["erwartete_jahreskaltsmiete"].value);
    this.wohnfläche = Number(document.forms["house_data_form"]["wohnfläche"].value);
    this.set_default_laufende_kosten_pro_jahr = Boolean(document.forms["house_data_form"]["set_default_laufende_kosten_pro_jahr"].checked);
    this.finanzierungsdauer_in_jahren = Number(document.forms["house_data_form"]["finanzierungsdauer_in_jahren"].value);
    this.baujahr = Number(document.forms["house_data_form"]["baujahr"].value);
    this.tilgungsrate_pro_jahr = Number(document.forms["house_data_form"]["tilgungsrate_pro_jahr"].value);
    this.maklercourtage = Number(document.forms["house_data_form"]["maklercourtage"].value);
    this.rücklagen_enthalten_in_kaufpreis = Number(document.forms["house_data_form"]["rücklagen_enthalten_in_kaufpreis"].value);
    this.zusätzliche_enthaltente_werte_in_kaufpreis = Number(document.forms["house_data_form"]["zusätzliche_enthaltente_werte_in_kaufpreis"].value);
    this.notarkosten = Number(document.forms["house_data_form"]["notarkosten"].value);
    this.grunderwerbssteuersatz = Number(document.forms["house_data_form"]["grunderwerbssteuersatz"].value);
    this.set_default_grund_und_bodenwert = Boolean(document.forms["house_data_form"]["set_default_grund_und_bodenwert"].checked);
    this.grund_und_bodenwert = Number(document.forms["house_data_form"]["grund_und_bodenwert"].value);
    this.gewerblich_vermietet = Boolean(document.forms["house_data_form"]["gewerblich_vermietet"].checked);
    this.denkmalgeschützt = Boolean(document.forms["house_data_form"]["denkmalgeschützt"].checked);
    this.einkommenssteuersatz = Number(document.forms["house_data_form"]["einkommenssteuersatz"].value);
    this.erwerb_durch_vermögensverwaltende_körperschaft = Boolean(document.forms["house_data_form"]["erwerb_durch_vermögensverwaltende_körperschaft"].checked);
  }

  handle_changes() {
    // Handle default laufende_kosten_pro_jahr
    if(this.set_default_laufende_kosten_pro_jahr) {
      this.laufende_kosten_pro_jahr = this.compute_default_laufende_kosten_pro_jahr();
      document.forms["house_data_form"]["laufende_kosten_pro_jahr"].setAttribute("disabled", "");
    }
    else {
      this.laufende_kosten_pro_jahr = document.forms["house_data_form"]["laufende_kosten_pro_jahr"].value;
      document.forms["house_data_form"]["laufende_kosten_pro_jahr"].removeAttribute("disabled");
    }

    // Handle default grund_und_bodenwert
    if(this.set_default_grund_und_bodenwert) {
      this.grund_und_bodenwert = this.compute_default_grund_und_bodenwert();
      document.forms["house_data_form"]["grund_und_bodenwert"].setAttribute("disabled", "");
    }
    else {
      this.grund_und_bodenwert = document.forms["house_data_form"]["grund_und_bodenwert"].value;
      document.forms["house_data_form"]["grund_und_bodenwert"].removeAttribute("disabled");
    }
  }

  /**
   * Display the stored values of this class.
   */
  show() {
    document.forms["house_data_form"]["netto_kaufpreis"].value = this.netto_kaufpreis;
    document.forms["house_data_form"]["zusätzliche_modernisierungskosten"].value = this.zusätzliche_modernisierungskosten;
    document.forms["house_data_form"]["erwartete_jahreskaltsmiete"].value = this.erwartete_jahreskaltsmiete;
    document.forms["house_data_form"]["wohnfläche"].value = this.wohnfläche;
    document.forms["house_data_form"]["set_default_laufende_kosten_pro_jahr"].checked = this.set_default_laufende_kosten_pro_jahr;
    document.forms["house_data_form"]["laufende_kosten_pro_jahr"].value = this.laufende_kosten_pro_jahr;
    document.forms["house_data_form"]["finanzierungsdauer_in_jahren"].value = this.finanzierungsdauer_in_jahren;
    document.forms["house_data_form"]["baujahr"].value = this.baujahr;
    document.forms["house_data_form"]["tilgungsrate_pro_jahr"].value = this.tilgungsrate_pro_jahr;
    document.forms["house_data_form"]["maklercourtage"].value = this.maklercourtage;
    document.forms["house_data_form"]["rücklagen_enthalten_in_kaufpreis"].value = this.rücklagen_enthalten_in_kaufpreis;
    document.forms["house_data_form"]["zusätzliche_enthaltente_werte_in_kaufpreis"].value = this.zusätzliche_enthaltente_werte_in_kaufpreis;
    document.forms["house_data_form"]["notarkosten"].value = this.notarkosten;
    document.forms["house_data_form"]["grunderwerbssteuersatz"].value = this.grunderwerbssteuersatz;
    document.forms["house_data_form"]["set_default_grund_und_bodenwert"].checked = this.set_default_grund_und_bodenwert;
    document.forms["house_data_form"]["grund_und_bodenwert"].value = this.grund_und_bodenwert;
    document.forms["house_data_form"]["gewerblich_vermietet"].checked = this.gewerblich_vermietet;
    document.forms["house_data_form"]["denkmalgeschützt"].checked = this.denkmalgeschützt;
    document.forms["house_data_form"]["einkommenssteuersatz"].value = this.einkommenssteuersatz;
    document.forms["house_data_form"]["erwerb_durch_vermögensverwaltende_körperschaft"].checked = this.erwerb_durch_vermögensverwaltende_körperschaft;
  }

  compute_default_laufende_kosten_pro_jahr() {
    // Following https://www.homeday.de/de/immobilienwissen/instandhaltungskosten-haus/ accessed on 20.04.2024
    const year = new Date().getFullYear();
    if(year - this.baujahr < 22) { return 7.10 * this.wohnfläche; }
    if(year - this.baujahr < 32) { return 9 * this.wohnfläche; }
    return 11.50 * this.wohnfläche;
  }

  compute_default_grund_und_bodenwert() {
    return 0.2*this.netto_kaufpreis
  }
}

// import Input from "./input";

export default class ReturnCalculator {
  /**
   *
   * @param {Input} input
   */
  constructor(input) {
    this.input = input;
  }

  /**
   * @return Extrapolierter Verlauf zwischen Anteil vom Eigenkapital am Netto-Kaufpreis und effektiver Sollzins.
  */
  zins_pro_eigenkapitalanteil(eigenkapitalanteil) {
    return 0.02659689753649553 * Math.exp( 0.1934918614657533 /(eigenkapitalanteil + 0.22856910809757086));
  }

  /**
   * Plotte `zins_pro_eigenkapitalanteil()` und zeige das Ergebnis.
   */
  plot_zins_pro_eigenkapitalanteil() {
    var x = Array.from(new Array(100), (x, i) => 0+0.01*i);
    var y = x.map(this.zins_pro_eigenkapitalanteil).map((i) => 100*i)

    var trace = {
      x: x,
      y: y,
      type: 'lines'
    };

    var layout = {
      title: 'Effektiver Sollzins bei variablem Eigenkapitalanteil',
      xaxis: {
        title: 'Eigenkapital / Netto Kaufpreis',
      },
      yaxis: {
        title: 'Zins in %',
      }
    };

    Plotly.newPlot('zins_div', [trace], layout);
  }

  /**
   *
   * @param {Number} anzahl_jahre_seit_kauf Zeit die vergangen ist seit der Anschaffung der Immobilie
   * @returns {Number} Jährliche Abschreibung durch angefallene Anschaffungskosten
   */
  compute_abschreibung_in_prozent(anzahl_jahre_seit_kauf) {
    // Denkmal
    if(this.input.denkmalgeschützt){
      if(anzahl_jahre_seit_kauf < 9) return 9
      if(anzahl_jahre_seit_kauf < 13) return 7
      return 0
    }
    // Altbau
    if(this.input.baujahr < 1925){
      if(anzahl_jahre_seit_kauf < 40) return 2.5
      return 0
    }
    // Neubau
    if(anzahl_jahre_seit_kauf < 50) return 2
    return 0
  }

  /**
   * Berechnung von zu zahlenden absoluten Zinsen und Tilgungen bei einem Finanzierung durch Dritte (z.B. einer Bank) aufgeschlüsselt pro Jahr.
   * @param {Number} schulden: Volumen, das durch die Finanzierung aufgenommen wurde
   * @param {Number} finanzierungsdauer_in_jahren: Dauer der Finanzierungsberechnung
   * @param {Number} zinssatz: Jährlich zu entrichtender Anteil des Finanzierungsvolumens das als Zinsen gezahlt wird
   * @param {Number} tilgungssatz: Jährlich zu entrichtender Anteil des Finanzierungsvolumens das als Tilgung gezahlt wird
   *
   * @return sollzinstabelle: Liste von anfallenden Sollzinsen für Jahr 0, Jahr 1, ...
   * @return tilgungstabelle: Liste von anfallenden Tilgungszahlungen für Jahr 0, Jahr 1, ...
   * @return restschulden: Restschuld am Ende des Finanzierungszeitraums
   *
   */
  compute_annuitätendarlehen_verlauf(schulden, finanzierungsdauer_in_jahren, zinssatz, tilgungssatz) {
    var sollzinstabelle = [];
    var tilgungstabelle = [];
    var restschulden = schulden;
    const rückzahl_betrag = schulden * (zinssatz + tilgungssatz);

    for(var i=0; i<finanzierungsdauer_in_jahren; i++){
      if(restschulden > 0) {
        // Sollzins ist immer fixer prozentualer Anteil an Restschulden
        sollzinstabelle.push(restschulden * zinssatz);
        // Tilgung steigt beim Annuitätendarlehen, da der rückgezahlte Betrag konstant ist
        const tilgung = (rückzahl_betrag - restschulden * zinssatz);
        tilgungstabelle.push(tilgung);
        restschulden = restschulden - tilgung;
      }
      else {
        // Nachdem alle Schulden beglichen sind, verschwinden die Aufwände
        sollzinstabelle.push(0);
        tilgungstabelle.push(0);
      }
    }

    return [sollzinstabelle, tilgungstabelle, restschulden];
  }

  /**
   * Berechne die anfallende Umsatzsteuer eines zusätzlich anfallenden Gewinns bei einem festen Einkommensteuersatz.
   * Progression im Einkommensteuersatz ist hier vernachlässigt.
   * @param {*} zu_versteuernder_gewinn Zusätzlicher Gewinn den es zu versteuern gilt
   * @param {*} einkommenssteuersatz Satz der zu zahlenden Einkommenssteuerprogression zwischen 0 und 0.42 (bzw. 0.45 bei Reichensteuer)
   * @returns Anfallende Umsatzsteuer
   */
  compute_v_und_v_einkommenssteuer(zu_versteuernder_gewinn, einkommenssteuersatz) {
    return zu_versteuernder_gewinn * einkommenssteuersatz;
  }


  /**
   * Berechne die anfallende Körperschaftssteuer eines zusätzlich anfallenden Gewinns der bei einer juristischen Körperschaft anfällt.
   * @param {*} zu_versteuernder_gewinn Zusätzlicher Gewinn den es zu versteuern gilt
   * @returns Anfallende Körperschaftssteuer
   */
  compute_v_und_v_körperschaftssteuer(zu_versteuernder_gewinn) {
    return zu_versteuernder_gewinn * 0.15;
  }

  /**
   * Berechne die anfallende Gewerbesteuer eines zusätzlich anfallenden Gewinns der bei einem gewerblichen Betrieb anfällt.
   * Gewerblicher Betrieb bei Immobilien ist nur angenommen bei mehr als drei Immobilienveräußerungen innerhalb eines Zeitraums von 5 Jahren.
   * Reine vermögensverwaltenden bzw. vermietende GmbHs (Immobilien-GmbHs) und Stiftungen zahlen keine Gewerbesteuer.
   * @param {*} zu_versteuernder_gewinn Zusätzlicher Gewinn den es zu versteuern gilt
   * @returns Anfallende Gewerbesteuer
   */
  compute_v_und_v_gewerbesteuer(zu_versteuernder_gewinn) {
    return zu_versteuernder_gewinn * 0.15;
  }

  /**
   * @returns Anfallende Grunderwerbssteuer beim Immobilienkauf
   */
  compute_grunderwerbssteuer() {
    return 0.065 * (this.input.netto_kaufpreis - this.input.rücklagen_enthalten_in_kaufpreis - this.input.zusätzliche_enthaltente_werte_in_kaufpreis)
  }

  /**
   * @returns Gesamtes benötigtes Kapital das zum Kauf und zur Nutzbarmachung der Immobilie anfänglich benötigt wird
   */
  compute_gesamt_anschaffungspreis() {
    return this.input.netto_kaufpreis
      + (this.input.netto_kaufpreis * this.input.maklercourtage/100.)
      + (this.input.netto_kaufpreis * this.input.notarkosten/100.)
      + this.input.zusätzliche_modernisierungskosten
      + this.compute_grunderwerbssteuer();
  }

  /**
   * Compute the sum of the given array.
   * @param {*} array_of_numbers Array of numbers which we want to summarize
   * @returns Sum of array_of_numbers
   */
  sum(array_of_numbers) {
    return array_of_numbers.reduce((partialSum, a) => partialSum + a, 0);
  }


  /**
   * Gesamter Cashflow pro Jahr inklusive Tilgungsrücklage am Ende der Finanzierungslaufzeit
   * @param {*} eigenkapital Eingebrachtes Eigenkapital in das Investment
   * @param {*} investitionsdauer Dauer der Investitionsbetrachtung in Jahren
   */
  compute_rendite_pro_jahr_mit_variablem_eigenkapital(eigenkapital, investitionsdauer, shall_log_result){
    var anschaffungspreis = this.compute_gesamt_anschaffungspreis();

    var finanzierungsvolumen = anschaffungspreis - eigenkapital;
    if(finanzierungsvolumen < 0)
    finanzierungsvolumen = 0;

  const [sollzinstabelle, tilgungstabelle, restschulden] = this.compute_annuitätendarlehen_verlauf(
    finanzierungsvolumen, investitionsdauer, this.zins_pro_eigenkapitalanteil(eigenkapital/this.input.netto_kaufpreis), this.input.tilgungsrate_pro_jahr/100.
  );

    var mieteinkünfte_pro_jahr = (this.input.erwartete_jahreskaltsmiete - this.input.laufende_kosten_pro_jahr);
    var cashflow_pro_jahr = [];
    const abschreibbarer_gebäudewert = (anschaffungspreis - this.input.grund_und_bodenwert - this.input.rücklagen_enthalten_in_kaufpreis);

    for(var jahr in [...Array(investitionsdauer).keys()]) {
      var afa = abschreibbarer_gebäudewert * this.compute_abschreibung_in_prozent(jahr)/100.;
      var zu_versteuernder_gewinn = Math.round(mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - afa);

      var verlustvortragsgewinn = 0;
      var steuern = 0;
      if(zu_versteuernder_gewinn < 0) {
        if(! this.input.erwerb_durch_vermögensverwaltende_körperschaft)
          verlustvortragsgewinn = Math.max(zu_versteuernder_gewinn, 0) * this.input.einkommenssteuersatz/100.;
      }
      else if(this.input.erwerb_durch_vermögensverwaltende_körperschaft)
        steuern = this.compute_v_und_v_körperschaftssteuer(zu_versteuernder_gewinn);
      else
        steuern = this.compute_v_und_v_einkommenssteuer(zu_versteuernder_gewinn, this.input.einkommenssteuersatz/100.);

      var cashflow = Math.round(mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - tilgungstabelle[jahr] - steuern + verlustvortragsgewinn)
      cashflow_pro_jahr.push(cashflow)

      if(shall_log_result) {
        console.log("Jahr " + jahr + ":")
        console.log("Einnahmen durch V&V: " + Math.round(mieteinkünfte_pro_jahr) + "€")
        console.log("Finanzierungskosten: " + Math.round(sollzinstabelle[jahr]) + "€")
        console.log("Tilgungskosten: " + Math.round(tilgungstabelle[jahr]) + "€")
        console.log("---------------")
        console.log("Zu versteuernder Überschuss: " + Math.round(mieteinkünfte_pro_jahr - sollzinstabelle[jahr]) + "€")
        console.log("AfA: " + Math.round(afa) + "€")
        console.log("Steuerlicher Gewinn: " + zu_versteuernder_gewinn + "€ ")
        console.log("Steuerersparnis der Hauptberuflichkeit: " + verlustvortragsgewinn + "€")
        if( (mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - tilgungstabelle[jahr]) == 0)
          console.log("Steuerabzug: " + steuern + "€ (0%)")
        else
        console.log("Steuerabzug: " + steuern + "€ (" + 100 * steuern/(mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - tilgungstabelle[jahr]) + "%)")
        console.log("---------------")
        console.log("Cashflow: " + cashflow + "€")
      }
    }

    if(shall_log_result) {
      console.log("Anschaffungskosten entsprechen " + this.compute_gesamt_anschaffungspreis()/this.input.erwartete_jahreskaltsmiete + " Jahreskaltmieten.")
      console.log("Restschulden nach " + investitionsdauer + " Jahren: " + Math.round(restschulden) + "€")
      console.log("Gesamtanschaffungskosten: " + this.compute_gesamt_anschaffungspreis() + "€")
      console.log("Eingebrachtes Kapital: " + eigenkapital + "€")
      console.log("Cashflow in " + investitionsdauer + " Jahren: " + Math.round(this.sum(cashflow_pro_jahr)) + "€ = " + 100*this.sum(cashflow_pro_jahr)/eigenkapital/investitionsdauer + "% p.a.")
    }

    return this.sum(cashflow_pro_jahr)/eigenkapital/investitionsdauer
  }


  /**
   * Berechne die erwartete Nettorendite bei gegebenem input und variablem Eigenkapital
  */
  plot_net_return_for_variable_eigenkapital() {
    // this.compute_rendite_pro_jahr_mit_variablem_eigenkapital(10000, 10, true);

    var rendite_tabelle = [];
    var eigenkapital_tabelle = [];
    for(var i=0; i<100; i++){
      const eigenkapital = this.compute_gesamt_anschaffungspreis() * (i/100.);
      const rendite = 100*this.compute_rendite_pro_jahr_mit_variablem_eigenkapital(eigenkapital, this.input.finanzierungsdauer_in_jahren, false);

      eigenkapital_tabelle.push(eigenkapital);
      rendite_tabelle.push(rendite);
    }

    var trace = {
      x: eigenkapital_tabelle,
      y: rendite_tabelle,
      type: 'lines'
    };

    var layout = {
      title: 'Nettorendite nach eingebrachtem Eigenkapital',
      xaxis: {
        title: 'Eingebrachtes Eigenkapital in €',
      },
      yaxis: {
        title: 'Rendite p.a. in %',
        range: [-1, Math.max(...rendite_tabelle)+5],
        autorange: false
      }
    };

    Plotly.newPlot('rendite_div', [trace], layout);
  }

  /**
   * Berechne und zeige den Verlauf eines beispielhaften Annuitätendarlehns
   */
  plot_annuitaetendarlehen() {
    const zinssatz = this.zins_pro_eigenkapitalanteil(0.20);
    const tilgungssatz = this.input.tilgungsrate_pro_jahr/100.;

    const [sollzinstabelle, tilgungstabelle, restschulden] = this.compute_annuitätendarlehen_verlauf(1, 10, zinssatz, tilgungssatz);

    const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    var zinsen = {
      x: x,
      y: sollzinstabelle,
      stackgroup: 'one',
      // groupnorm:'percent',
      type: 'lines',
      name: 'Zinsen'
    };

    var tilgung = {
      x: x,
      y: tilgungstabelle,
      stackgroup: 'one',
      type: 'lines',
      name: 'Tilgung'
    };

    var layout = {
      title: 'Darlehensverlauf bei ' + (100*zinssatz).toFixed(2) + "% Zinsen und " + (100*tilgungssatz).toFixed(1) + "% Tilgung p.a.",
      xaxis: {
        title: 'Jahr',
      },
      yaxis: {
        title: 'Rückzahlrate in %',
      }
    };

    Plotly.newPlot('darlehen_div', [zinsen, tilgung], layout);
  }
}

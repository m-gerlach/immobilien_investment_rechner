import SollzinsRechner from "./sollzinsrechner.js";

export default class ReturnCalculator {
  /**
   *
   * @param {Input} input
   */
  constructor(input) {
    this.input = input;
  }

  /**
   * Plotte `zins_pro_eigenkapitalanteil()` und zeige das Ergebnis.
   */
  plot_zins_pro_eigenkapitalanteil() {
    var x = Array.from(new Array(100), (x, i) => 0+0.01*i);
    var y = x.map(SollzinsRechner.zins_pro_eigenkapitalanteil).map((i) => 100*i);

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
      },
      paper_bgcolor: 'rgba(255,255,255, 0)',
      plot_bgcolor: 'rgba(0,0,0,0.1)',
      font: {
        color: 'rgba(255,255,255,255)'
      },
      autosize: true,
    };

    Plotly.newPlot('zins_div', [trace], layout, {responsive: true});
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
    else {
      return 100./this.input.restnutzungsdauer;
    }
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
        restschulden = Math.max(restschulden - tilgung, 0);
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
   * @param {*} einkommenssteuer_grenzsatz Satz der zu zahlenden Einkommenssteuerprogression zwischen 0 und 0.42 (bzw. 0.45 bei Reichensteuer)
   * @returns Anfallende Umsatzsteuer
   */
  compute_v_und_v_einkommenssteuer(zu_versteuernder_gewinn, einkommenssteuer_grenzsatz) {
    return zu_versteuernder_gewinn * einkommenssteuer_grenzsatz;
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
    return this.input.grunderwerbssteuersatz/100. * (this.input.netto_kaufpreis - this.input.rücklagen_enthalten_in_kaufpreis - this.input.zusätzliche_enthaltente_werte_in_kaufpreis)
  }

  /**
   * @returns Gesamtes benötigtes Kapital das zum Kauf und zur Nutzbarmachung der Immobilie anfänglich benötigt wird
   */
  compute_gesamt_anschaffungspreis() {
    return this.input.netto_kaufpreis
      + (this.input.netto_kaufpreis * this.input.maklercourtage/100.)
      + (this.input.netto_kaufpreis * this.input.notarkosten/100.)
      + this.input.zusätzliche_erhaltungsaufwände
      + this.input.zusätzliche_herstellungsaufwände
      + this.compute_grunderwerbssteuer();
  }

  /**
   * Reine Erhaltungsaufwände (d.h. keine Herstellungsaufwände) sind sofort voll abzugsfähig solange sie nicht in den ersten drei Jahren nach Kauf der Immobilie 15% der über die AfA absetzbaren Anschaffungskosten (d.h. ohne Grund- und Bodenanteil) übersteigen.
   * @returns Die sofort abzugsfähige Summe aus Erhaltungsaufwänden
   */
  compute_sofort_abschreibbare_erhaltungsaufwände_beim_kauf() {
    const absetzbare_anschaffungskosten = (this.input.netto_kaufpreis * ( 1 + this.input.maklercourtage/100. + this.input.notarkosten/100. ) + this.compute_grunderwerbssteuer()) * ( 1 - this.input.grund_und_bodenwert/this.input.netto_kaufpreis );

    if(this.input.zusätzliche_erhaltungsaufwände > 0.15*absetzbare_anschaffungskosten) {
      return 0;
    }
    else {
      return this.input.zusätzliche_erhaltungsaufwände;
    }
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
   * @param {*} sollzinssatz_in_prozent Optionale Angabe des zu verwendeten Sollzinssatzes. Wenn dieser Argument nicht gegeben wird, wird er aus dem Eigenkapitalanteil ermittelt.
   * @return {*} JSON object mit dem jährlichen Verlauf und der finalen Rendite
   */
  compute_rendite_pro_jahr_mit_variablem_eigenkapital(eigenkapital, investitionsdauer, sollzinssatz_in_prozent){
    // object which is returned at the end
    var result = {
      verlauf: [],
      rendite_in_euro: 0
    };

    var anschaffungspreis = this.compute_gesamt_anschaffungspreis();

    var finanzierungsvolumen = anschaffungspreis - eigenkapital;
    if(finanzierungsvolumen < 0)
    finanzierungsvolumen = 0;

    // Either compute the sollzins from the eigenkapitalanteil or take the given function argument
    var zinssatz = 0;
    if(sollzinssatz_in_prozent == null)
      zinssatz = SollzinsRechner.zins_pro_eigenkapitalanteil(Math.max(eigenkapital - this.input.zusätzliche_erhaltungsaufwände - this.input.zusätzliche_herstellungsaufwände, 0)/this.input.netto_kaufpreis);
    else
      zinssatz = sollzinssatz_in_prozent/100.;

    const [sollzinstabelle, tilgungstabelle, restschulden] = this.compute_annuitätendarlehen_verlauf(
      finanzierungsvolumen, investitionsdauer, zinssatz, this.input.tilgungsrate_pro_jahr/100.
    );

    var sofort_abschreibbare_erhaltungsaufwände_beim_kauf = this.compute_sofort_abschreibbare_erhaltungsaufwände_beim_kauf();

    var mieteinkünfte_pro_jahr = (this.input.erwartete_jahreskaltsmiete - this.input.laufende_kosten_pro_jahr);
    var cashflow_pro_jahr = [];
    // Anteil an Grund- und Boden wird von den Gesamtanschaffungskosten abgezogen
    var grund_und_boden_anteil = this.input.grund_und_bodenwert / this.input.netto_kaufpreis;
    const abschreibbarer_gebäudewert = (anschaffungspreis*(1-grund_und_boden_anteil) - this.input.rücklagen_enthalten_in_kaufpreis - sofort_abschreibbare_erhaltungsaufwände_beim_kauf);

    // Compute progress for each year individually
    for(var jahr in [...Array(investitionsdauer).keys()]) {
      var afa = abschreibbarer_gebäudewert * this.compute_abschreibung_in_prozent(jahr)/100.;
      var zu_versteuernder_gewinn = Math.round(mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - afa);

      // Im ersten Jahr lassen sich Erhaltungsaufwände unter bestimmten Bedingungen sofort absetzen
      if(jahr == 0) {
        zu_versteuernder_gewinn = Math.round(zu_versteuernder_gewinn - sofort_abschreibbare_erhaltungsaufwände_beim_kauf);
      }

      var verlustvortragsgewinn = 0;
      var steuern = 0;
      if(zu_versteuernder_gewinn < 0 && !this.input.gewerblich_vermietet) {
        verlustvortragsgewinn = -zu_versteuernder_gewinn * this.input.einkommenssteuer_grenzsatz/100.;
      }
      else if(this.input.erwerb_durch_vermögensverwaltende_körperschaft)
        steuern = this.compute_v_und_v_körperschaftssteuer(zu_versteuernder_gewinn);
      else
        steuern = this.compute_v_und_v_einkommenssteuer(zu_versteuernder_gewinn, this.input.einkommenssteuer_grenzsatz/100.);

      var cashflow = Math.round(mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - tilgungstabelle[jahr] - steuern + verlustvortragsgewinn)
      cashflow_pro_jahr.push(cashflow)

      // Save yearly details in return object
      var jahres_verlauf = {
        "jahr": jahr,
        "v_und_v_einnahmen": Math.round(mieteinkünfte_pro_jahr),
        "finanzierungskosten": Math.round(sollzinstabelle[jahr]),
        "tilgungskosten": Math.round(tilgungstabelle[jahr]),
        "zu_versteuernder_überschuss": Math.round(mieteinkünfte_pro_jahr - sollzinstabelle[jahr]),
        "afa": Math.round(afa),
        "steuerlicher_gewinn": zu_versteuernder_gewinn ,
        "steuerabzug": steuern,
        "steuerersparnis_aus_hauptberuflichkeit": verlustvortragsgewinn,
        "cashflow": + cashflow,
      };

      if( (mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - tilgungstabelle[jahr]) == 0)
        jahres_verlauf["steuerabzug_prozentual"] = 0;
      else
        jahres_verlauf["steuerabzug_prozentual"] = 100 * steuern/(mieteinkünfte_pro_jahr - sollzinstabelle[jahr] - tilgungstabelle[jahr]);

      result.verlauf.push(jahres_verlauf);
    }

    result["anschaffungspreis_in_jahreskaltmieten"] = Math.round(this.compute_gesamt_anschaffungspreis()/this.input.erwartete_jahreskaltsmiete);
    result["investitionsdauer_in_jahren"] = investitionsdauer;
    result["restschulden"] = Math.round(restschulden);
    result["gesamtanschaffungskosten"] = this.compute_gesamt_anschaffungspreis();
    result["kreditsumme"] = finanzierungsvolumen;
    result["eigenkapital"] = eigenkapital;
    result["cashflow_pa_absolut"] = Math.round(this.sum(cashflow_pro_jahr));
    result["cashflow_pa_relativ"] = 100*this.sum(cashflow_pro_jahr)/eigenkapital/investitionsdauer;

    return result;
  }


  /**
   * Berechne die erwartete Nettorendite bei gegebenem input und variablem Eigenkapital
  */
  plot_net_return_for_variable_eigenkapital() {
    var rendite_tabelle = [];
    var eigenkapital_tabelle = [];
    var max_rendite = -1000;
    var max_details = {};

    for(var i=1; i<=100; i++){
      const eigenkapital = this.compute_gesamt_anschaffungspreis() * (i/100.);
      const details = this.compute_rendite_pro_jahr_mit_variablem_eigenkapital(eigenkapital, this.input.finanzierungsdauer_in_jahren);
      const rendite = details.cashflow_pa_relativ;

      eigenkapital_tabelle.push(eigenkapital);
      rendite_tabelle.push(rendite);

      if(rendite > max_rendite) {
        max_rendite = rendite;
        max_details = details;
      }
    }

    var trace = {
      x: eigenkapital_tabelle,
      y: rendite_tabelle,
      type: 'lines',
      line: {
        width: 3
      }
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
      },
      paper_bgcolor: 'rgba(255,255,255, 0)',
      plot_bgcolor: 'rgba(0,0,0,0.1)',
      font: {
        color: 'rgba(255,255,255,255)'
      },
      autosize: true,

      shapes: [
        {
          type: 'rect',
          xref: 'x',
          yref: 'y',
          x0: 0,
          y0: -100,
          x1: this.compute_gesamt_anschaffungspreis()-this.input.netto_kaufpreis,
          y1: 100,
          line: {
            color: 'rgb(200, 50, 0)',
            width: 0
          },
          fillcolor: 'rgba(255, 50, 0, 0.2)'
        },
      ]
    };

    Plotly.newPlot('rendite_div', [trace], layout, {responsive: true});
    Plotly.Plots.resize('rendite_div');
    document.getElementById("rendite_pro_eigenkapital_rendite_maximum").innerHTML = Number(max_rendite).toLocaleString('de-DE', { maximumFractionDigits: 1}) + "%";
    document.getElementById("rendite_pro_eigenkapital_rendite_maximum_eigenkapital").innerHTML = Number(max_details["eigenkapital"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("rendite_pro_eigenkapital_anschaffungspreis_in_jahreskaltmieten").innerHTML = Number(max_details["anschaffungspreis_in_jahreskaltmieten"]).toLocaleString('de-DE', { maximumFractionDigits: 1}) + " Jahreskaltmieten";
    document.getElementById("rendite_pro_eigenkapital_restschulden").innerHTML = Number(max_details["restschulden"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("rendite_pro_eigenkapital_gesamtanschaffungskosten").innerHTML = Number(max_details["gesamtanschaffungskosten"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("rendite_pro_eigenkapital_result").style.display = '';
  }


  /**
   * Berechne und zeige den jährlichen Verlauf eines konkreten Investments
   */
  display_timeline_for_fixed_eigenkapital() {
    const details = this.compute_rendite_pro_jahr_mit_variablem_eigenkapital(this.input.eigenkapital, this.input.finanzierungsdauer_in_jahren, this.input.sollzins);

    document.getElementById("einzelfallrechner_rendite_pa_absolut").innerHTML = Number(details["cashflow_pa_absolut"]/this.input.finanzierungsdauer_in_jahren).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("einzelfallrechner_rendite_pa_relativ").innerHTML = Number(details["cashflow_pa_relativ"]).toLocaleString('de-DE', { maximumFractionDigits: 1}) + "%";
    document.getElementById("einzelfallrechner_anschaffungspreis_in_jahreskaltmieten").innerHTML = Number(details["anschaffungspreis_in_jahreskaltmieten"]).toLocaleString('de-DE', { maximumFractionDigits: 1}) + " Jahreskaltmieten";
    document.getElementById("einzelfallrechner_restschulden").innerHTML = Number(details["restschulden"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("einzelfallrechner_gesamtanschaffungskosten").innerHTML = Number(details["gesamtanschaffungskosten"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("einzelfallrechner_kreditsumme").innerHTML = Number(details["kreditsumme"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("einzelfallrechner_result").style.display = '';

    // Zeige Warnung wenn Kaufnebenebenkosten und Instandsetzungen nicht vom Eigenkaipital gedeckt sind.
    if(this.input.eigenkapital < (this.compute_gesamt_anschaffungspreis()-this.input.netto_kaufpreis)) {
      document.getElementById("einzelfallrechner_kreditwarnung").style.display = '';
    }
    else {
      document.getElementById("einzelfallrechner_kreditwarnung").style.display = 'none';
    }

    var verlauf_content = ""

    for(var year in details.verlauf) {
      verlauf_content += "<tr>";
      verlauf_content += "<td>" + Number(year).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["v_und_v_einnahmen"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["finanzierungskosten"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["tilgungskosten"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["zu_versteuernder_überschuss"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["afa"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["steuerlicher_gewinn"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["steuerabzug"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["steuerersparnis_aus_hauptberuflichkeit"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "<td>" + Number(details.verlauf[year]["cashflow"]).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€</td>"
      verlauf_content += "</tr>";
    }

    document.getElementById("einzelfallrechner_verlauf").innerHTML = verlauf_content;
  }


  /**
   * Berechne und zeige den Verlauf eines beispielhaften Annuitätendarlehns
   */
  display_darlehensverlauf() {
    const zinssatz = this.input.darlehensrechner_sollzins/100.;
    const tilgungssatz = this.input.darlehensrechner_tilgungsrate_pro_jahr/100.;
    const kredit = this.input.darlehensrechner_kredit;

    const [sollzinstabelle, tilgungstabelle, restschulden] = this.compute_annuitätendarlehen_verlauf(kredit, 1000, zinssatz, tilgungssatz);

    var reduzierte_sollzinstabelle = [];
    var reduzierte_tilgungstabelle = [];
    var timeline = [];

    // Berechne Dauer der Rückzahung in Jahren
    var rückzahldauer = 0;
    for(var i in tilgungstabelle) {

      if(tilgungstabelle[i] <= 0) {
        rückzahldauer = i;
        break;
      }
      timeline.push(i);
      reduzierte_sollzinstabelle.push(sollzinstabelle[i]);
      reduzierte_tilgungstabelle.push(tilgungstabelle[i]);
    }

    document.getElementById("darlehensrechner_belastung_pro_jahr").innerHTML = Number(kredit*(zinssatz+tilgungssatz)).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("darlehensrechner_belastung_pro_monat").innerHTML = Number(kredit*(zinssatz+tilgungssatz)/12.).toLocaleString('de-DE', { maximumFractionDigits: 0}) + "€";
    document.getElementById("darlehensrechner_rückzahldauer").innerHTML = Number(rückzahldauer).toLocaleString('de-DE', { maximumFractionDigits: 0}) + " Jahre";
    document.getElementById("darlehensrechner_result").style.display = '';

    var zinsen = {
      x: timeline,
      y: reduzierte_sollzinstabelle,
      stackgroup: 'one',
      // groupnorm:'percent',
      type: 'lines',
      name: 'Zinsen'
    };

    var tilgung = {
      x: timeline,
      y: reduzierte_tilgungstabelle,
      stackgroup: 'one',
      type: 'lines',
      name: 'Tilgung'
    };

    var layout = {
      title: 'Darlehenrückzahlverlauf',
      xaxis: {
        title: 'Jahr',
      },
      yaxis: {
        title: 'Rückzahlrate in €',
      },
      paper_bgcolor: 'rgba(255,255,255, 0)',
      plot_bgcolor: 'rgba(0,0,0,0.1)',
      font: {
        color: 'rgba(255,255,255,255)'
      },
      autosize: true,
    };

    Plotly.newPlot('darlehen_div', [zinsen, tilgung], layout, {responsive: true});
  }
}

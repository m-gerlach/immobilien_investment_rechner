export default class SollzinsRechner {
  /**
   * @return Extrapolierter Verlauf zwischen Anteil vom Eigenkapital am Netto-Kaufpreis und effektiver Sollzins.
  */
  static zins_pro_eigenkapitalanteil(eigenkapitalanteil) {
    if(eigenkapitalanteil > 1) {
      eigenkapitalanteil = 1;
    }
    if(eigenkapitalanteil < 0) {
      console.error("zins_pro_eigenkapitalanteil(): Invalider Eigenkapitalanteil von " + eigenkapitalanteil);
      return null;
    }
    return 0.02659689753649553 * Math.exp( 0.1934918614657533 /(eigenkapitalanteil + 0.22856910809757086));
  }
}

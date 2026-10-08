class Vehiculo {

  // Propietat privada
  #preu

  // Propietat estàtica
  static IVA = 0.21


  constructor(marca, modelo, unitats, preu) {
    this.marca = marca
    this.modelo = modelo
    this.unitats = unitats
    this.#preu = preu
  }


  // Retorna el preu
  getPrecio() {
    return this.#preu
  }


  // Modifica el preu si és major que 0
  canviarPreu(nouPreu) {
    if (nouPreu > 0) {
      this.#preu = nouPreu
      return true
    }

    return false
  }


  // Calcula el valor de tot l'estoc d'aquest vehicle
  valorStock() {
    return this.unitats * this.#preu
  }


  // Calcula l'IVA d'un preu
  static calcularIVA(preu) {
    return preu * Vehicle.IVA
  }


  // Representació textual
  toString() {
    return `${this.marca} ${this.modelo}: ${this.unitats} unitats x ${this.#preu} € = ${this.valorStock()} €`
  }


  // El valor numèric del vehicle serà el valor del seu estoc
  valueOf() {
    return this.valorStock()
  }

}

export default Vehiculo
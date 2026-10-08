import Vehiculo from './Vehiculo.class.js'


class CocheElectrico extends Vehiculo {

  constructor(marca, modelo, unitats, preu, autonomia) {

    super(marca, modelo, unitats, preu)

    this.autonomia = autonomia
  }


  // Sobreescrivim toString()
  toString() {
    return `${super.toString()} - Autonomia: ${this.autonomia} km`
  }

}

export default CocheElectrico
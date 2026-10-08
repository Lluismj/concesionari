'use strict'

function vehiclesOrdenatsPerMarca(vehicles) {
  return vehicles.sort((v1, v2) => {
    return v1.marca.localeCompare(v2.marca)
  })
}


function vehiclesOrdenatsPerPreu(vehicles) {
  return vehicles.sort((v1, v2) => {
    return v1.getPrecio() - v2.getPrecio()
  })
}


function vehiclesAmbPoquesUnitats(vehicles, unitats) {
  return vehicles.filter(vehicle => {
    return vehicle.unitats < unitats
  })
}


function valorTotalConcessionari(vehicles) {
  return vehicles.reduce((total, vehicle) => {
    return total + vehicle.valorStock()
  }, 0)
}


function llistaVehicles(vehicles) {
  return vehicles
    .map(vehicle => vehicle.toString())
    .join('\n')
}


export {
  vehiclesOrdenatsPerMarca,
  vehiclesOrdenatsPerPreu,
  vehiclesAmbPoquesUnitats,
  valorTotalConcessionari,
  llistaVehicles
}
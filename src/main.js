'use strict'

import Vehiculo from "./model/Vehiculo.class.js"
import CocheElectrico from "./model/CocheElectrico.class.js"

import { 
  getDBVehiculos,
  addDBVehiculo,
  changeDBVehiculo,
  removeDBVehiculo
} from "./servces/api.js"

document.querySelector('#app').innerHTML = `
`

let vehiculos = []

function crearVehiculo(datos){
  let vehiculo;

  if(datos.tipo == 'electrico'){
    vehiculo = new CocheElectrico(
      datos.marca,
      datos.modelo,
      datos.unidades,
      datos.precio,
      datos.autonomia
    );
  }else{
    vehiculo = new Vehiculo(
      datos.marca,
      datos.modelo,
      datos.unidades,
      datos.precio
    );
  }
  vehiculo.id = datos.id
  
  return vehiculo;
}

async function iniciar() {
  try {
    await cargarVehiculos();

    console.table(vehiculos);
    console.log('Quantitat:', vehiculos.length);
  } catch (error) {
    console.error(error.message);
  }
}

async function cargarVehiculos(){
  const datos = await getDBVehiculos();

  vehiculos = datos.map(dato => crearVehiculo(dato));
}


// Funció definida per probar metode POST
async function probarPOST() {
  try {
    const datos = {
      marca: 'Toyota',
      modelo: 'Yaris de prova AJAX',
      unidades: 2,
      precio: 22003,
      tipo: 'normal'
    };

    const nuevo = await addDBVehiculo(datos);
    console.log('Vehicle guardat:', nuevo);

    await cargarVehiculos();
    console.log(vehiculos);
    console.log('Quantitat:', vehiculos.length);
  } catch (error) {
    console.error(error.message);
  }
}

// Funció definida per probar metode PUT
async function probarPUT() {
  try {
    const datos = await getDBVehiculos();

    const vehiculo = datos.find(
      dato => dato.modelo === 'Yaris de prova AJAX'
    );

    if (!vehiculo) {
      throw new Error('No s’ha trobat el vehicle de prova');
    }

    const datosModificados = {
      ...vehiculo,
      unidades: 3,
      precio: 22500
    };

    const actualizado = await changeDBVehiculo(datosModificados);
    console.log('Vehicle modificat:', actualizado);

    await cargarVehiculos();
    console.table(vehiculos);
    console.log('Quantitat:', vehiculos.length);
  } catch (error) {
    console.error(error.message);
  }
}

// Funció definida per probar metode DELETE
async function probarDELETE() {
  try {
    const datos = await getDBVehiculos();

    const vehiculo = datos.find(
      dato => dato.modelo === 'Yaris de prova AJAX'
    );

    if (!vehiculo) {
      throw new Error('No s’ha trobat el vehicle de prova');
    }

    await removeDBVehiculo(vehiculo.id);
    console.log('Vehicle eliminat:', vehiculo.id);

    await cargarVehiculos();
    console.table(vehiculos);
    console.log('Quantitat:', vehiculos.length);
  } catch (error) {
    console.error(error.message);
  }
}
iniciar();

probarDELETE();
'use strict'

import Vehiculo from "./model/Vehiculo.class.js"
import CocheElectrico from "./model/CocheElectrico.class.js"
import './style.css'

import { 
  getDBVehiculos,
  addDBVehiculo,
  changeDBVehiculo,
  removeDBVehiculo
} from "./services/api.js"

const app = document.querySelector('#app')

app.innerHTML = `
  <header>
    <h1>El meu concessionari</h1>
    <p>Catàleg de vehicles disponibles.</p>

  </header>

  <nav>
    <a href="#lista">Veure Vehicles</a>
    <a href="#alta">Afegir Vehicles</a>
    <a href="#about">Informació</a>

  </nav>

  <main>
    <div id="mensajes"></div>
    <section id="resumen">
      <h2>Resum del concessionari</h2>
      <p>Nombre de models: <span id="total-vehiculos">0</span></p>
      <p>Valor de l’estoc: <span id="valor-stock">0</span> €</p>
    </section>

    <section id="lista">
      <h2>Vehicles disponibles</h2>
      <div id="lista-vehiculos"></div>
    </section>

    <section id="alta">
      <h2>Afegir un vehicle</h2>
      <form id="form-vehiculo">
        <div>
          <label for="marca">Marca: </label>
          <input type="text" id="marca" name="marca" required>
        </div>

        <div>
          <label for="modelo">Model: </label>
          <input type="text" id="modelo" name="modelo" required>
        </div>

        <div>
          <label for="unidades">Unitats: </label>
          <input 
            type="number" 
            id="unidades" 
            name="unidades" 
            min="0"
            step="1"
            required
            >
        </div>

        <div>
          <label for="precio">Preu (€): </label>
          <input
            type="number"
            id="precio"
            name="precio"
            min="0.01"
            step="0.01"
            required
          >
        </div>

        <button type="button" id="btn-guardar">Guardar</button>
        <button type="Reset">Netejar</button>

      </form>
    </section>

    <section id="baja">
      <h2>Eliminar un vehicle</h2>
      <label for="id-eliminar">Identificador del vehicle:</label>
      <input type="text" id="id-eliminar" name="id-eliminar">

      <button type="button" id="btn-eliminar">Eliminar</button>
    </section>

    <section id="about">
      <h2>Informació</h2>
      <p>Aplicació per gestionar un concessionari.</p>
    </section>
  </main>
  <footer>
    <p>Aplicació creada per Lluís</p>
  </footer>
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

async function cargarVehiculos(){
  const datos = await getDBVehiculos();

  vehiculos = datos.map(dato => crearVehiculo(dato));
}

async function iniciar() {
  try {
    mostrarMensaje('Carregant vehicles...', 'info')

    await actualizarCatalogo()

    mostrarMensaje('Vehicles carregats', 'info')
  } catch (error) {
    mostrarMensaje(error.message, 'error')
    console.error(error.message)
  }
}

function crearTargetaVehiculo(vehiculo){
  const targeta = document.createElement('article');

  targeta.classList.add('vehiculo');
  targeta.dataset.id = vehiculo.id;
  
  const titulo = document.createElement('h3');
  titulo.textContent = `${vehiculo.marca} ${vehiculo.modelo}`

  const identificador = document.createElement('p');
  identificador.textContent = `Identificador: ${vehiculo.id}`

  const unidades = document.createElement('p');
  unidades.textContent= `Unitats disponibles: ${vehiculo.unidades}`

  const precio = document.createElement('p');
  precio.textContent = `Preu: ${vehiculo.getPrecio()} €`


  const stock = document.createElement('p');
  stock.textContent = `Valor de l'stock: ${vehiculo.valorStock()} €`

  targeta.append(titulo,identificador,unidades,precio,stock);

  if(vehiculo instanceof CocheElectrico){
    targeta.classList.add('electrico');
    
    const autonomia = document.createElement('p');
    autonomia.textContent = `Autonomia: ${vehiculo.autonomia} Km`

    targeta.append(autonomia);

  }

  if(vehiculo.unidades < 3){
    targeta.classList.add('pocas-unidades')
  }

  return targeta

}

function mostrarVehiculos(vehiculos){
  const lista = document.getElementById('lista-vehiculos');

  lista.innerHTML = '';

  if(vehiculos.length === 0){
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No hi ha vehicles disponibles';
    lista.append(mensaje)
    return;
  }

  vehiculos.forEach(vehiculo => {
    const targeta = crearTargetaVehiculo(vehiculo);
    lista.append(targeta);
  });
}

function valorTotalConcesionario(vehiculos){
  return vehiculos.reduce(
    (total,vehiculo) => total + vehiculo.valorStock(),
    0
  )
}

function actualizarResumen(vehiculos){
  const total = document.getElementById('total-vehiculos');
  const valor = document.getElementById('valor-stock');

  total.textContent = vehiculos.length;
  valor.textContent = valorTotalConcesionario(vehiculos);
}

function mostrarMensaje(texto,tipo){
  const contenidor = document.getElementById('mensajes');

  contenidor.innerHTML = '';

  const mensaje = document.createElement('p');
  mensaje.textContent = texto;
  mensaje.classList.add(tipo);

  contenidor.append(mensaje);
}

function obtenerDatosFormulario(){
  const marca = document.getElementById('marca').value.trim();
  const modelo = document.getElementById('modelo').value.trim();
  
  const textoUnidades = document.getElementById('unidades').value;
  const textoPrecio = document.getElementById('precio').value;
  

  if(marca === '' || modelo === ''){
    throw new Error('la marca i el model són obligatoris');
  }

  if(textoUnidades === '' || textoPrecio === '' ){
    throw new Error('les unitats i el preu són obligatoris');
  }

  const unidades = Number(textoUnidades);
  const precio = Number(textoPrecio);

  if (!Number.isInteger(unidades) || unidades < 0) {
    throw new Error('Les unitats han de ser un enter igual o superior a 0')
  }

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El preu ha de ser un número major que 0')
  }

  return {
    marca,
    modelo,
    unidades,
    precio,
    tipo: 'normal'
  }
}

function obtenerIdEliminar() {
  const id = document.getElementById('id-eliminar').value.trim()

  if (id === '') {
    throw new Error('Has d’indicar l’identificador del vehicle')
  }

  return id
}

async function actualizarCatalogo(){
    await cargarVehiculos();

    mostrarVehiculos(vehiculos);
    actualizarResumen(vehiculos);
}

async function agregarVehiculoDesdeFormulario(){
  let guardado = false;

  try{
    const datos = obtenerDatosFormulario();

    await addDBVehiculo(datos);
    guardado=true;

    await actualizarCatalogo()

    document.getElementById('form-vehiculo').reset();

    mostrarMensaje('Vehicle afegit correctament','info');
  }catch(error){
    if(guardado){
      mostrarMensaje('Vehicle guardat, però no s’ha pogut completar l’actualització de la pàgina','error');
    }else{
      mostrarMensaje(error.message, 'error');
    }

    console.error(error.message);
  }
}


async function eliminarVehiculoDesdeCampo() {
  let eliminado = false

  try {
    const id = obtenerIdEliminar()

    await removeDBVehiculo(id)
    eliminado = true

    await actualizarCatalogo()

    document.getElementById('id-eliminar').value = ''

    mostrarMensaje('Vehicle eliminat correctament', 'info')
  } catch (error) {
    if (eliminado) {
      mostrarMensaje(
        'Vehicle eliminat, però no s’ha pogut completar l’actualització de la pàgina',
        'error'
      )
    } else {
      mostrarMensaje(error.message, 'error')
    }

    console.error(error.message)
  }
}

await iniciar()

const botonGuardar = document.getElementById('btn-guardar');
const botonEliminar = document.getElementById('btn-eliminar');

botonGuardar.addEventListener('click',agregarVehiculoDesdeFormulario);
botonEliminar.addEventListener('click', eliminarVehiculoDesdeCampo);

// Funció definida per probar metode POST
// async function probarPOST() {
//   try {
//     const datos = {
//       marca: 'Toyota',
//       modelo: 'Yaris de prova AJAX',
//       unidades: 2,
//       precio: 22003,
//       tipo: 'normal'
//     };

//     const nuevo = await addDBVehiculo(datos);
//     console.log('Vehicle guardat:', nuevo);

//     await cargarVehiculos();
//     console.log(vehiculos);
//     console.log('Quantitat:', vehiculos.length);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// // Funció definida per probar metode PUT
// async function probarPUT() {
//   try {
//     const datos = await getDBVehiculos();

//     const vehiculo = datos.find(
//       dato => dato.modelo === 'Yaris de prova AJAX'
//     );

//     if (!vehiculo) {
//       throw new Error('No s’ha trobat el vehicle de prova');
//     }

//     const datosModificados = {
//       ...vehiculo,
//       unidades: 3,
//       precio: 22500
//     };

//     const actualizado = await changeDBVehiculo(datosModificados);
//     console.log('Vehicle modificat:', actualizado);

//     await cargarVehiculos();
//     console.table(vehiculos);
//     console.log('Quantitat:', vehiculos.length);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// // Funció definida per probar metode POST
// async function probarDELETE() {
//   try {
//     const datos = await getDBVehiculos();

//     const vehiculo = datos.find(
//       dato => dato.modelo === 'Yaris de prova AJAX'
//     );

//     if (!vehiculo) {
//       throw new Error('No s’ha trobat el vehicle de prova');
//     }

//     await removeDBVehiculo(vehiculo.id);
//     console.log('Vehicle eliminat:', vehiculo.id);

//     await cargarVehiculos();
//     console.table(vehiculos);
//     console.log('Quantitat:', vehiculos.length);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// probarDELETE();
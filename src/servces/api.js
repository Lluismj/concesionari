const SERVER = import.meta.env.VITE_URL_API;

export async function getDBVehiculos() {
    const response = await fetch(`${SERVER}/vehiculos`);

    if (!response.ok) {
        throw new Error(`Error en carregar vehicles: ${response.status}`);
    }

    return response.json();
}

export async function addDBVehiculo(datos) {
    const response = await fetch(`${SERVER}/vehiculos`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
         },
         body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new error ('Error en afegir vehicle: ${resonse.status');
    }

    return response.json();
}


export async function changeDBVehiculo(datos) {
    const response = await fetch(`${SERVER}/vehiculos/${datos.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)  
    });

    if (!response.ok) {
        throw new error ('Error en afegir vehicle: ${resonse.status');
    }

    return response.json();
}

export async function removeDBVehiculo(id){
    const response = await fetch(`${SERVER}/vehiculos/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new error ('Error en afegir vehicle: ${resonse.status');
    }
}
const yargs = require('yargs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');

// Funciones

const arrayTareas = async () => {
    try {
        let tareas = await fs.readFile('tareas.txt')
        let lista = JSON.parse(tareas)
        return lista
    } catch (error) {
        console.log('Hay problemas para acceder al archivo tareas.txt');
        console.log(error);
    }
} 

const funcionCreate = async ({titulo, contenido}) => {
    try {
        const id = uuidv4().slice(0,8);
        const nuevaTarea = { titulo: titulo, contenido: contenido, id: id };

        let tareas = await arrayTareas()
    
        tareas.push(nuevaTarea);

    await fs.writeFile('tareas.txt', JSON.stringify(tareas, null, 2))
    console.log("La nueva tarea ha sido agregada satisfactoriamente a tareas.txt");
    } catch (error) {
        console.log("No ha sido posible acceder agregar la tarea a tareas.txt");
        console.log(error);
    }
}

const funcionRead = async () => {
    try {
        
        let contador = 0;
        for (const tareas of await arrayTareas()) {
            const { titulo, contenido, id } = tareas;
            contador++
            console.log("");
            console.log(`Tarea Número: ${contador}`);
            console.log(`Título: ${titulo}`);
            console.log(`Contenido: ${contenido}`);
            console.log(`id: ${id}`);
            console.log("");
        }
    } catch (error) {
        console.log('No es posible leer el archivo tareas.txt');
    }
}

const funcionUpdate = async ({titulo, contenido, id}) => {
    try {
        const tareas = await arrayTareas()
        const tareaPorBuscar = tareas.find(tarea => tarea.id === id);
        if (tareaPorBuscar == undefined) {
            console.log('El id indicado no corresponde a ninguna tarea.');
        } else {
            const tituloNuevo = titulo ? titulo : tareaPorBuscar.titulo;
            const contenidoNuevo = contenido ? contenido : tareaPorBuscar.contenido;
        
            tareaPorBuscar.titulo = tituloNuevo;
            tareaPorBuscar.contenido = contenidoNuevo;
        
            await fs.writeFile('tareas.txt', JSON.stringify(tareas, null, 2));
            console.log('La tarea indicada ha sido actualizada satisfactoriamente.');
        }
    } catch (error) {
        console.log('No ha sido posible actualizar la tarea seleccionada');
        console.log(error);
    }
}

const funcionDelete = async ({id}) => {
    try {
        let tareas = await arrayTareas()
        const tareaPorEliminar = tareas.find(tarea => tarea.id === id);
        if(tareaPorEliminar == undefined) {
            console.log('El id indicado no corresponde a ninguna tarea');
        } else {
            const arrayCorregido = tareas.filter(tarea => tarea.id !== id)
            await fs.writeFile('tareas.txt', JSON.stringify(arrayCorregido, null, 2));
            console.log('La tarea seleccionada ha sido eliminada satisfactoriamente');
        }
    } catch (error) {
        console.log('No ha sido posible eliminar la tarea seleccionada.');
        console.log(error);
    }
}

// Configuraciones:

const configDelete = {
    id: {
        describe: "El código id o identificador de la tarea a eliminar.",
        alias: "i"
    }
}

const configUpdate = {
    titulo: {
        describe: "Nuevo nombre de la tarea",
        alias: "t",
    },
    contenido: {
        describe: "Nueva descripción de la tarea.",
        alias: "c"
    },
    id: {
        describe: "El código id o identificador de la tarea por actualizar o modificar.",
        alias: "i"
    }
}

const configCreate = {
    titulo: {
        describe: "El nombre de la tarea.",
        alias: "t",
        demandOption: true
    },
    contenido: {
        describe: "Descripción de la tarea.",
        alias: "c",
        demandOption: true
    }
}


// Declaración de argumentos

const args = yargs
.command('create', 'Crear una nueva tarea.', configCreate, (argv) => funcionCreate(argv))
.command('read', 'Mostrar todas las tareas', {}, (argv) => funcionRead())
.command('update', 'Actualizar o modificar una tarea', configUpdate, (argv) => funcionUpdate(argv))
.command('delete', 'Eliminar una tarea', configDelete, (argv) => funcionDelete(argv))
.help()
.argv
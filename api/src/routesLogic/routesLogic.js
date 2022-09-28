const { Pokemon, Type } = require('../db');
const axios = require('axios');

const getPokeApi = async (req, res) => {
    let name = req.query.name; //Guardo en la variable "name" el nombre pasado por query
    try {
        if (name !== undefined && name && name !== '') { //Valido si existe
            let pokemon = {}; //Creo un objeto "pokemon"
            pokemon = await Pokemon.findOne({ //guardo dentro del objeto vacio el output de la busqueda en la tabla intermedia
                where: { name },
                include: {
                    model: Type,
                    attributes: ['id', 'name']
                }
            })
            if (pokemon) res.json(pokemon); //Si existe respondo un json con el pokemon
            else {
                const urlName = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`); //Si no existe lo busco en la api y matcheo los datos
                if (urlName) {
                    pokemon = {
                        id: urlName.data.id,
                        name: urlName.data.name,
                        img: urlName.data.sprites.other.dream_world.front_default,
                        hp: urlName.data.stats[0].base_stat,
                        attack: urlName.data.stats[1].base_stat,
                        defense: urlName.data.stats[2].base_stat,
                        speed: urlName.data.stats[5].base_stat,
                        height: urlName.data.height,
                        weight: urlName.data.weight,
                    }
                    let types = urlName.data.types.map(el => el.type.name); //Creo variable "types" y mapeo el nombre del tipo
                    pokemon = { ...pokemon, types: types }; //despues guardo el resultado del map + todo lo anterior dentro del pokemon
                    return res.json(pokemon);
                }
            }
        }
        const urlApi = await axios.get('http://pokeapi.co/api/v2/pokemon?limit=40'); //Hago un .get() a la api con un limite de 40 pokemons, esto devuelve un array
        const db = await Pokemon.findAll({ //Creo constante "db" y busco todos los arreglos que tengan los siguientes atributos:
            attributes: ['name', 'img', 'attack', 'defense', 'id'],
            include: { //No nos olvidemos de llevarnos los tipos
                model: Type,
                attributes: ['name']
            }
        });
        let details = await Promise.all(urlApi.data.results.map(async el => await axios(el.url))); //Video de youtube que me ayudo con Promise.all y .map para los detalles de los pibitos
        details = details.map(el => {
            let newPokemon = {
                id: el.data.id,
                name: el.data.name,
                img: el.data.sprites.other.dream_world.front_default,
                attack: el.data.stats[1].base_stat,
                defense: el.data.stats[2].base_stat,
            }
            let types = el.data.types.map(el => el.type);
            types.map(el => delete el.url) //todo lo anterior aun tiene el.url y no lo quiero asique lo elimino
            return newPokemon = { ...newPokemon, types: types };
        })
        details = details.concat(db); //Concateno los detalles  a los pokemons en "db"
        return res.json(
            {
                ManyPokes: details.length, //details sigue siendo un array xd
                pokemones: details

            })
    } catch (e) {
        console.log(e)
    }
}

const getIds = async (req, res) => {
    const id = req.params.id; 
    if (!id || parseInt(id) < 0) res.status(404).json('Invalid Id'); //Si no existe un id o ese id parseado es menor que 0 respondo un 404
    try {
        if (!id.includes('-')) { //Si el id no incluye guiones entonces hago una peticion a la api de un pokemon por su id en la api
            const urlId = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            let pokemon = {
                id: urlId.data.id,
                name: urlId.data.name,
                img: urlId.data.sprites.other.dream_world.front_default,
                hp: urlId.data.stats[0].base_stat,
                attack: urlId.data.stats[1].base_stat,
                defense: urlId.data.stats[2].base_stat,
                speed: urlId.data.stats[5].base_stat,
                height: urlId.data.height,
                weight: urlId.data.weight,
            };
            let types = urlId.data.types.map(el => {
                let temp = {};
                return temp = { name: el.type.name };
            });
            pokemon = { ...pokemon, types: types }; //Lo mismo de mas arriba pero con id xd
            return res.json(pokemon);

        } else { //Si el id si tiene guiones (es un UUID) lo buscamos en la base de datos por primary key 
            const pokemon = await Pokemon.findByPk(String(id), {
                include: {
                    model: Type,
                    attributes: ['name']
                }
            });
            if (pokemon) return res.json(pokemon);
            else {
                res.status(400).json('Invalid ID')
            }
        }
    } catch (e) {
        console.log(e)
    }
};

const getTypes = async (req, res) => {
    try {
        const dbTypes = await Type.findAll({ attributes: ['name', 'id'] }); //Busco todos los que tengan esos atributos en la base de datos
        if (dbTypes.length === 0) {
            let res = await axios.get('https://pokeapi.co/api/v2/type'); //Si esta vacio hago un .get() a la api
            var types = res.data.results.map(el => { return { name: el.name } }); //mapeo y retorno el nombre del tipo
            Type.bulkCreate(types); //Creo en la tabla de tipos de mi base de datos todos los tipos encontrados al mapear
            return res.json(types);
        }
        res.json(dbTypes); //Si no estaba vacio solo devuelvo lo encontrado por el .findAll()
    } catch (e) {
        console.log(e)
    }
}

const postPokemons = async (req, res) => {
    let { name, img, hp, attack, defense, speed, height, weight, types } = req.body; //Destructuring del body
    if (!name) return res.status(404).json('Invalid Name'); //Si no existe name no se puede crear el pokemon
    name = name.toLowerCase(); 
    let newPokemon = await Pokemon.create({
        name,
        img,
        hp,
        attack,
        defense,
        speed,
        height,
        weight
    });
    newPokemon.addType(types); //la variable "types" esta declarada en getTypes() y funciona por scope
    res.json(newPokemon);
}

module.exports = { getPokeApi, getIds, postPokemons, getTypes };
const { Router } = require('express');
const router = Router();
const pokeRoutes = require('./PokeRout');
const typeRoutes = require('./TypeRout');

router.use('/pokemons', pokeRoutes);

router.use('/type', typeRoutes);

module.exports = router;
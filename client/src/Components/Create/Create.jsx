/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getTypes } from "../../Actions/actions";
import Nav from "../Nav/Nav";
import pika from '../../Imgs/pika.png'
import styles from '../Create/Create.module.css'

export default function Create() {
    const validate = (input) => {
        let error
        if (!input.name) {
            error = 'Insert Name'
        }
        return error;
    }

    async function postPokemons(a) {
        const urlLocal = await axios.post('/pokemons', a); 
        return urlLocal;
    }

    const dispatch = useDispatch();
    const [valTypes, setValTypes] = useState([]);
    const [poke, setPoke] = useState({
        name: '',
        img: pika,
        hp: 0,
        attack: 0,
        defense: 0,
        height: 0,
        weight: 0,
        speed: 0,
        types: []
    });
    const [errorName, setErrorName] = useState('');
    const [succes, setSucces] = useState('');
    const [err, setErr] = useState('');
    const [types, setTypes] = useState([]);
    const storeType = useSelector(store => store.types);


    useEffect(() => {
        dispatch(getTypes());

    }, [dispatch]);

    useEffect(() => {
        setTypes(storeType);
    }, [storeType]);

    useEffect(() => {
        setPoke({ ...poke, types: valTypes });
    }, [valTypes]);

    const send = (el, event) => {
        if (el.name !== '') {
            let res = handleSubmit(event);
            setSucces('Success');
            console.log(res);
        } else {
            event.preventDefault();
            setErr('error');
        }
    }

    const handleType = (change) => {
        if (change.target.checked) {
            setValTypes([change.target.value, ...valTypes]);
        } else {
            setValTypes(valTypes.filter(el => el !== change.target.value));
        }
    }

    const handleName = (change) => {
        setSucces('');
        setErr('');
        setPoke({ ...poke, name: change.target.value });
        setErrorName(validate({ ...poke, name: change.target.value }));
    }

    const handleHp = (change) => {
        setPoke({ ...poke, hp: change.target.value });
    }

    const handleAttack = (change) => {
        setPoke({ ...poke, attack: change.target.value });
    }

    const handleDefense = (change) => {
        setPoke({ ...poke, defense: change.target.value });
    }

    const handleWeight = (change) => {
        setPoke({ ...poke, weight: change.target.value });
    }

    const handleHeight = (change) => {
        setPoke({ ...poke, height: change.target.value });
    }

    const handleSpeed = (change) => {
        setPoke({ ...poke, speed: change.target.value })
    }

    const handleSubmit = (submit) => {
        submit.preventDefault();
        let upload = postPokemons(poke);

        setPoke({
            name: '',
            img: '',
            hp: 0,
            attack: 0,
            defense: 0,
            height: 0,
            weight: 0,
            types: []
        });
        submit.target.reset();
        return upload;
    }

    return (
        <div className={styles.bacData}>
            <Nav />
            <form onSubmit={(event) => send(poke, event)} className={styles.card}>
                <div className={styles.imgCont}>
                    <img className={styles.img} src={pika} alt='Pokemon' />
                    <div className={styles.name}>
                        <label>Name: </label>
                        <input className={styles.inputName} type='string' onChange={handleName} placeholder='Name' value={poke.name} name='name' />
                        {errorName && <h2 className={styles.error}>{errorName}</h2>}
                    </div>
                </div>
                <div className={styles.stats}>
                    <label>Stats:</label>
                    <div className={styles.hpDiv}>
                        <label>Life Points: </label>
                        <input className={styles.inputHp} type='number' onChange={handleHp} value={poke.hp} name='hp' min='0' />
                    </div>
                    <div className={styles.attackDiv}>
                        <label>Attack: </label>
                        <input className={styles.inputAttack} type='number' onChange={handleAttack} value={poke.attack} name='attack' min='0' />
                    </div>
                    <div className={styles.defenseDiv}>
                        <label>Defense: </label>
                        <input className={styles.inputDefense} type='number' onChange={handleDefense} value={poke.defense} name='defense' min='0' />
                    </div>
                    <div className={styles.heightDiv}>
                        <label>Height: </label>
                        <input className={styles.inputHeight} type='number' onChange={handleHeight} value={poke.height} name='height' min='0' />
                    </div>
                    <div className={styles.weightDiv}>
                        <label>Weight: </label>
                        <input className={styles.inputWeight} type='number' onChange={handleWeight} value={poke.weight} name='weight' min='0' />
                    </div>
                    <div className={styles.speedDiv}>
                        <label>Speed: </label>
                        <input className={styles.inputSpeed} type='number' onChange={handleSpeed} value={poke.speed} name='speed' min='0' />
                    </div>
                    <div className={styles.typesDiv}>
                        <div className={styles.divt}>
                            <div>
                                {
                                    types.map((el, j) =>
                                        <span className={styles.typeDiv} key={j}>
                                            <input className={styles.tName} type='radio' onChange={handleType} value={el.id} id={el.id} />
                                            {el.name}
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.succes}>{succes && <h2>CREATED SUCCESFULLY</h2>}</div>
                <div className={styles.errorC}>{err && <h2>OOPS... WE COULDN'T CREATE YOUR POKEMON. MAKE SURE YOU COMPLETE ALL THE FIELDS.</h2>}</div>
                <input type='submit' value='CREATE!' className={styles.btn} />
            </form>
        </div>
    )
};
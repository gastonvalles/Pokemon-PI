/*eslint-disable */
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getPokemons, getTypes, filterByType, filterIfCreated, filterByName, orderByName, orderByAttack } from "../../Actions/actions";
import styles from './Home.module.css'
import Pokemons from "../Pokemons/Pokemons";
import Paged from "../Paged/Paged";
import Nav from "../Nav/Nav";
// import { Link } from 'react-router-dom'

export default function Home() {
    const dispatch = useDispatch();
    var allPokes = useSelector(store => store.pokemons);
    const [currentPage, setCurrentPage] = useState(1);
    const [PokesPerPage, setPokesPerPage] = useState(9);
    const [stateName, setStateName] = useState('');
    const indexOfLastPoke = currentPage * PokesPerPage;
    const indefOfFirstPoke = indexOfLastPoke - PokesPerPage;
    const currentPokes = allPokes.slice(indefOfFirstPoke, indexOfLastPoke)


    const paged = page => {
        return setCurrentPage(page);
    };

    useEffect(() => {
        dispatch(getPokemons());
    }, [dispatch]); //component didMount

    function handleFilterType(click) {
        click.preventDefault();
        dispatch(filterByType(click.target.value));
        setCurrentPage(1);
    };

    function handleFilterCreated(click) {
        click.preventDefault();
        dispatch(filterIfCreated(click.target.value));
        setCurrentPage(1);
    };

    function handleOrder(click) {
        // click.preventDefault();
        dispatch(orderByName(click.target.value));
        setCurrentPage(1);
    };

    function handleAttack(click) {
        // click.preventDefault();
        dispatch(orderByAttack(click.target.value));
        setCurrentPage(1);
    };

    function handleChange(e) {
        e.preventDefault();
        setStateName((e.target.value).toLowerCase());
        dispatch(filterByName((e.target.value).toLowerCase()));
        setCurrentPage(1);
    };

    return (
        <div className={styles.page}>
            <div className={styles.col}>
                <div className={styles.nav}>
                    <Nav stateName={stateName} handleAttack={handleAttack} handleChange={handleChange} handleOrder={handleOrder} handleFilterCreated={handleFilterCreated} handleFilterType={handleFilterType} />
                </div>
                <div>
                    <Paged PokesPerPage={PokesPerPage} allPokemons={allPokes.length} paged={paged} />
                </div>
                <div className={styles.group}>
                    <Pokemons list={currentPokes} />
                </div>
                <div className={styles.o}>
                    <Paged PokesPerPage={PokesPerPage} allPokemons={allPokes.length} paged={paged} />
                </div>
            </div>
        </div>
    )
};
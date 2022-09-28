import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import styles from './Nav.module.css';

export default function Nav({ stateName, handleAttack, handleChange, handleOrder, handleFilterCreated, handleFilterType }) {
    return (
        <nav className={styles.nav}>
            <Link to='/home' className={styles.btn}/>
            <SearchBar stateName={stateName} handleChange={handleChange} />
            <div className={styles.container}>
                <select onChange={click => handleOrder(click)} className={styles.select}>
                    <option value='alpha'>A - Z</option>
                    <option value='asc'>Ascendant</option>
                    <option value='desc'>Descendant</option>
                </select>
                <select onChange={click => handleAttack(click)} className={styles.select}>
                    <option value='oa'>Attack Order</option>
                    <option value='ascA'>Attack Desc</option>
                    <option value='descA'>Attack Asc</option>
                </select>
                <select onChange={click => handleFilterCreated(click)} className={styles.select}>
                    <option value='all'>Existents</option>
                    <option value='created'>Created</option>
                </select>
                <select onChange={click => handleFilterType(click)} className={styles.select}>
                    <option value='all'>All</option>
                    <option value='grass'>Grass</option>
                    <option value='poison'>Poison</option>
                    <option value='fire'>Fire</option>
                    <option value='flying'>Flying</option>
                    <option value='water'>Water</option>
                    <option value='bug'>Bug</option>
                    <option value='normal'>Normal</option>
                    <option value='electric'>Electric</option>
                    <option value='ground'>Ground</option>
                    <option value='fairy'>Fairy</option>
                    <option value='rock'>Rock</option>
                    <option value='ghost'>Ghost</option>
                    <option value='steel'>Steel</option>
                    <option value='psychic'>Psychic</option>
                    <option value='ice'>Ice</option>
                    <option value='dragon'>Dragon</option>
                    <option value='stedarkel'>Stedarkel</option>
                    <option value='shadow'>Shadow</option>
                    <option value='unknown'>Unknown</option>
                </select>
            </div>
            <Link to='/create' className={styles.create}>Create Pokemons</Link>
        </nav>
    )
};
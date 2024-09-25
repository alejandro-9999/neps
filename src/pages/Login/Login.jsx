import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Login.css';
import logo from '../../assets/cabezote-nueva-eps.png'; // Importa la imagen aquí
import JSEncrypt from 'jsencrypt';
import { fetchUser } from '../../redux/actions/sessionActions';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('externo');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const session = useSelector((state) => state.session);

    const encryptPassword = (password) => {

        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(import.meta.env.VITE_REACT_APP_ENCRYP_KEY);
        const encryptedPassword = encryptor.encrypt(password);
        return encryptedPassword;

    }

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        
        
        try {
            dispatch(fetchUser({
                tipoUsuario: userType,
                username: username,
                password: encryptPassword(password)
            }));
        } catch (err) {
            setError('Usuario o clave incorrectos');
        } finally {
            setLoading(false);
        }
    };


    useEffect(()=>{
        setLoading(session.loading);
    },[session])


    useEffect(()=>{
        setError(session.error);
    },[session.error])

    return (
        <div className='body-login-container'>
            <img src={logo} alt="Nueva EPS" className="logo-eps" />

            <div className="login-container">
                <div className="login-form">

                    <h2>Portal Auditoria Médica</h2>
                    <div className="p-field">
                        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                    </div>
                    <div className="p-field">
                        <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    </div>
                    <div className='user-type'>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="externo" name="userType" value="Externo" onChange={(e) => setUserType(e.value)} checked={userType === 'Externo'} />
                            <label htmlFor="externo">Externo</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="interno" name="userType" value="Interno" onChange={(e) => setUserType(e.value)} checked={userType === 'Interno'} />
                            <label htmlFor="interno">Interno</label>
                        </div>
                    </div>
                    {error && <small className="p-error">{error}</small>}
                    <br />
                    <br />
                    <Button label="Iniciar sesión" icon="pi pi-user" loading={loading} onClick={handleLogin} />
                    <br /><br />
                    <br />
                    <small> <b>Copyright</b> NuevaEPS © 2023 </small>

                </div>
            </div>
        </div>

    );
};

console.log("golang");
export default Login;

import * as React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordInput, TextInput } from "@ui/inputs/TextInput.tsx";
import AuthContext, { type AuthContextType } from "@context/AuthContext";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import styles from "./Login.module.css";
import Loader from "@components/UI/loader";

export const Login: React.FC = (): React.ReactElement => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { login }: AuthContextType = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Пожалуйста, введите email и пароль");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                navigate("/");
            } else {
                setError("Неверный email или пароль");
            }
        } catch (err) {
            setError("Произошла ошибка при входе. Пожалуйста, попробуйте снова.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            {loading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <div className={styles.loginFormContainer}>
                <h1 className={styles.loginFormTitle}>Вход</h1>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <TextInput
                        name={"email"}
                        placeholder={"введите email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                    <PasswordInput
                        name={"password"}
                        placeholder={"*******"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                    />
                    <SubmitButton
                        value={loading ? "Загрузка..." : "Войти"}
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    );
}

import React, {type ChangeEvent, useContext, useState} from "react";
import styles from './OperationCreate.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate} from "react-router-dom";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import {TextInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import dayjs from "dayjs";

export const OperationCreate: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;

    const [type, setType] = useState<string>("");
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
    const [table, setTable] = useState<string>("");
    const [oldValue, setOldValue] = useState<string>("");
    const [newValue, setNewValue] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const operationData = {
            type,
            date,
            table,
            oldValue: oldValue ? JSON.parse(oldValue) : null,
            newValue: newValue ? JSON.parse(newValue) : null,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/operations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(operationData)
            });
            if (!response.ok) {
                throw new Error("Failed to create operation");
            }
            navigate("/operations");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.operationCreatePage}>
            <NavBar page={"operations"} current={"operations/create"} />
            <form className={styles.creationForm} onSubmit={handleSubmit}>
                <TextInput
                    className={styles.textInput}
                    placeholder={"Тип"}
                    value={type}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    type="date"
                    placeholder={"Дата"}
                    value={date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Таблица"}
                    value={table}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTable(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Старое значение (JSON)"}
                    value={oldValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOldValue(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Новое значение (JSON)"}
                    value={newValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
                />
                <SubmitButton value={"Сохранить"} disabled={isLoading} />
            </form>
        </div>
    );
};
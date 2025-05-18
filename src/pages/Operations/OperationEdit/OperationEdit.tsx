import React, {type ChangeEvent, useContext, useEffect, useState} from "react";
import styles from './OperationEdit.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import {TextInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import Loader from "@components/UI/loader";
import type {Operation, OperationDetail} from "@types/Operations.ts";
import dayjs from "dayjs";

export const OperationEdit: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;
    const {id} = useParams<{id: string}>();

    const [type, setType] = useState<string>("");
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
    const [table, setTable] = useState<string>("");
    const [oldValue, setOldValue] = useState<string>("");
    const [newValue, setNewValue] = useState<string>("");

    const navigate = useNavigate();

    const fetchOperation = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/operations/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch operation");
            }

            const responseData = await response.json();
            const operationData = responseData.data || responseData;

            setType(operationData.type);
            setDate(dayjs(operationData.date).format("YYYY-MM-DD"));
            if (operationData.table) {
                setTable(operationData.table);
            }
            if (operationData.oldValue) {
                setOldValue(JSON.stringify(operationData.oldValue));
            }
            if (operationData.newValue) {
                setNewValue(JSON.stringify(operationData.newValue));
            }
        } catch (error) {
            console.error(error);
            navigate("/operations");
        } finally {
            setIsLoading(false);
        }
    };

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/operations/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(operationData)
            });
            if (!response.ok) {
                throw new Error("Failed to update operation");
            }
            navigate("/operations");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOperation();
    }, []);

    return (
        <div className={styles.operationEditPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBar page={"operations"} current={"operations"} />
            <form className={styles.editForm} onSubmit={handleSubmit}>
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
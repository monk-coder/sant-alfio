import React, {type ChangeEvent, useContext, useState} from "react";
import styles from './ReportCreate.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate} from "react-router-dom";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import {TextInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import dayjs from "dayjs";

export const ReportCreate: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;

    const [file, setFile] = useState<string>("");
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const reportData = {
            file,
            date,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(reportData)
            });
            if (!response.ok) {
                throw new Error("Failed to create report");
            }
            navigate("/reports");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.reportCreatePage}>
            <NavBar page={"reports"} current={"reports/create"} />
            <form className={styles.creationForm} onSubmit={handleSubmit}>
                <TextInput
                    className={styles.textInput}
                    placeholder={"Файл"}
                    value={file}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    type="date"
                    placeholder={"Дата"}
                    value={date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                />
                <SubmitButton value={"Сохранить"} disabled={isLoading} />
            </form>
        </div>
    );
};
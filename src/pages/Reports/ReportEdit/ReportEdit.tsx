import React, {type ChangeEvent, useContext, useEffect, useState} from "react";
import styles from './ReportEdit.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import {TextInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import Loader from "@components/UI/loader";
import type {Report} from "@types/Reports.ts";
import dayjs from "dayjs";

export const ReportEdit: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;
    const {id} = useParams<{id: string}>();

    const [file, setFile] = useState<string>("");
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

    const navigate = useNavigate();

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch report");
            }

            const responseData = await response.json();
            const reportData = responseData.data || responseData;

            setFile(reportData.file);
            setDate(dayjs(reportData.date).format("YYYY-MM-DD"));
        } catch (error) {
            console.error(error);
            navigate("/reports");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const reportData = {
            file,
            date,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(reportData)
            });
            if (!response.ok) {
                throw new Error("Failed to update report");
            }
            navigate("/reports");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div className={styles.reportEditPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBar page={"reports"} current={"reports"} />
            <form className={styles.editForm} onSubmit={handleSubmit}>
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
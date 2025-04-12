import { useParams } from "react-router-dom";
import GetAllAppointmentResultsByAppointmentIdFetchAsync from "../api/Appointments.API/GetAllAppointmentResultsByAppointmentIdFetchAsync";
import { useEffect, useState } from "react";
import GetAllDoctorsFetchAsync from "../api/Profiles.API/GetAllDoctorsFetchAsync";
import Toolbar from "../components/organisms/Toolbar";
import Loader from "../components/organisms/Loader";
import Table from "../components/organisms/Table";
import FieldNames from "../enums/FieldNames";
import GetPatientByAccountIdFromTokenFetchAsync from "../api/Profiles.API/GetPatientByAccountIdFromTokenFetchAsync";
import { IconBase } from "../components/atoms/IconBase";
import CreateAppointmentResultDocumentFetchAsync from "../api/Documents.API/CreateAppointmentResultDocumentFetchAsync";

export default function AppointmentResults() {
    const { appointmentId } = useParams();

    const [patient, setPatient] = useState(null);
    const [doctors, setDoctors] = useState([]);

    const [appointmentResults, setAppointmentResults] = useState([]);
    const [editableAppointmentResults, setEditableAppointmentResults] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'date',
        'patientFullName',
        'dateOfBirth',
        'doctorFullName',
        'specialization',
        'medicalServiceName',
        'complaints',
        'conclusion',
        'diagnosis',
        'recommendations',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedAppointmentResults = await GetAllAppointmentResultsByAppointmentIdFetchAsync(appointmentId);
                setAppointmentResults(fetchedAppointmentResults);

                const fetchedPatient = await GetPatientByAccountIdFromTokenFetchAsync();
                setPatient(fetchedPatient);

                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);

                const formattedAppointmentResults = formatAppointmentResults(fetchedAppointmentResults, fetchedPatient, fetchedDoctors);
                setEditableAppointmentResults(formattedAppointmentResults);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatAppointmentResults = (appointmentResults, patient, doctors) => {
        return appointmentResults.map(({ id, appointment, complaints, conclusion, diagnosis, recommendations }) => ({
            id,
            date: appointment.date,
            patientFullName: `${appointment.patient.firstName} ${appointment.patient.lastName} ${appointment.patient.middleName}`,
            dateOfBirth: patient.dateOfBirth,
            doctorFullName: `${appointment.doctor.firstName} ${appointment.doctor.lastName} ${appointment.doctor.middleName}`,
            specialization: doctors.find(doctor => doctor.id === appointment.doctor.id).specialization.specializationName,
            medicalServiceName: appointment.medicalService.serviceName,
            complaints,
            conclusion,
            recommendations,
            diagnosis,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const handleDownloadAppointmentsResults = async (appointmentResultId) => {
        const appointmentResult = editableAppointmentResults.find(appointmentResult => appointmentResult.id === appointmentResultId);
        
        const createAppoimentResultDocumentRequest = {
            date: appointmentResult.date,
            patientFullName: appointmentResult.patientFullName,
            dateOfBirth: appointmentResult.dateOfBirth,
            doctorFullName: appointmentResult.doctorFullName,
            specialization: appointmentResult.specialization,
            medicalServiceName: appointmentResult.medicalServiceName,
            complaints: appointmentResult.complaints,
            conclusion: appointmentResult.conclusion,
            recommendations: appointmentResult.recommendations,
            diagnosis: appointmentResult.diagnosis,
        }

        await CreateAppointmentResultDocumentFetchAsync(createAppoimentResultDocumentRequest);
    }

    return (
        <>
            <Toolbar
                pageTitle="Appointment Results"
            />
            {isLoading ? (<Loader />
            ) : (
                <>
                    <div className="page">
                        {appointmentResults.length === 0 ? (
                            <p className="no-items">Appointment Results not found</p>
                        ) : (
                            <>
                                {editableAppointmentResults.length === 0 && (
                                    <p className="no-items">Nothing was found</p>
                                )}
                                {editableAppointmentResults.length > 0 && (
                                    <div className="table">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    {columnNames.map(columnName => (
                                                        <th key={columnName}>{FieldNames[columnName]}</th>
                                                    ))}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editableAppointmentResults.map(appointmentResult => (
                                                    <tr>
                                                        {columnNames.map(columnName => (
                                                            <td key={columnName}>{appointmentResult[columnName]}</td>
                                                        ))}
                                                        <td>
                                                            <IconBase
                                                                name='bx-download'
                                                                onClick={() => handleDownloadAppointmentsResults(appointmentResult.id)}
                                                            />
                                                        </td>
                                                    </tr>

                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
} 
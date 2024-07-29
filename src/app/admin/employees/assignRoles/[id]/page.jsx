"use client"
import React, { useState, useEffect } from 'react';
import Header from '@/app/admin/components/Header';
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import LinkingWithSidebar from '../../../components/secondLayer/LinkingWithSidebar';
import { decodeJWT } from "../../../components/DecodeJWT";

function Page({ params }) {
    const router = useRouter();
    const id = params.id;
    const [employeeData, setEmployeeData] = useState({ name: "", mail: "", adminAssignedRoles: [] });
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        const decodedData = decodeJWT();
        console.log("decodedData: ", decodedData);
        if (!(decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee"))) {
            router.push("../../../auth/login");
        }

        const getUserRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${id}`);
                // console.log("Employee data: ", response.data.data);
                const employeeData = response.data.data;

                if (employeeData) {
                    const allRoles = await axios.get(`http://localhost:5000/api/roles`);
                    const roles = allRoles.data;
                    // console.log("roles: ", roles);

                    setRoles(roles);

                    setEmployeeData({
                        name: employeeData.name,
                        mail: employeeData.mail,
                        adminAssignedRoles: employeeData.adminAssignedRoles
                    });

                    setSelectedRoles(employeeData.adminAssignedRoles);
                }
            } catch (error) {
                console.log("error", error);
            }
        }

        getUserRecord();
    }, [id]);

    const handleRoleChange = (roleName) => {
        setSelectedRoles((prevSelectedRoles) =>
            prevSelectedRoles.includes(roleName)
                ? prevSelectedRoles.filter((role) => role !== roleName)
                : [...prevSelectedRoles, roleName]
        );
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = {
            roles: selectedRoles,
        };

        try {
            const response = await axios.put(`http://localhost:5000/api/employee/roles/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    router.push("./../../../../admin/employees/list");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response ? error.response.data.message : "An error occurred",
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <LinkingWithSidebar />
            <div className="flex-1 overflow-auto bg-gray-100">
                <Header />
                <div className='p-6'>
                    <div className='mx-auto max-w-[860px]'>
                        <h1 className='text-2xl font-semibold text-center'>Update Employee Record</h1>
                        <div className="bg-white shadow-md rounded px-8 pb-8 mb-4 py-4 mt-2">
                            <div className='mb-4'>
                                <p className="text-xl font-medium">Name: {employeeData.name}</p>
                                <p className="text-xl font-medium">Email: {employeeData.mail}</p>
                            </div>
                            <form onSubmit={handleUpdate} name="employeeForm" id="employeeForm" method="post">
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                                    {roles.map((role, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`role-${index}`}
                                                name={`role-${index}`}
                                                value={role.name}
                                                checked={selectedRoles.includes(role.name)}
                                                onChange={() => handleRoleChange(role.name)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`role-${index}`} className="text-gray-700">
                                                {role.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit">
                                        Update Roles
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
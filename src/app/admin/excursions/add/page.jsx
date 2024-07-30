"use client";
import React, { useState,useEffect } from 'react';
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LinkingWithSidebar from '../../components/LinkingWithSidebar';
import { decodeJWT } from "../../components/DecodeJWT";

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        address: {
            country: "",
            region: "",
            city: "",
            street: "",
            house: "",
            building: "",
        },
        thumbs: [],
        departure: "",
        arrival: "",
        description: "",
        howToWork: "",
        typeOfVisit: "",
        duration: "",
        withGuider: false,
        withBus: false,
        ticketPrice: "",
        priceFor: [{ sortByAge: "", price: "" }],
        excursionType: "",
        keypoints: [],
        consider: [],
        program: [{ description: "", duration: 0 }],  // Initialize with an empty object
        start: []
    });
    const [keypointsOptions, setKeypointsOptions] = useState([]);

    useEffect(() => {
        const decodedData = decodeJWT();
        if (!(decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee"))) {
            router.push("../../auth/login");
        }

        // Fetch keypoints options from API
        const fetchKeypoints = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/excursions/keypoints");
                setKeypointsOptions(response.data); // Assuming response.data is an array of keypoints
            } catch (error) {
                console.error("Error fetching keypoints:", error);
            }
        };

        fetchKeypoints();
    }, [router]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            setFormData(prev => ({ ...prev, [name]: [...files] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePriceForChange = (index, event) => {
        const { name, value } = event.target;
        const newPriceFor = [...formData.priceFor];
        newPriceFor[index] = { ...newPriceFor[index], [name]: value };
        setFormData(prev => ({ ...prev, priceFor: newPriceFor }));
    };

    const addPriceFor = () => {
        setFormData(prev => ({
            ...prev,
            priceFor: [...prev.priceFor, { sortByAge: "", price: "" }]
        }));
    };

    const handleKeypointsChange = (e) => {
        // Get currently selected options
        const selectedOptions = Array.from(e.target.selectedOptions, option => ({
            label: option.label,
            color: option.dataset.color
        }));
    
        // Get existing keypoints
        const existingKeypoints = formData.keypoints;
    
        // Combine existing keypoints with newly selected ones
        const updatedKeypoints = [...existingKeypoints, ...selectedOptions]
            .filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.label === value.label
                ))
            );
    
        setFormData(prev => ({ ...prev, keypoints: updatedKeypoints }));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Logging the form data
        console.log("Form Data: ", formData);

        setLoading(false);
    };

    const handleConsiderChange = (index, event) => {
        const newConsider = [...formData.consider];
        newConsider[index] = event.target.value;
        setFormData(prev => ({ ...prev, consider: newConsider }));
    };
    
    const addConsider = () => {
        setFormData(prev => ({ ...prev, consider: [...prev.consider, ""] }));
    };

    const handleStartChange = (index, event) => {
        const newStart = [...formData.start];
        newStart[index] = Number(event.target.value);
        setFormData(prev => ({ ...prev, start: newStart }));
    };
    
    const addStart = () => {
        setFormData(prev => ({ ...prev, start: [...prev.start, 0] }));
    };

    const handleProgramChange = (index, event) => {
        const { name, value } = event.target;
        const newProgram = [...formData.program];
        newProgram[index] = { ...newProgram[index], [name]: value };
        setFormData(prev => ({ ...prev, program: newProgram }));
    };
    
    const addProgram = () => {
        setFormData(prev => ({ ...prev, program: [...prev.program, { description: "", duration: 0 }] }));
    };
    
    const removeProgram = (index) => {
        const newProgram = [...formData.program];
        newProgram.splice(index, 1);
        setFormData(prev => ({ ...prev, program: newProgram }));
    };

    
    return (
        <>
            <ToastContainer />
            <div className="flex flex-col md:flex-row h-screen">
                <LinkingWithSidebar />
                <div className="flex-1 overflow-auto bg-gray-100">
                    <Header />
                    <div className='p-1'>
                        <div className='mx-auto max-w-[800px] mt-12'>
                            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-12 pb-4 mb-4 py-2 mt-2">
                                <h1 className='text-2xl font-medium text-center pb-7 text-gray-800'>Add Excursions</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Title */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="title">Title</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="title"
                                            id="title"
                                            onChange={handleChange}
                                            placeholder="Enter title"
                                            value={formData.title}
                                        />
                                    </div>

                                    {/* Country */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="address-country">Country</label>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="address-country"
                                            id="address-country"
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                address: { ...prev.address, country: e.target.value }
                                            }))}
                                            value={formData.address.country}
                                        >
                                            <option value="">Select Country</option>
                                            <option value="Russia">Russia</option>
                                            <option value="Abkhazia">Abkhazia</option>
                                        </select>
                                    </div>

                                    {/* Region */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="address-region">Region</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="address-region"
                                            id="address-region"
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                address: { ...prev.address, region: e.target.value }
                                            }))}
                                            placeholder="Enter region"
                                            value={formData.address.region}
                                        />
                                    </div>

                                    {/* City */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="address-city">City</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="address-city"
                                            id="address-city"
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                address: { ...prev.address, city: e.target.value }
                                            }))}
                                            placeholder="Enter city"
                                            value={formData.address.city}
                                        />
                                    </div>

                                    {/* Street */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="address-street">Street</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="address-street"
                                            id="address-street"
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                address: { ...prev.address, street: e.target.value }
                                            }))}
                                            placeholder="Enter street"
                                            value={formData.address.street}
                                        />
                                    </div>

                                    {/* House */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="address-house">House</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="address-house"
                                            id="address-house"
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                address: { ...prev.address, house: e.target.value }
                                            }))}
                                            placeholder="Enter house"
                                            value={formData.address.house}
                                        />
                                    </div>

                                    {/* Building */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="address-building">Building</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="address-building"
                                            id="address-building"
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                address: { ...prev.address, building: e.target.value }
                                            }))}
                                            placeholder="Enter building"
                                            value={formData.address.building}
                                        />
                                    </div>

                                    {/* Departure */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="departure">Departure</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="departure"
                                            id="departure"
                                            onChange={handleChange}
                                            placeholder="Enter departure time"
                                            value={formData.departure}
                                        />
                                    </div>

                                    {/* Arrival */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="arrival">Arrival</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="arrival"
                                            id="arrival"
                                            onChange={handleChange}
                                            placeholder="Enter arrival time"
                                            value={formData.arrival}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="description">Description</label>
                                        <textarea
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="description"
                                            id="description"
                                            onChange={handleChange}
                                            placeholder="Enter description"
                                            value={formData.description}
                                        />
                                    </div>

                                    {/* How to Work */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="howToWork">How to Work</label>
                                        <textarea
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="howToWork"
                                            id="howToWork"
                                            onChange={handleChange}
                                            placeholder="Enter how to work details"
                                            value={formData.howToWork}
                                        />
                                    </div>

                                    {/* Type of Visit */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="typeOfVisit">Type of Visit</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="typeOfVisit"
                                            id="typeOfVisit"
                                            onChange={handleChange}
                                            placeholder="Enter type of visit"
                                            value={formData.typeOfVisit}
                                        />
                                    </div>

                                    {/* Duration */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="duration">Duration</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="duration"
                                            id="duration"
                                            onChange={handleChange}
                                            placeholder="Enter duration"
                                            value={formData.duration}
                                        />
                                    </div>

                                    {/* With Guider */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="withGuider">With Guider</label>
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            name="withGuider"
                                            id="withGuider"
                                            onChange={handleChange}
                                            checked={formData.withGuider}
                                        />
                                    </div>

                                    {/* With Bus */}
                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="withBus">With Bus</label>
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            name="withBus"
                                            id="withBus"
                                            onChange={handleChange}
                                            checked={formData.withBus}
                                        />
                                    </div>

                                    {/* Ticket Price */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="ticketPrice">Ticket Price</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="ticketPrice"
                                            id="ticketPrice"
                                            onChange={handleChange}
                                            placeholder="Enter ticket price"
                                            value={formData.ticketPrice}
                                        />
                                    </div>

                                    {/* Price For */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2">Price For</label>
                                        {formData.priceFor.map((item, index) => (
                                            <div key={index} className="flex gap-4 mb-4">
                                                <input
                                                    type="text"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="sortByAge"
                                                    placeholder="Sort by Age"
                                                    value={item.sortByAge}
                                                    onChange={(e) => handlePriceForChange(index, e)}
                                                />
                                                <input
                                                    type="text"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="price"
                                                    placeholder="Price"
                                                    value={item.price}
                                                    onChange={(e) => handlePriceForChange(index, e)}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addPriceFor}
                                        >
                                            Add More Price For
                                        </button>
                                    </div>

                                    {/* Excursion Type */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="excursionType">Excursion Type</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="excursionType"
                                            id="excursionType"
                                            onChange={handleChange}
                                            placeholder="Enter excursion type"
                                            value={formData.excursionType}
                                        />
                                    </div>

                                    {/* Thumbs */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="thumbs">Thumbnails</label>
                                        <input
                                            type="file"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="thumbs"
                                            id="thumbs"
                                            onChange={handleChange}
                                            multiple
                                        />
                                    </div>

                                    {/* Keypoints */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="keypoints">Keypoints</label>
                                        <select
                                            multiple
                                            id="keypoints"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-4"
                                            onChange={handleKeypointsChange}
                                            value={formData.keypoints.map(kp => kp.label)}
                                        >
                                            {keypointsOptions.map((option, index) => (
                                                <option
                                                    key={index}
                                                    value={option.label}
                                                    data-color={option.color}  
                                                >
                                                   {option.label} 
                                                </option>
                                                
                                            ))}
                                        </select>
                                    </div>

                                    {/* Display selected keypoints with colors */}
                                    <div className="flex flex-col col-span-2 mt-4">
                                        <label className="block text-gray-700 text-base font-semibold mb-2">Selected Keypoints</label>
                                        <ul>
                                            {formData.keypoints.map((keypoint, index) => (
                                                <li key={index} className="flex items-center">
                                                    <span
                                                        className="w-4 h-4 rounded-full inline-block mr-2"
                                                        style={{ backgroundColor: keypoint.color }}
                                                    ></span>
                                                    {keypoint.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2">Consider</label>
                                        {formData.consider.map((item, index) => (
                                            <div key={index} className="flex gap-4 mb-4">
                                                <input
                                                    type="text"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    placeholder="Enter consider item"
                                                    value={item}
                                                    onChange={(e) => handleConsiderChange(index, e)}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addConsider}
                                        >
                                            Add More Consider
                                        </button>
                                    </div>
                                    {/* Program */}
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2">Program</label>
                                        {formData.program.map((item, index) => (
                                            <div key={index} className="flex flex-col mb-4 gap-4">
                                                <input
                                                    type="text"
                                                    name="description"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    placeholder="Enter description"
                                                    value={item.description}
                                                    onChange={(e) => handleProgramChange(index, e)}
                                                />
                                                <input
                                                    type="number"
                                                    name="duration"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    placeholder="Enter duration"
                                                    value={item.duration}
                                                    onChange={(e) => handleProgramChange(index, e)}
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 mt-2 rounded"
                                                    onClick={() => removeProgram(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addProgram}
                                        >
                                            Add More Program
                                        </button>
                                    </div>

                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2">Start</label>
                                        {formData.start.map((item, index) => (
                                            <div key={index} className="flex gap-4 mb-4">
                                                <input
                                                    type="number"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    placeholder="Enter start value"
                                                    value={item}
                                                    onChange={(e) => handleStartChange(index, e)}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addStart}
                                        >
                                            Add More Start
                                        </button>
                                    </div>



                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;

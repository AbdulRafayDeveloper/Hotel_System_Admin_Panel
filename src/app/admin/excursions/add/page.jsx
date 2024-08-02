"use client";
import React, { useState, useEffect } from 'react';
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
    const [keyPointsOptions, setkeyPointsOptions] = useState([]);
    const [categoriesOptions, setCategory] = useState([]);

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
        typeOfVisit: {
            typeOf: "",
            maxPeople: 0
        },
        duration: "",
        withGuider: false,
        withBus: false,
        ticketPrice: 0,
        priceFor: [{ sortByAge: "", price: "" }],
        excursionType: "",
        keyPoints: [],
        consider: [""],
        program: [{ description: "", duration: 0 }],
        start: [0],
        categories: [],
        goodPlaces: [{ "title": "", "description": "" }],
        goodPlaceThumbs: [],
        priceDetail: {
            include: [""],
            uninclude: [""]
        }
    });

    useEffect(() => {
        const decodedData = decodeJWT();
        if (!(decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee"))) {
            router.push("../../auth/login");
        }

        // Fetch keyPoints options from API
        const fetchkeyPoints = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/excursions/keyPoints");
                setkeyPointsOptions(response.data);
            } catch (error) {
                console.error("Error fetching keyPoints:", error);
            }
        };

        // Fetch categories from API
        const fetchCategory = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/excursions/categories");
                const labels = response.data.map(item => item.label);
                setCategory(labels);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchkeyPoints();
        fetchCategory();
    }, [router]);

    const handleThumbfileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFormData(prev => ({
            ...prev,
            thumbs: [...prev.thumbs, ...newFiles]
        }));
    };

    const handleGoodPlaceChange = (index, e) => {
        const { name, value } = e.target;
        const updatedGoodPlaces = [...formData.goodPlaces];
        updatedGoodPlaces[index] = { ...updatedGoodPlaces[index], [name]: value };
        setFormData(prev => ({ ...prev, goodPlaces: updatedGoodPlaces }));
    };

    const handleThumbChange = (index, e) => {
        const file = e.target.files[0];
        const updatedThumbs = [...formData.goodPlaceThumbs];
        updatedThumbs[index] = file;
        setFormData(prev => ({ ...prev, goodPlaceThumbs: updatedThumbs }));
    };

    const addGoodPlace = () => {
        setFormData(prev => ({
            ...prev,
            goodPlaces: [...prev.goodPlaces, { "title": "", "description": "" }],
            goodPlaceThumbs: [...prev.goodPlaceThumbs, null],
        }));
    };

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

    // Update a specific item in the include or uninclude arrays
    const handlePriceDetailChange = (arrayName, arrayIndex, value) => {
        setFormData(prev => ({
            ...prev,
            priceDetail: {
                ...prev.priceDetail,
                [arrayName]: prev.priceDetail[arrayName].map((item, i) =>
                    i === arrayIndex ? value : item
                )
            }
        }));
    };

    // Add a new entry to include and uninclude arrays
    const addPriceDetail = () => {
        setFormData(prev => ({
            ...prev,
            priceDetail: {
                include: [...prev.priceDetail.include, ""],
                uninclude: [...prev.priceDetail.uninclude, ""]
            }
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => {
            const updatedCategories = [
                ...new Set([
                    ...prev.categories,
                    ...selectedOptions
                ])
            ];
            return { ...prev, categories: updatedCategories };
        });
    };

    const handleTicketOfVisitChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            typeOfVisit: {
                ...prev.typeOfVisit,
                [name]: value
            }
        }));
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

    const handleStartChange = (index, event) => {
        const newStart = [...formData.start];
        newStart[index] = event.target.value;
        setFormData(prev => ({ ...prev, start: newStart }));
    };

    const addStart = () => {
        setFormData(prev => ({ ...prev, start: [...prev.start, ""] }));
    };

    const removeStart = (index) => {
        const newStart = formData.start.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, start: newStart }));
    };

    // Handler for input change
    const handleConsiderChange = (index, event) => {
        const newConsider = [...formData.start];
        newConsider[index] = event.target.value;
        setFormData(prev => ({ ...prev, consider: newConsider }));
    };

    const addConsider = () => {
        setFormData(prev => ({ ...prev, consider: [...prev.consider, ""] }));
    };

    const removeConsider = (index) => {
        const newConsider = formData.consider.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, consider: newConsider }));
    };

    const handlekeyPointsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => ({
            label: option.label,
            color: option.dataset.color
        }));

        const existingkeyPoints = formData.keyPoints;
        const updatedkeyPoints = [...existingkeyPoints, ...selectedOptions]
            .filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.label === value.label
                ))
            );

        setFormData(prev => ({ ...prev, keyPoints: updatedkeyPoints }));
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

    // Prepare data for submission
    // const formDataToSend = new FormData();
    // formDataToSend.append('title', formData.title);
    // formDataToSend.append('address', (formData.address));
    // formDataToSend.append('thumbs', formData.thumbs);
    // formDataToSend.append('departure', formData.departure);
    // formDataToSend.append('arrival', formData.arrival);
    // formDataToSend.append('description', formData.description);
    // formDataToSend.append('howToWork', formData.howToWork);
    // formDataToSend.append('typeOfVisit', (formData.typeOfVisit));
    // formDataToSend.append('duration', formData.duration);
    // formDataToSend.append('withGuider', formData.withGuider);
    // formDataToSend.append('withBus', formData.withBus);
    // formDataToSend.append('ticketPrice', formData.ticketPrice);
    // formDataToSend.append('priceFor', (formData.priceFor));
    // formDataToSend.append('excursionType', formData.excursionType);
    // formDataToSend.append('keyPoints', (formData.keyPoints));
    // formDataToSend.append('consider', (formData.consider));
    // formDataToSend.append('program', (formData.program));
    // formDataToSend.append('start', (formData.start));
    // formDataToSend.append('categories', (formData.categories));

    /*formData.goodPlaces.forEach((place, index) => {
        formDataToSend.append(`goodPlaces[${index}][title]`, place.title);
        formDataToSend.append(`goodPlaces[${index}][description]`, place.description);
        if (formData.goodPlaceThumbs[index]) {
            formDataToSend.append(`goodPlaceThumbs[${index}]`, formData.goodPlaceThumbs[index]);
        }
    });*/

    // formDataToSend.append('priceDetail', (formData.priceDetail));
    // console.log('Form title:', formData.title)
    // console.log('FormData: ', formDataToSend.title)
    // console.log("data thumbs", formData.thumbs)
    // console.log("data thumbs", formData.goodPlaceThumbs)
    // Send POST request

    // let errorMessage = "";

    // Validate required fields and default values
    /* if (!formData.title || !formData.address.country || !formData.address.region || !formData.address.city ||
         !formData.address.street || !formData.address.house || !formData.address.building ||
         formData.duration === "" || formData.withGuider === undefined || formData.withBus === undefined ||
         formData.ticketPrice === null || formData.excursionType === "" ||
         formData.keyPoints.length === 0 || formData.consider.length === 0 ||
         formData.start.length === 0 || formData.priceFor.length === 0 || formData.program.length === 0  || formData.priceDetail.include.length === 0 || 
         formData.priceDetail.uninclude.length === 0) {
         
         isValid = false;
         errorMessage = "Please fill in all required fields.";
     }*/

    //formData.goodPlaces.length === 0

    // Validate goodPlaces and goodPlaceThumbs
    /* formData.goodPlaces.forEach((place, index) => {
         if (!place.title || !place.description || !formData.goodPlaceThumbs[index]) {
             isValid = false;
             errorMessage = "Each good place must have a title, description, and thumbnail.";
         }
     });
 
     // Validate priceDetail include and uninclude
     formData.priceDetail.include.forEach((include) => {
         if (include && formData.priceDetail.uninclude.length === 0) {
             isValid = false;
             errorMessage = "If any include is added in price details, there must be at least one uninclude.";
         }
     });
 */

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (isValid) {
            try {
                setLoading(true);

                const submissionData = new FormData();
                formData.thumbs.forEach((file, index) => {
                    submissionData.append('thumbs', file);
                });

                submissionData.append('title', JSON.stringify(formData.title));
                submissionData.append('address', JSON.stringify(formData.address));
                submissionData.append('goodPlaces', JSON.stringify(formData.goodPlaces));

                formData.goodPlaceThumbs.forEach((file) => {
                    submissionData.append('goodPlaceThumbs', file);
                });

                submissionData.append('priceDetail', JSON.stringify(formData.priceDetail));
                submissionData.append('categories', JSON.stringify(formData.categories));
                submissionData.append('departure', JSON.stringify(formData.departure));
                submissionData.append('arrival', JSON.stringify(formData.arrival));
                submissionData.append('description', JSON.stringify(formData.description));
                submissionData.append('howToWork', JSON.stringify(formData.howToWork));
                submissionData.append('typeOfVisit', JSON.stringify(formData.typeOfVisit));
                submissionData.append('duration', formData.duration);
                submissionData.append('withGuider', JSON.stringify(formData.withGuider));
                submissionData.append('withBus', JSON.stringify(formData.withBus));
                submissionData.append('ticketPrice', formData.ticketPrice);
                submissionData.append('priceFor', JSON.stringify(formData.priceFor));
                submissionData.append('excursionType', JSON.stringify(formData.excursionType));
                submissionData.append('keyPoints', JSON.stringify(formData.keyPoints));
                submissionData.append('consider', JSON.stringify(formData.consider));
                submissionData.append('program', JSON.stringify(formData.program));
                submissionData.append('start', JSON.stringify(formData.start));

                submissionData.forEach((value, key) => {
                    console.log(key, value);
                });

                const response = await axios.post("http://localhost:5000/api/excursions", submissionData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log(response);
                Swal.fire('Success!', "Form Submitted successfully", 'success');

            } catch (error) {
                console.error("Error submitting form:", error);
                Swal.fire('Error!', "Form Not submitted", 'error');
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire('Error!', errorMessage, 'error');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col md:flex-row h-screen">
                <LinkingWithSidebar />
                <div className="flex-1 overflow-auto bg-gray-100">
                    <Header />
                    <div className='p-1'>
                        <div className='mx-auto max-w-[1000px] mt-12'>
                            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-12 pb-4 mb-4 py-2 mt-2" encType='multipart/form-data' method='post'>
                                <h1 className='text-2xl font-medium text-center pb-7 text-gray-800 pt-4'>Add Excursions</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                    <div className="flex flex-col mb-4">
                                        <h2 className="text-md font-semibold mb-2 text-gray-800">Add Good Place</h2>
                                        {formData.goodPlaces.map((place, index) => (
                                            <div key={index} className="flex flex-col mb-4">
                                                <div className="flex flex-col mb-2">
                                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor={`title-${index}`}>Title</label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id={`title-${index}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={place.title}
                                                        onChange={(e) => handleGoodPlaceChange(index, e)}
                                                        placeholder="Enter title"
                                                    />
                                                </div>
                                                <div className="flex flex-col mb-2">
                                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor={`description-${index}`}>Description</label>
                                                    <textarea
                                                        name="description"
                                                        id={`description-${index}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={place.description}
                                                        onChange={(e) => handleGoodPlaceChange(index, e)}
                                                        placeholder="Enter description"
                                                    />
                                                </div>
                                                <div className="flex flex-col mb-2">
                                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor={`thumb-${index}`}>Thumbnail</label>
                                                    <input
                                                        type="file"
                                                        name="thumb"
                                                        id={`thumb-${index}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        onChange={(e) => handleThumbChange(index, e)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                                            onClick={addGoodPlace}>
                                            Add Another Good Place
                                        </button>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="thumbs">Thumbnails</label>
                                        <input
                                            type="file"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="thumbs"
                                            id="thumbs"
                                            onChange={handleThumbfileChange}
                                            multiple
                                        />
                                        <div className="mt-4">
                                            {formData.thumbs.length > 0 && (
                                                <ul className="list-disc pl-5">
                                                    {formData.thumbs.map((file, index) => (
                                                        <li key={index} className="text-gray-700">{file.name}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <h2 className="text-md font-semibold mb-2 text-gray-800">Add Price Details</h2>

                                        <div className="flex flex-col mb-2">
                                            <label className="block text-gray-700 text-base font-semibold mb-2">Include</label>
                                            {formData.priceDetail.include.map((include, i) => (
                                                <div key={i} className="flex items-center mb-2">
                                                    <input
                                                        type="text"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={include}
                                                        onChange={(e) => handlePriceDetailChange("include", i, e.target.value)}
                                                        placeholder="Enter Include"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col mb-2">
                                            <label className="block text-gray-700 text-base font-semibold mb-2">Uninclude</label>
                                            {formData.priceDetail.uninclude.map((uninclude, i) => (
                                                <div key={i} className="flex items-center mb-2">
                                                    <input
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={uninclude}
                                                        onChange={(e) => handlePriceDetailChange("uninclude", i, e.target.value)}
                                                        placeholder="Enter Uninclude"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="bg-green-500 text-white px-4 py-2 rounded shadow mt-4"
                                            onClick={addPriceDetail}
                                        >
                                            Add Detail Entry
                                        </button>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="categories">Categories</label>
                                        <select
                                            multiple
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="categories"
                                            id="categories"
                                            onChange={handleCategoryChange}
                                            value={formData.categories}
                                        >
                                            {categoriesOptions.map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="mt-4">
                                            <h2 className="text-lg font-semibold text-gray-800">Selected Categories:</h2>
                                            <ul className="list-disc pl-5 mt-2">
                                                {formData.categories.length > 0 ? (
                                                    formData.categories.map((category, index) => (
                                                        <li key={index} className="text-gray-700">
                                                            {category}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500">No categories selected</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

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

                                    <div className="flex flex-col mb-4">
                                        <h2 className="text-md font-semibold mb-2 text-gray-800">Ticket Of Visit</h2>

                                        <div className="flex flex-col mb-2">
                                            <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="ticketTypeOf">Type Of</label>
                                            <input
                                                type="text"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="ticketTypeOf"
                                                name="typeOf"
                                                value={formData.typeOfVisit.typeOf}
                                                onChange={handleTicketOfVisitChange}
                                                placeholder="Enter type of ticket"
                                            />
                                        </div>

                                        <div className="flex flex-col mb-2">
                                            <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="ticketMaxPeople">Max People</label>
                                            <input
                                                type="number"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="ticketMaxPeople"
                                                name="maxPeople"
                                                value={formData.typeOfVisit.maxPeople}
                                                onChange={handleTicketOfVisitChange}
                                                placeholder="Enter max number of people"
                                            />
                                        </div>
                                    </div>

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

                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="ticketPrice">Ticket Price</label>
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="ticketPrice"
                                            id="ticketPrice"
                                            onChange={handleChange}
                                            placeholder="Enter ticket price"
                                            value={formData.ticketPrice}
                                        />
                                    </div>

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

                                    {/* Extra fields */}

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
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="keyPoints">keyPoints</label>
                                        <select
                                            multiple
                                            id="keyPoints"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-4"
                                            onChange={handlekeyPointsChange}
                                            value={formData.keyPoints.map(kp => kp.label)}
                                        >
                                            {keyPointsOptions.map((option, index) => (
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
                                    <div className="flex flex-col col-span-2 mt-4">
                                        <label className="block text-gray-700 text-base font-semibold mb-2">Selected keyPoints</label>
                                        <ul>
                                            {formData.keyPoints.map((keypoint, index) => (
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
                                                    type="number"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    placeholder="Enter start value"
                                                    value={item}
                                                    onChange={(e) => handleConsiderChange(index, e)}
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                                    onClick={() => removeConsider(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addConsider}
                                        >
                                            Add More Fields
                                        </button>
                                    </div>

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
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                                    onClick={() => removeStart(index)}
                                                >
                                                    Remove
                                                </button>
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
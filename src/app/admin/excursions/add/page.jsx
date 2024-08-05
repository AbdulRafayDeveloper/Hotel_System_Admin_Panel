"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LinkingWithSidebar from '../../components/LinkingWithSidebar';
import { decodeJWT } from "../../components/DecodeJWT";
import 'select2/dist/css/select2.min.css';
import 'select2';

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
            typeof: "",
            maxPeople: 0
        },
        duration: 0,
        withGuider: false,
        withBus: false,
        ticketPrice: 0,
        priceFor: { adult: 0, child: 0, retired: 0, student: 0 },
        excursionType: "",
        keyPoints: [],
        consider: [0],
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
        validateForm(formData)
    };

    const handleGoodPlaceChange = (index, e) => {
        const { name, value } = e.target;
        const updatedGoodPlaces = [...formData.goodPlaces];
        updatedGoodPlaces[index] = { ...updatedGoodPlaces[index], [name]: value };
        setFormData(prev => ({ ...prev, goodPlaces: updatedGoodPlaces }));
        validateForm(formData)
    };

    const handleThumbChange = (index, e) => {
        const file = e.target.files[0];
        const updatedThumbs = [...formData.goodPlaceThumbs];
        updatedThumbs[index] = file;
        setFormData(prev => ({ ...prev, goodPlaceThumbs: updatedThumbs }));
        validateForm(formData)
    };

    const addGoodPlace = () => {
        setFormData(prev => ({
            ...prev,
            goodPlaces: [...prev.goodPlaces, { "title": "", "description": "" }],
            goodPlaceThumbs: [...prev.goodPlaceThumbs, null],
        }));
        validateForm(formData)
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

    }

    useEffect(() => {
        validateForm(formData);
    }, [formData]);


    const validateForm = (formData) => {

        let isValid = true

        if (!formData.title || formData.title === "") {
            isValid = false;
            errors.title = "Fill in the title";
        } else {
            errors.title = "";
            newErrors.title = ""
        }

        if (!formData.excursionType) {
            isValid = false;
            errors.excursionType = "Fill in the excursion type";
        } else {
            errors.excursionType = "";
            newErrors.excursionType = ""
        }

        if (formData.address.country === "" || formData.address.country === "default") {
            isValid = false;
            console.log(formData.address.country)

            errors['address.country'] = "Fill in the country"
        } else {
            errors['address.country'] = "";


        }

        if (!formData.departure || formData.departure === "") {
            isValid = false;
            errors.departure = "Fill in the departure";
        } else {
            errors.departure = "";
        }

        if (!formData.arrival || formData.arrival === "") {
            isValid = false;
            errors.arrival = "Fill in the arrival";
        } else {
            errors.arrival = "";
        }

        if (!formData.description || formData.description.length < 100) {
            isValid = false;
            errors.description = 'Description must be at least 100 characters long.';
        } else {
            errors.description = '';
        }

        if (!formData.duration || formData.duration <= 0) {
            isValid = false;
            errors.duration = "Fill in a valid duration";
        } else {
            errors.duration = "";
        }

        if (!formData.ticketPrice || formData.ticketPrice <= 0) {
            isValid = false;
            errors.ticketPrice = "Fill in a valid ticket price";
        } else {
            errors.ticketPrice = "";
        }

        if (!formData.thumbs || formData.thumbs.length < 5) {
            isValid = false;
            errors['thumbs'] = '';
        } else {
            errors['thumbs'] = '';
        }

        if (!formData.categories || formData.categories.length === 0) {
            isValid = false;
            errors.categories = "Select at least one category";
        } else {
            errors.categories = "";
        }

        if (formData.goodPlaces && Array.isArray(formData.goodPlaces)) {
            formData.goodPlaces.forEach((place, index) => {
                if (!place.title) {
                    errors[`goodPlaces[${index}].title`] = 'Title is required.';
                    isValid = false;
                } else {
                    errors[`goodPlaces[${index}].title`] = '';
                }

                if (!place.description) {
                    errors[`goodPlaces[${index}].description`] = 'Description is required.';
                    isValid = false;
                } else {
                    errors[`goodPlaces[${index}].description`] = '';
                }
            });
        } else {
            newErrors['goodPlaces'] = 'The goodPlaces field must be an array.';
            isValid = false;
        }

        if (!formData.goodPlaces?.description) {
            isValid = false;
            errors.gooddesrip = "Add at least one good place";
        } else {
            errors.gooddesrip = "";
        }

        if (formData.goodPlaces.length !== formData.goodPlaceThumbs.length) {
            errors['goodPlaceThumbs'] = 'Please upload a thumbnail for each good place.';
            isValid = false;
        }

        // Ensure no thumbnail is missing
        for (let i = 0; i < formData.goodPlaceThumbs.length; i++) {
            if (!formData.goodPlaceThumbs[i]) {
                errors['goodPlaceThumbs'] = 'Please upload a thumbnail for each good place.';
                isValid = false;
                break;
            }
        }

        if (!formData.keyPoints || formData.keyPoints.length === 0) {
            isValid = false;
            errors['keyPoints'] = 'Select Keypoints';
        } else {
            errors['keyPoints'] = '';
        }

        return isValid
    }

    const handlePriceForChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            priceFor: {
                ...prevState.priceFor,
                [name]: parseFloat(value) || 0
            }
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

        setFormData(prev => {

            const categoriesSet = new Set(prev.categories);
            const updatedCategories = selectedOptions.reduce((acc, option) => {
                if (categoriesSet.has(option)) {
                    categoriesSet.delete(option);
                } else {

                    categoriesSet.add(option);
                }
                return Array.from(categoriesSet);
            }, [...prev.categories]);

            validateForm(formData)
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

    const handleConsiderChange = (index, event) => {
        const newconsider = [...formData.consider];
        newconsider[index] = event.target.value;
        setFormData(prev => ({ ...prev, consider: newconsider }));
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

        setFormData(prev => {

            const existingLabels = new Set(prev.keyPoints.map(kp => kp.label));
            const selectedLabels = new Set(selectedOptions.map(kp => kp.label));

            const updatedKeyPoints = prev.keyPoints.filter(kp => !selectedLabels.has(kp.label))
                .concat(selectedOptions.filter(option => !existingLabels.has(option.label)));

            return { ...prev, keyPoints: updatedKeyPoints };
        });
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

    const removeGoodPlace = (index) => {
        setFormData(prev => ({
            ...prev,
            goodPlaces: prev.goodPlaces.filter((_, i) => i !== index),
        }));
    };

    const handlePriceDetailChange = (type, index, value) => {
        const updatedArray = [...formData.priceDetail[type]];
        updatedArray[index] = value;
        setFormData({
            ...formData,
            priceDetail: {
                ...formData.priceDetail,
                [type]: updatedArray
            }
        });
    };

    const addPriceDetail = () => {
        setFormData({
            ...formData,
            priceDetail: {
                include: [...formData.priceDetail.include, ""],
                uninclude: [...formData.priceDetail.uninclude, ""]
            }
        });
    };

    const removePriceDetail = (index) => {
        const updatedInclude = formData.priceDetail.include.filter((_, i) => i !== index);
        const updatedUninclude = formData.priceDetail.uninclude.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            priceDetail: {
                include: updatedInclude,
                uninclude: updatedUninclude
            }
        });
    };

    const handleCountry = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                address: {
                    ...prev.address,
                    country: value
                }
            };

            validateForm(updatedFormData);

            return updatedFormData;
        });
    };

    const [errors, setErrors] = useState({
        title: "",
        region: "",
        city: "",
        street: "",
        house: "",
        building: "",
        departure: "",
        arrival: "",
        description: "",
        howToWork: "",
        typeof: "",
        maxPeople: "",
        duration: "",
        ticketPrice: "",
        excursionType: "",
        'keyPoints': "",
        categories: "",
        'goodPlaceThumbs': "",
        building: "",
        city: "",
        country: "",
        description: "",
        house: "",
        maxPeople: "",
        region: "",
        street: "",
        typeof: "",
        'address.country': "",
        'goodPlaces': "",
        'thumbs': ""
    });
    let [newErrors, setnew] = useState({ ...errors })

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        handleChange(e)

        const requiredFields = [
            'title',
            'departure',
            'arrival',
            'description',
            'duration',
            'ticketPrice',
            'excursionType',
            'keyPoints',
            'categories',
            'goodPlaceThumbs',
            'address.country',
            'goodPlaces',
            'thumbs'
        ];

        // Check required fields
        requiredFields.forEach((field) => {
            const fieldParts = field.split('.');
            let value = formData;
            fieldParts.forEach(part => {
                value = value && value[part];
            });

            if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && !Object.keys(value).length)) {
                isValid = false;
                newErrors[field] = 'This field is required.';
            } else {
                newErrors[field] = '';
                newErrors.field = ""
            }
        });

        if (formData.goodPlaces && Array.isArray(formData.goodPlaces)) {
            formData.goodPlaces.forEach((place, index) => {
                if (!place.title) {
                    isValid = false;
                    newErrors[`goodPlaces[${index}].title`] = 'Title is required.';
                } else {
                    newErrors[`goodPlaces[${index}].title`] = '';
                }

                if (!place.description) {
                    isValid = false;
                    newErrors[`goodPlaces[${index}].description`] = 'Description is required.';
                } else {
                    newErrors[`goodPlaces[${index}].description`] = '';
                }
            });
        } else {
            isValid = false;
            newErrors['goodPlaces'] = 'The goodPlaces field must be an array.';
        }

        if (!formData.goodPlaceThumbs || formData.goodPlaceThumbs.length === 0) {
            isValid = false;
            newErrors['goodPlaceThumbs'] = 'Upload at least one thumbnail for good places.';
        } else {
            newErrors['goodPlaceThumbs'] = '';
        }

        if (!formData.thumbs || formData.thumbs.length < 5) {
            isValid = false;
            newErrors['thumbs'] = 'Upload at least 5 thumbnails for good places.';
        } else {
            newErrors['thumbs'] = '';
        }

        if (!formData.description || formData.description.length < 100) {
            isValid = false;
            newErrors['description'] = 'Description must be at least 100 characters long.';
        } else {
            newErrors['description'] = '';
        }

        if (!formData.keyPoints || formData.keyPoints.length === 0) {
            isValid = false;
            newErrors['keyPoints'] = 'Select keypoints';
        } else {
            newErrors['keyPoints'] = '';
        }

        // Check numeric fields
        const numericFields = ['duration', 'ticketPrice'];
        numericFields.forEach((field) => {
            const value = formData[field];
            if (isNaN(value) || value <= 0) {
                isValid = false;
                newErrors[field] = 'Please enter a valid number greater than zero.';
            } else {
                newErrors[field] = '';
            }
        });

        if (formData.goodPlaces.length !== formData.goodPlaceThumbs.length) {
            errors['goodPlaceThumbs'] = 'Please upload a thumbnail for each good place.';
            isValid = false;
        }

        // Ensure no thumbnail is missing
        for (let i = 0; i < formData.goodPlaceThumbs.length; i++) {
            if (!formData.goodPlaceThumbs[i]) {
                newErrors['goodPlaceThumbs'] = 'Please upload a thumbnail for each good place.';
                isValid = false;
                break;
            }
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                setLoading(true);

                const submissionData = new FormData();
                formData.thumbs.forEach((file, index) => {
                    submissionData.append('thumbs', file);
                });

                submissionData.append('title', formData.title);
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

                if (response.data.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.data.message,
                    }).then(() => {
                        router.push("./../../admin/excursions/list");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.data.message,
                    });
                }
            } catch (error) {
                Swal.fire('Error!', "Form Not submitted", 'error');
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire('Error!', 'PLease resolve all the errors', 'error');
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
                                        <label className="block text-gray-700 text-base font-semibold mb-[13.9px]" htmlFor="title">Title <span className='text-red-600'>*</span></label>

                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="title"
                                            id="title"
                                            onChange={handleChange}
                                            placeholder="Enter title"
                                            value={formData.title}
                                        />
                                        {newErrors.title && <p className="text-red-700 text-sm">{newErrors.title}</p>}

                                    </div>
                                    <div className="flex flex-col space-y-4">
                                        <h2 className="text-medium font-medium text-gray-800 ">Address Information</h2>
                                        <div className="flex flex-col">
                                            <select
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                name="address-country"
                                                id="address-country"
                                                onChange={handleCountry}
                                                value={formData.address.country}
                                            >
                                                <option value="">Select Country <span className='text-red-600'>*</span></option>
                                                <option value="Russia">Russia</option>
                                                <option value="Abkhazia">Abkhazia</option>
                                            </select>

                                            {newErrors['address.country'] && <p className="text-red-700 text-sm">{newErrors['address.country']}</p>}

                                        </div>
                                        <div className="flex flex-col">

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
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <h2 className="text-md font-semibold mb-2 text-gray-800">Add Good Place <span className='text-red-600'>*</span></h2>
                                        {formData.goodPlaces.map((place, index) => (
                                            <div key={index} className="flex flex-col mb-4  p-4 ">
                                                <div className="flex flex-col mb-2">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id={`title-${index}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={place.title}
                                                        onChange={(e) => handleGoodPlaceChange(index, e)}
                                                        placeholder="Enter title"
                                                    />
                                                    {newErrors[`goodPlaces[${index}].title`] && <p className="text-red-700 text-sm">{newErrors[`goodPlaces[${index}].title`]}</p>}
                                                </div>
                                                <div className="flex flex-col mb-2">
                                                    <textarea
                                                        name="description"
                                                        id={`description-${index}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={place.description}
                                                        onChange={(e) => handleGoodPlaceChange(index, e)}
                                                        placeholder="Enter description"
                                                    />
                                                    {newErrors[`goodPlaces[${index}].description`] && <p className="text-red-700 text-sm">{newErrors[`goodPlaces[${index}].description`]}</p>}
                                                </div>
                                                <div className="flex flex-col mb-2">
                                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor={`thumb-${index}`}>Good Place Thumbnail</label>
                                                    <input
                                                        type="file"
                                                        name="thumb"
                                                        id={`thumb-${index}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        onChange={(e) => handleThumbChange(index, e)}
                                                    />
                                                    {newErrors['goodPlaceThumbs'] && <p className="text-red-700 text-sm">{newErrors['goodPlaceThumbs']}</p>}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white px-4 py-2 rounded shadow mt-2"
                                                    onClick={() => removeGoodPlace(index)}
                                                >
                                                    Remove Good Place
                                                </button>
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
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="thumbs">Thumbnails <span className='text-red-600'>*</span></label>
                                        <input
                                            type="file"
                                            className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="thumbs"
                                            id="thumbs"
                                            onChange={handleThumbfileChange}
                                            multiple
                                        />
                                        {newErrors['thumbs'] && <p className="text-red-700 text-sm">{newErrors['thumbs']}</p>}
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
                                        <div>
                                            <div className="flex flex-col mb-2">
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
                                                <div className="flex flex-col mb-2">
                                                    {formData.priceDetail.uninclude.map((uninclude, i) => (
                                                        <div key={i} className="flex items-center mb-2">
                                                            <input
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                value={uninclude}
                                                                onChange={(e) => handlePriceDetailChange("uninclude", i, e.target.value)}
                                                                placeholder="Enter Uninclude"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="ml-4 bg-red-500 text-white px-2 py-1 rounded shadow"
                                                                onClick={() => removePriceDetail(i)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
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
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="categories">Categories <span className='text-red-600'>*</span></label>
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
                                        {newErrors.categories && <p className="text-red-700 text-sm">{newErrors.categories}</p>}

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
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="departure">Departure <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="departure"
                                            id="departure"
                                            onChange={handleChange}
                                            placeholder="Enter departure time"
                                            value={formData.departure}
                                        />
                                        {newErrors.departure && <p className="text-red-700 text-sm">{newErrors.departure}</p>}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="arrival">Arrival <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="arrival"
                                            id="arrival"
                                            onChange={handleChange}
                                            placeholder="Enter arrival time"
                                            value={formData.arrival}
                                        />
                                        {newErrors.arrival && <p className="text-red-700 text-sm">{newErrors.arrival}</p>}
                                    </div>

                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="description">Description <span className='text-red-600'>*</span></label>
                                        <textarea
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="description"
                                            id="description"
                                            onChange={handleChange}
                                            placeholder="Enter description"
                                            value={formData.description}
                                        />
                                        {newErrors.description && <p className="text-red-700 text-sm">{newErrors.description}</p>}
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
                                        <h2 className="text-md font-semibold mb-2 text-gray-800">Type Of Visit</h2>
                                        <div className="flex flex-col mb-2">
                                            <input
                                                type="text"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="ticketTypeOf"
                                                name="typeof"
                                                value={formData.typeOfVisit.typeof}
                                                onChange={handleTicketOfVisitChange}
                                                placeholder="Enter type of ticket" />
                                        </div>

                                        <div className="flex flex-col mb-2">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="ticketMaxPeople">Max People</label>
                                            <input
                                                type="number"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="ticketMaxPeople"
                                                name="maxPeople"
                                                value={formData.typeOfVisit.maxPeople}
                                                onChange={handleTicketOfVisitChange}
                                                placeholder="Enter max number of people" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="duration">Duration <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="duration"
                                            id="duration"
                                            onChange={handleChange}
                                            placeholder="Enter duration"
                                            value={formData.duration} />
                                        {newErrors.duration && <p className="text-red-700 text-sm">{newErrors.duration}</p>}
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <label
                                            className="text-gray-700 text-base font-semibold mr-6"
                                            htmlFor="withGuider">
                                            With Guider
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            name="withGuider"
                                            id="withGuider"
                                            onChange={handleChange}
                                            checked={formData.withGuider} />
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <label
                                            className="text-gray-700 text-base font-semibold mr-6"
                                            htmlFor="withBus">
                                            With Bus
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            name="withBus"
                                            id="withBus"
                                            onChange={handleChange}
                                            checked={formData.withBus} />
                                    </div>
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="ticketPrice">Ticket Price <span className='text-red-600'>*</span></label>
                                    <div className="flex flex-col col-span-2">
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="ticketPrice"
                                            id="ticketPrice"
                                            onChange={handleChange}
                                            placeholder="Enter ticket price"
                                            value={formData.ticketPrice} />
                                        {newErrors.ticketPrice && <p className="text-red-700 text-sm">{newErrors.ticketPrice}</p>}
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="adult"
                                            id="adultPrice"
                                            onChange={handlePriceForChange}
                                            value={formData.priceFor.adult || ''}
                                            placeholder="Enter price for adults" />
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="child"
                                            id="childPrice"
                                            onChange={handlePriceForChange}
                                            value={formData.priceFor.child || ''}
                                            placeholder="Enter price for children" />
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="retired"
                                            id="retiredPrice"
                                            onChange={handlePriceForChange}
                                            value={formData.priceFor.retired || ''}
                                            placeholder="Enter price for retired" />
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="student"
                                            id="studentPrice"
                                            onChange={handlePriceForChange}
                                            value={formData.priceFor.student || ''}
                                            placeholder="Enter price for students" />
                                    </div>

                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="excursionType">Excursion Type <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="excursionType"
                                            id="excursionType"
                                            onChange={handleChange}
                                            placeholder="Enter excursion type"
                                            value={formData.excursionType} />
                                        {newErrors.excursionType && <p className="text-red-700 text-sm">{newErrors.excursionType}</p>}
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="keyPoints">keyPoints <span className='text-red-600'>*</span></label>
                                        <select
                                            multiple
                                            id="keyPoints"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-4"
                                            onChange={handlekeyPointsChange}
                                            value={formData.keyPoints.map(kp => kp.label)}>
                                            {keyPointsOptions.map((option, index) => (
                                                <option
                                                    key={index}
                                                    value={option.label}
                                                    data-color={option.color}>
                                                    {option.label}
                                                </option>

                                            ))}
                                        </select>
                                        {newErrors.keyPoints && <p className="text-red-700 text-sm">{newErrors.keyPoints}</p>}
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
                                                    onChange={(e) => handleConsiderChange(index, e)} />
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                                    onClick={() => removeConsider(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addConsider}>
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
                                                    onChange={(e) => handleProgramChange(index, e)} />
                                                <input
                                                    type="number"
                                                    name="duration"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    placeholder="Enter duration"
                                                    value={item.duration}
                                                    onChange={(e) => handleProgramChange(index, e)} />
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 mt-2 rounded"
                                                    onClick={() => removeProgram(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addProgram}>
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
                                                    onChange={(e) => handleStartChange(index, e)} />
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                                    onClick={() => removeStart(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={addStart}>
                                            Add More Start
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading}>
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
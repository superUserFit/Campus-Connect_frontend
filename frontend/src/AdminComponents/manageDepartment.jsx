import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast.js";
import {
    addCourseRoute,
    addDiplomaRoute,
    createDepartmentRoute,
    getDepartmentsRoute,
    getDiplomasRoute
} from "../APIRoute/APIRoute.js";

const ManageDepartment = () => {
    const [departmentName, setDepartmentName] = useState("");
    const [addDiploma, setAddDiploma] = useState({
        diplomaName: "",
        department: ""
    });
    const [addCourses, setAddCourses] = useState({
        diploma: "",
        courseCode: "",
        courseName: ""
    });
    const [loading, setIsLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [diplomas, setDiplomas] = useState([]);
    const showToast = useShowToast();

    // Fetch Departments
    const fetchDepartments = async () => {
        try {
            const response = await fetch(`/api/admin/getDepartments`);
            if (response.ok) {
                const data = await response.json();
                setDepartments(data);
            } else {
                showToast("Error", "Failed to fetch departments", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error", "Failed to fetch departments", "error");
        }
    };


    // Fetch Diplomas
    const fetchDiplomas = async () => {
        try {
            const response = await fetch(`/api/users/getDiplomas`);

            if (response.ok) {
                const data = await response.json();
                setDiplomas(data);
            } else {
                showToast("Error", "Failed to fetch departments", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error", "Failed to fetch departments", "error");
        }
    };


    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchDiplomas();
    }, []);


    // Create Department
    const handleCreateDepartment = async () => {
        if (!departmentName) {
            showToast("Error", "Incomplete Information", "error");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/createDepartment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ departmentName: departmentName })
            });

            if (response.ok) {
                showToast("Success", "Successfully create new department", "success");
                fetchDepartments();
            } else {
                showToast("Error", "Failed to create department", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error", "Failed to create department", "error");
        } finally {
            setIsLoading(false);
        }
    };


    //  Handle Add Diploma
    const handleAddDiploma = async () => {
        if(!addDiploma.department || !addDiploma.diplomaName) {
            showToast("Error", "Incomplete Field", "error");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/addDiploma`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(addDiploma)
            });

            if(response.ok) {
                showToast("Success", "Successfully added new diploma", "success");
                fetchDiplomas();
            }else {
                showToast("Error", "Failed to add diploma", "error");
            }
        }catch(error) {
            showToast(error);
        }finally {
            setIsLoading(false);
        }
    };


    //  Handle Aad Course
    const handleAddCourse = async () => {
        if(!addCourses.diploma || !addCourses.courseCode || !addCourses.courseName) {
            showToast("Error", "Incomplete fields", "error");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/addCourse`, {
                method: "POST",
                headers: {  "Content-Type": "application/json"  },
                body: JSON.stringify(addCourses)
            });

            const data = await response.json();
            if(response.ok) {
                showToast("Success", `Successfully Added Courses`, "success");
            } else {
                showToast("Error", data.error, "error");
            }
        }catch(error) {
            showToast(error);
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex gap={4} flexDirection={"row"} overflowY={"auto"}>
            <Flex flexDirection={"column"}>
                {/* Add Department */}
                <Box
                    w={"30vw"}
                    bg={useColorModeValue("white", "gray.800")}
                    p={4}
                    rounded={"xl"}
                >
                    <Text fontSize={"xl"} fontWeight={"semibold"} mb={2}>Create Department</Text>
                    <Input placeholder="Create New Department" bg={useColorModeValue("gray.300", "whiteAlpha.300")} textColor={useColorModeValue("black", "white")} value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} my={2} />
                    <Button bg={useColorModeValue("gray.300", "whiteAlpha.800")} textColor={"black"} w={"100%"} onClick={handleCreateDepartment} isLoading={loading}>Create Department</Button>
                </Box>

                {/* Add Diploma */}
                <Box
                    w={"30vw"}
                    bg={useColorModeValue("white", "gray.800")}
                    p={4}
                    my={4}
                    rounded={"xl"}
                >
                    <Text fontSize={"xl"} fontWeight={"semibold"} mb={2}>Add Diploma</Text>
                    <Select
                        my={2}
                        bg={useColorModeValue("gray.300", "whiteAlpha.300")}
                        textColor={useColorModeValue("black", "white")}
                        value={addDiploma.department} onChange={(e) => setAddDiploma((addDiploma) => ({...addDiploma, department: e.target.value}))}
                    >
                        <option
                            bg={useColorModeValue("white", "gray.200")}
                            textColor={"black"}
                            value="" disabled>Select Department</option>
                            {departments.map((department) => (
                                <option key={department._id} value={JSON.stringify(department)}>{department.name}</option>
                            ))}
                    </Select>
                    <Input
                        placeholder="Add New Diploma"
                        mb={2}
                        bg={useColorModeValue("gray.300", "whiteAlpha.300")}
                        textColor={useColorModeValue("black", "white")}
                        value={addDiploma.diplomaName}
                        onChange={(e) => setAddDiploma((addDiploma) => ({...addDiploma, diplomaName: e.target.value}))}
                    />
                    <Button bg={useColorModeValue("gray.300", "whiteAlpha.800")} textColor={"black"} w={"100%"} isLoading={loading} onClick={handleAddDiploma}>Add Diploma</Button>
                </Box>
            </Flex>

            {/*     Add Courses     */}
            <Box
                w={"40vw"}
                bg={useColorModeValue("white", "gray.800")}
                p={4}
                my={4}
                rounded={"xl"}
            >
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={2}>Add Courses</Text>
                <Flex>
                    <Select
                        my={2}
                        bg={useColorModeValue("gray.300", "whiteAlpha.300")}
                        textColor={useColorModeValue("black", "white")}
                        mx={2}
                        value={addCourses.diploma} onChange={(e) => setAddCourses((addCourses) => ({...addCourses, diploma: e.target.value}))}
                    >
                        <option bg={useColorModeValue("white", "gray.200")} textColor={"black"} value="" disabled>Select Diploma</option>
                            {diplomas.map((diploma) => (
                                <option key={diploma._id} value={JSON.stringify(diploma)}>{diploma.name}</option>
                            ))}
                    </Select>
                </Flex>

                <Flex>
                    <Input
                        placeholder="Course Code"
                        mb={2}
                        mx={2}
                        bg={useColorModeValue("gray.300", "whiteAlpha.300")}
                        textColor={useColorModeValue("black", "white")}
                        value={addCourses.courseCode}
                        onChange={(e) => setAddCourses((addCourses) => ({...addCourses, courseCode: e.target.value}))}
                    />

                    <Input
                        placeholder="Course Name"
                        mb={2}
                        mx={2}
                        bg={useColorModeValue("gray.300", "whiteAlpha.300")}
                        textColor={useColorModeValue("black", "white")}
                        value={addCourses.courseName}
                        onChange={(e) => setAddCourses((addCourses) => ({...addCourses, courseName: e.target.value}))}
                    />
                </Flex>
                <Button bg={useColorModeValue("gray.300", "whiteAlpha.800")} textColor={"black"} w={"100%"} isLoading={loading} onClick={handleAddCourse}>Add Course</Button>
            </Box>
        </Flex>
    );
}

export default ManageDepartment;

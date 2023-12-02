import {
    Flex, useColorModeValue,
    Text, Input,
    Button, Grid,
    Box, CloseButton,
    Select, useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext.jsx";
import { useRecoilValue } from "recoil";
import { FaPlus } from "react-icons/fa";
import userAtom from "../atoms/userAtom.js";
import AddAssignments from "./AddAssignments.jsx";
import { host } from "../APIRoute/APIRoute.js";


const CourseActivity = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [enrollmentKey, setEnrollmentKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const showToast = useShowToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { socket } = useSocket();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        socket?.on("addCourse", (newCourse) => {
            setCourses((prevCourses) => [...prevCourses, newCourse]);
        });

        return () => {
            socket?.off("addCourse");
        };
    }, [socket]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`/api/lecturer/getCourses/${user._id}`, {
                    method: "GET"
                });
                const data = await response.json();

                setCourses(data);
            }catch(error) {
                console.log(error);
            }
        }
        fetchCourses();
    }, []);


    useEffect(() => {
        const getAllCourses = async () => {
            const response = await fetch(`${host}/api/lecturer/getAllCourses`, {
                method: "GET"
            });

            if(response.ok) {
                const data = await response.json();
                setAllCourses(data);
            } else {
                showToast("Error", "Failed to fetch courses", "error");
            }
        };

        getAllCourses();
    },[]);


    const addCourse = async () => {
        if(!selectedCourse || !enrollmentKey) {
            showToast("Error", "Incomplete field", "error");
            return;
        }
        try {
            setLoading(true)
            const response = await fetch(`${host}/api/lecturer/addCourse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    course: selectedCourse,
                    enrollmentKey: enrollmentKey
                })
            });

            const data = await response.json();
            if(response.ok) {
                showToast("Success", `Course Added Successfully!`, "success");
            } else {
                showToast("Error", data.error, "error");
            }
        }catch(error) {
            showToast("Error", error, "error");
        }finally {
            setLoading(false);
            setSelectedCourse("");
            setEnrollmentKey("");
        }
    };


    const deleteCourse = async (courseId) => {
        try {
            const response = await fetch(`${host}/api/lecturer/deleteCourse/${courseId}`, {
                method: "DELETE",
            });

            if(response.ok) {
                setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
                showToast("Success", "Assignment has been deleted", "success");
            }
        }catch(error) {
            showToast(error);
        }
    }


    return (
        <Flex
            p={4}
            gap={4}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            overscrollY={"auto"}
            w="70vw"
        >
            <Flex
                bg={useColorModeValue("orange.300", "orange.600")}
                p={4}
                rounded={"md"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
            >
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={2}>Add Course</Text>
                <Flex flexDirection={"column"}>
                    <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} my={2} bg={useColorModeValue("white", "gray.200")}>
                        <option value={""} disabled>Select Course</option>
                        {allCourses.map((course) => (
                            <option key={course._id} value={JSON.stringify(course)}>{course.courseCode + course.courseName}</option>
                        ))}
                    </Select>

                    <Flex flexDirection={"column"}>
                        <Text fontWeight={"bold"} w={"70%"} mt={3}>Enrollment Key: </Text>
                        <Input bg={useColorModeValue("white", "gray.200")} value={enrollmentKey} onChange={(e) => setEnrollmentKey(e.target.value)} my={2}/>
                        <Button w={"100%"} onClick={addCourse} isLoading={loading}>Add Course</Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default CourseActivity;
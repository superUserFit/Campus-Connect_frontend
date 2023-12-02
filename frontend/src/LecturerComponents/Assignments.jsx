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

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const { onOpen, onClose } = useDisclosure();
    const { socket } = useSocket();
    const showToast = useShowToast();

    useEffect(() => {
        // Listen for the "addAssignment" event
        socket?.on("addAssignment", (newAssignment) => {
            setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
        });

        return () => {
            socket?.off("addAssignment");
        };
    }, [socket]);

    useEffect(() => {
        fetchAssignment();
    },[]);


    const fetchAssignment = async () => {
        const response = await fetch(`/api/lecturer/getAssignments/${user._id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if(response.ok) {
            setAssignments(data);
        } else {
            showToast("Error", "Failed to fetch assignments", "error");
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        const response = await fetch(`/api/lecturer/deleteAssignment/${assignmentId}`,{
            method: "DELETE"
        });

        if(response.ok) {
            setAssignments((prevAssignment) => prevAssignment.filter((assignment) => assignment._id !== assignmentId));
            showToast("Success", "Assignment has been deleted", "success");
        }
    }

    const handleAddAssignmentClick = () => {
        onOpen();
    };

    return (
        <>
            <Flex
                bg={useColorModeValue("orange.300", "orange.600")}
                p={4}
                rounded={"md"}
                flexDirection={"column"}
                mb={4}
            >
                <Text textAlign={"center"} fontSize={"xl"} fontWeight={"semibold"} mb={2}>Courses</Text>
                <Flex flexDirection={"column"} w={"100%"}>
                    <Grid
                        templateColumns={"1fr 1fr 1fr 0.2fr"}
                        gap={2}
                        p={4}
                        bg={useColorModeValue("wheat", "whiteAlpha.400")}
                    >
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Code</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Name</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Enrollment Key</Box>
                        <Box p={1} textAlign={"center"}></Box>
                        {courses.map((course) => (
                            <React.Fragment key={course._id}>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseCode}</Box>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseName}</Box>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseKey}</Box>
                                <Box textAlign={"center"} mt={2}>
                                    <CloseButton p={5} bg={useColorModeValue("red.400", "red.600")} onClick={() => deleteCourse(course._id)} />
                                </Box>
                                <AddAssignments
                                    courseId={course._id}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                />
                            </React.Fragment>
                        ))}
                    </Grid>
                </Flex>
            </Flex>
            <Flex flexDirection="column" bg={useColorModeValue("orange.300", "orange.600")} w="100%" p={4} rounded="xl">
                <Flex flexDirection={"column"}>
                    <Flex rounded="lg">
                        <Text fontSize={"lg"} fontWeight="bold">Assignments</Text>
                        <Box bg={useColorModeValue("white", "blackAlpha.600")} cursor={"pointer"} p={2} mx={2} rounded={"md"} onClick={handleAddAssignmentClick}>
                            <FaPlus size={12}/>
                        </Box>
                    </Flex>
                    {courses.map((course) => (
                        <Flex flexDirection={"column"} my={2} mt={2} key={course._id}>
                            <Flex columnGap={4}>
                                <Text fontWeight={"semibold"}>{course.courseCode}</Text>
                                <Text fontWeight={"medium"}>{course.courseName}</Text>
                            </Flex>
                            <Grid
                                templateColumns="1.5fr 2fr 1.5fr 0.25fr"
                                gap={2}
                                p={4}
                                maxH={"70vh"}
                                overflowY={"auto"}
                                bg={useColorModeValue("wheat", "gray.600")}
                            >
                                <Box
                                    bg={useColorModeValue("orange.300", "orange.600")}
                                    p={1}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    Assignment
                                </Box>
                                <Box
                                    bg={useColorModeValue("orange.300", "orange.600")}
                                    p={1}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                  Description
                                </Box>
                                <Box
                                    bg={useColorModeValue("orange.300", "orange.600")}
                                    p={1}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    Due Date
                                </Box>
                                <Box textAlign="center"></Box>
                                {assignments
                                    .filter((assignment) => assignment.course === course._id)
                                    .map((assignment) => (
                                        <React.Fragment key={assignment._id}>
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                textColor={useColorModeValue("black", "white")}
                                            >
                                                {assignment.name}
                                            </Box>
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                textColor={useColorModeValue("black", "white")}
                                            >
                                                {assignment.description}
                                            </Box>
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                textColor={useColorModeValue("black", "white")}
                                            >
                                              {assignment.dueDate}
                                            </Box>
                                            <Box
                                                textAlign="center"
                                                onClick={() => handleDeleteAssignment(assignment._id)}
                                            >
                                              <CloseButton textColor={useColorModeValue("black", "white")} />
                                            </Box>
                                        </React.Fragment>
                                    ))}
                            </Grid>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </>
    );
}

export default Assignments;
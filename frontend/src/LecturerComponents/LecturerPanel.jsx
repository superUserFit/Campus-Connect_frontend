import {
    Flex,
    useColorModeValue ,
    Text,
    Box,
    Button
} from "@chakra-ui/react";
import React, { useState } from "react";
import CourseActivity from "../LecturerComponents/CourseActivity"



const LecturerPanel = () => {
    const [selectedComponent, setSelectedComponent] = useState("allCourses");

    const renderComponent = () => {
        if(selectedComponent === "courseActivity") {
            return <CourseActivity />
        }else if(selectedComponent === "enrolledCourses") {
            return <EnrolledCourses/>
        }
    }
    return (
        <Flex
            w={"100%"}
            bg={useColorModeValue("whitesmoke", "gray.dark")}
            h={"50px"}
            mt={"-4"}
            gap={2}
            flexDirection={"column"}
        >
            <Flex justifyContent={"center"} alignItems={"center"} mx={4} gap={4}>
                <Button bg={useColorModeValue("orange.300", "orange.700")} textAlign={"center"} fontWeight={"medium"} onClick={() => setSelectedComponent("allCourses")}>All courses</Button>
                <Button bg={useColorModeValue("orange.300", "orange.700")} textAlign={"center"} fontWeight={"medium"} onClick={() => setSelectedComponent("enrolledCourses")}>Enrolled courses</Button>
            </Flex>

            {renderComponent()}
        </Flex>
    );
}

export default LecturerPanel;
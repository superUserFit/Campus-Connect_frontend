import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Box, Spinner, useColorModeValue, Grid, Text } from "@chakra-ui/react";
import Post from "../CommunityComponents/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import StudentDashboard from "../StudentComponents/StudentDashboard";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import Report from "../AdminComponents/Report";
import { host } from "../APIRoute/APIRoute.js";


const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const [courses, setCourses] = useState([]);
	const currentUser = useRecoilValue(userAtom);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`${host}/api/posts/user/${username}`);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);


	useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${host}/api/lecturer/getCourses/${currentUser._id}`, {
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


	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) {
		return (
			<Flex justifyContent={"center"} alignItems={"center"} bg={useColorModeValue("orange.300", "orange.700")} h={"100vh"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"semibold"}>User may have not update their department and diploma</Text>
					<Text fontSize={"2xl"} fontWeight={"semibold"}>Please update your department and diploma in settings</Text>
				</Box>
			</Flex>
		);
	}

	if (!user.department && !user.diploma) {
		return (
			<Flex justifyContent={"center"} alignItems={"center"} bg={useColorModeValue("orange.300", "orange.700")} h={"100vh"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"semibold"}>User may have not update their department and diploma</Text>
					<Text fontSize={"2xl"} fontWeight={"semibold"}>Please update your department and diploma in settings</Text>
				</Box>
			</Flex>
		);
	}
	return (
		<Box bg={useColorModeValue("gray.200", "blackAlpha.300")} h={"100vh"} overflowY={"auto"}>
		  	<UserHeader user={user} />
			{user.isAdmin && <Report />}
			{user.isStudent && <StudentDashboard />}
			{user.isLecturer && (
                <Flex flexDirection={"column"} w={"100vw"} justifyContent={"center"} alignItems={"center"}>
                    <Grid
                        templateColumns={"1fr 1fr 1fr"}
                        gap={2}
                        p={4}
                        bg={useColorModeValue("wheat", "whiteAlpha.400")}
                    >
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Code</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Name</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Enrollment Key</Box>
                        {courses.map((course) => (
                            <React.Fragment key={course._id}>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseCode}</Box>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseName}</Box>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseKey}</Box>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Flex>
			)}
		</Box>
	  );
};

export default UserPage;

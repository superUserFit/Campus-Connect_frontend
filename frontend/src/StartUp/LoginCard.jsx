import {
	Flex, Modal,
	Box, ModalBody,
	FormControl, ModalContent,
	FormLabel, ModalOverlay,
	Input, Text,
	InputGroup, Select,
	InputRightElement, Link,
	Stack, useColorModeValue,
	Button, Heading,
	useDisclosure, ModalHeader,
	ModalCloseButton
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import Cookies from "js-cookies";

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);
	const { onClose, onOpen } = useDisclosure();
	const [openModal, setOpenModal] = useState(false);
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
		access: "",
	});
	const showToast = useShowToast();

	const [changingPassword, setChangingPassword] = useState({
		email: "",
		newPassword: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");

	const changePassword = async () => {
		setLoading(true);

		if(!changingPassword) {
			showToast("Incomplete Information", "Please fill required fields", "error");
			return;
		} else if(changingPassword.newPassword !== confirmPassword) {
			showToast("Incorrect Password", "Password Do Not Match", "error");
		}

		try {
			const res = await fetch("/api/users/changePassword", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(changingPassword),
			});

			if(res.ok) {
				showToast("User password has been changed", "Password changed successfully", "success");
			} else {
				showToast("Failed to changed password", "Error while changing password", "error");
			}
		}catch(error) {
			showToast("Error", data.error, "error");
		}finally {
			setLoading(false);
		}
	}

	const handleLogin = async () => {
		setLoading(true);

		console.log("Inputs: ", inputs);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});

			if (res.ok) {
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
				} else {
					Cookies.setItem("Campus-Connect", JSON.stringify(data));
					setUser(data);
				}
			} else {
				const errorData = await res.json();
				showToast("Error", errorData.error, "error");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};



	return (
		<Flex direction={"column"} align={"center"} justify={"center"} h={"100vh"} overflowX={"hidden"}>
			<Stack direction={"row"} mb={2}>
				<Button
        		    maxW={"5xl"}
        		    py={8}
        		    bg={"orange.500"}
        		    px={16}
        		    onClick={() => setAuthScreen("signup")}
        		>
            		<Link as={RouterLink} to={"/auth"}>
            		    Sign up
            		</Link>
        		</Button>

				<Button
            		maxW={"5xl"}
            		py={8}
            		px={16}
            		bg={"orange.500"}
            		onClick={() => setAuthScreen("login")}
        		>
            		<Link as={RouterLink} to={"/auth"} >
            		    Login
            		</Link>
        		</Button>
			</Stack>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} px={3} bg={useColorModeValue("orange.400", "orange.600")} rounded={"3xl"}>
				<Stack align={"center"}>
					<Heading fontSize={"2xl"} textAlign={"center"} py={3}>
						Login
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					boxShadow={"lg"}
					p={8}
					w={{
						base: "full",
						sm: "400px",
					}}
					maxH={"90vh"}
      				overflowY={"auto"}
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Email</FormLabel>
							<Input
								type='email'
								value={inputs.email}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, email: e.target.value }))}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>

						<FormControl>
							<FormLabel>Log In As: </FormLabel>
							<Select color={"black"} isRequired value={inputs.access} onChange={(e) => setInputs((inputs) => ({...inputs, access: e.target.value}))} placeholder="Please Select Your Access" bg={"gray.200"}>
								<option value={"Student"}>Student</option>
								<option value={"Lecturer"}>Lecturer</option>
								<option value={"Admin"}>Admin</option>
							</Select>
						</FormControl>

						<Text _hover={{color: "blue.700"}} w={"fit-content"} color={"white"} cursor={"pointer"} fontWeight={"medium"} onClick={() => setOpenModal(true)}>Forgot Password?</Text>
						{openModal && (
							<Modal isOpen={onOpen} onClose={() => setOpenModal(false)} size="md">
						    <ModalOverlay />
						    <ModalContent borderRadius="md">
						        <ModalHeader>Change Password</ModalHeader>
						        <ModalCloseButton />
						        <ModalBody>
						            <FormControl mb={4}>
						                <FormLabel>Email:</FormLabel>
						                <Input type="email" placeholder="Enter your email" value={changingPassword.email} onChange={(e) => setChangingPassword((changingPassword) => ({...changingPassword, email: e.target.value}))} />
						            </FormControl>

						            <FormControl mb={4}>
						                <FormLabel>New Password:</FormLabel>
						                <Input type="password" placeholder="Enter your new password" autoComplete="off" value={changingPassword.newPassword} onChange={(e) => setChangingPassword((changingPassword) => ({...changingPassword, newPassword: e.target.value}))} />
						            </FormControl>

						            <FormControl mb={4}>
						                <FormLabel>Confirm Password:</FormLabel>
						                <Input type="password" placeholder="Confirm your new password" autoComplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
						            </FormControl>

						            <Button
						                colorScheme="orange"
						                isLoading={loading}
						                onClick={changePassword}
						                width="full"
						                mt={4}
						            >
						                Change Password
						            </Button>
						        </ModalBody>
						    </ModalContent>
						</Modal>
						)}

						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Logging in'
								size='lg'
								bg={useColorModeValue("orange.500", "orange.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("orange.700", "orange.400"),
								}}
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

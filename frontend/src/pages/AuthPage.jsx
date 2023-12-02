import React, { useState } from "react";
import * as Components from '../StartUp/Components.jsx';
import {
    Box, Button,
    Flex, Select,
    Modal, ModalBody,
    ModalContent, ModalOverlay,
    FormControl, FormLabel,
    ModalCloseButton, useDisclosure,
    ModalHeader, Input,
	Text,
	useColorModeValue
} from "@chakra-ui/react";
import Cookies from "js-cookies";
import useShowToast from "../hooks/useShowToast.js";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { signUpRoute, loginRoute, changePasswordRoute } from "../APIRoute/APIRoute.js";


const AuthPage = () => {
    const [signIn, toggle] = useState(true);
    const setUser = useSetRecoilState(userAtom);
    const [register, setRegister] = useState({
        nric: "",
        username: "",
        email: "",
        password: "",
    });
    const [login, setLogin] = useState({
        email: "",
        password: "",
        access: ""
    });
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
	const [changingPassword, setChangingPassword] = useState({
		email: "",
		newPassword: "",
	});


	const changePassword = async () => {
		setLoading(true);

		if(!changingPassword) {
			showToast("Incomplete Information", "Please fill required fields", "error");
			return;
		} else if(changingPassword.newPassword !== confirmPassword) {
			showToast("Incorrect Password", "Password Do Not Match", "error");
		}

		try {
			const res = await fetch(`/api/users/changePassword`, {
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


    const handleSignup = async () => {
		if(register.password !== confirmPassword) {
			showToast("Error", "Password Not Match", "error");
			return;
		}

		try {
			const res = await fetch(`/api/users/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(register),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			Cookies.setItem("Campus-Connect", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};


    const handleLogin = async () => {
		setLoading(true);

		console.log("Login: ", login);
		try {
			const res = await fetch(`/api/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(login),
			});

			if (res.ok) {
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
				} else {
					Cookies.setItem("CampusConnect", JSON.stringify(data));
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


    return(
        <Flex justifyContent={"center"} alignItems={"center"} mt={24}>
            <Components.Container>
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Box w={"90%"}>
                            <Components.Title><Text textColor={"black"}>Create Account</Text></Components.Title>
                            <Flex columnGap={4}>
                                <Components.Input type='text' placeholder='NRIC' value={register.nric} onChange={(e) => setRegister((register) => ({...register, nric: e.target.value}))} />
                                <Components.Input type='text' placeholder='Username' value={register.username} onChange={(e) => setRegister((register) => ({...register, username: e.target.value}))}  />
                            </Flex>
                                <Components.Input type='text' placeholder='Email'value={register.email} onChange={(e) => setRegister((register) => ({...register, email: e.target  .value}))}  />
                            <Flex columnGap={4}>
                                <Components.Input type='password' placeholder='Password' value={register.password} onChange={(e) => setRegister((register) => ({...register, password: e.target.value}))}  />
                                <Components.Input type='email' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Flex>
                            <Button rounded={"2xl"} border={"none"} bg={"orange.500"} px={8} py={2} fontWeight={"bold"} mt={4} onClick={handleSignup} isLoading={loading}>
                                Sign Up
                            </Button>
                        </Box>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Flex flexDirection={"column"} w={"90%"}>
                            <Components.Title><Text textColor={"black"}>Login</Text></Components.Title>
                            <Components.Input
                                type='email'
                                placeholder='Email'
                                value={login.email}
                                onChange={(e) => setLogin((login) => ({ ...login, email: e.target.value }))} // Fix here
                            />
                            <Components.Input
                                type='password'
                                placeholder='Password'
                                value={login.password}
                                onChange={(e) => setLogin((login) => ({ ...login, password: e.target.value }))}
                            />
                            	<Select mt={2} fontSize={"sm"} color={"black"} isRequired value={login.access} onChange={(e) => setLogin((login) => ({...login, access: e.target.value}))} placeholder="Please Select Your Access" bg={"gray.200"}>
						    		<option value={"Student"}>Student</option>
						    		<option value={"Lecturer"}>Lecturer</option>
						    		<option value={"Admin"}>Admin</option>
						    	</Select>
                            <Components.Anchor onClick={() => setOpenModal(true)}>Forgot your password?</Components.Anchor>
                        </Flex>
                        <Button rounded={"2xl"} border={"none"} bg={"orange.500"} px={8} py={2} fontWeight={"bold"} onClick={handleLogin} isLoading={loading}>
                            Login
                        </Button>
                    </Components.Form>

                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>
                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>Welcome To Campus Connect</Components.Title>
                            <Components.Paragraph>
                                Enter your personal information to start your journey with us
                            </Components.Paragraph>
                            <Components.Paragraph>
                                Already have an account with us? Login now
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(true)}>
                                Login
                            </Components.GhostButton>
                            </Components.LeftOverlayPanel>

                            <Components.RightOverlayPanel signinIn={signIn}>
                                <Components.Title>Welcome Back!</Components.Title>
                                <Components.Paragraph>
                                    Login and start your journey with us
                                </Components.Paragraph>

                                <Components.Paragraph>
                                    Don't have an account with us? Sign up now.
                                </Components.Paragraph>
                                <Components.GhostButton onClick={() => toggle(false)}>
                                    Sign Up
                                </Components.GhostButton>
                            </Components.RightOverlayPanel>
                 </Components.Overlay>
             </Components.OverlayContainer>
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
         </Components.Container>
        </Flex>
    );
}

export default AuthPage;
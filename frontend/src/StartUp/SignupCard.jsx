import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import Cookies from "js-cookies";



export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		nric: "",
		username: "",
		email: "",
		password: "",
	});
	const [confirmPassword, setConfirmPassword] = useState('');

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);


	const handleSignup = async () => {
		if(inputs.password !== confirmPassword) {
			showToast("Error", "Password Not Match", "error");
			return;
		}

		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
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

	return (
		<Flex  direction={"column"} align={"center"} justify={"center"} h={"100vh"} mt={5} overflowX={"hidden"}>
			<Stack direction={"row"} spacing={4} mb={2}>
				<Button
        		    maxW={"5xl"}
        		    bg={"orange.500"}
        		    py={8}
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
			<Stack spacing={8} mx={"auto"} maxW={"lg"} bg={useColorModeValue("orange.400", "orange.600")} rounded={"3xl"}>
				<Stack align={"center"}>
					<Heading fontSize={"2xl"} textAlign={"center"} pt={5}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded={"lg"} boxShadow={"lg"} p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>NRIC</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({ ...inputs, nric: e.target.value })}
										value={inputs.nric}
										bg={"whiteAlpha.600"}
										textColor={"black"}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
										value={inputs.username}
										bg={"whiteAlpha.600"}
										textColor={"black"}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type='email'
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
								value={inputs.email}
								bg={useColorModeValue("whitesmoke", "whiteAlpha.400")}
							/>
						</FormControl>
						<FormControl isRequired>
							<HStack spacing={2}>
							    <Box flex="1">
							      	<FormLabel>Password</FormLabel>
							      	<InputGroup>
							        	<Input
							          		type={showPassword ? "text" : "password"}
							          		onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							          		value={inputs.password}
											bg={"whiteAlpha.600"}
											textColor={"black"}
							        	/>
							      	</InputGroup>
							    </Box>
							    <Box flex="1">
							      	<FormLabel>Confirm Password</FormLabel>
							      	<InputGroup>
							        	<Input
							          		type={showPassword ? "text" : "password"}
							          		onChange={(e) => setConfirmPassword(e.target.value)}
							          		value={confirmPassword}
									  		bg={"whiteAlpha.600"}
											textColor={"black"}
							        	/>
										<InputRightElement h="full">
							        	  	<Button
							        	    	variant="ghost"
							        	    	onClick={() => setShowPassword((showPassword) => !showPassword)}
							        	  	>{showPassword ? <ViewIcon /> : <ViewOffIcon />}
							        	  	</Button>
							        	</InputRightElement>
							      	</InputGroup>
							    </Box>
							</HStack>
							</FormControl>

						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Submitting'
								size='lg'
								bg={useColorModeValue("orange.500", "orange.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("orange.700", "orange.400"),
								}}
								as={RouterLink}
								onClick={handleSignup}
								to={'/setup'}
							>
							<Link>
								Sign up
							</Link>
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

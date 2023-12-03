import { useRecoilValue } from "recoil";
import LoginCard from "../StartUp/LoginCard";
import SignupCard from "../StartUp/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { Flex } from "@chakra-ui/react";

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);

	return (
		<Flex justifyContent={"center"} alignItems={"center"} mt={2}>
			{authScreenState === "login" ? <LoginCard /> : <SignupCard />}
		</Flex>
	);
};

export default AuthPage;

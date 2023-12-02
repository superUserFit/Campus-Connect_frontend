export const host = "http://localhost:8000";

//  Authentication Route Function
export const signUpRoute = `${host}/api/users/signup`;
export const loginRoute = `${host}/api/users/login`;
export const changePasswordRoute = `${host}/api/users/changePassword`;

//  Admin Route Function
export const createAccountRoute = `${host}/api/admin/createUserAccount`;
export const getDepartmentsRoute = `${host}/api/admin/getDepartments`;
export const createDepartmentRoute = `${host}/api/admin/createDepartment`;
export const addDiplomaRoute = `${host}/api/admin/addDiploma`;
export const addCourseRoute = `${host}/api/admin/addCourse`;
export const getReportsRoute = `${host}/api/customerService/getReports`;
export const getAllUsersRoute = `${host}/api/admin/getAllUsers`;
export const deleteUserRoute = `${host}/api/admin/deleteUser`;

//  One-To-One Chat Route
export const sendMessageRoute = `${host}/api/messages`;
export const deleteMessageRoute = `${host}/api/messages/deleteMessage`;
export const getConversationsRoute = `${host}/api/messages/conversations`;

//  User Route
export const logoutRoute = `${host}/api/users/logout`;
export const getDepartments = `${host}/api/users/getDepartments`;
export const getDiplomasRoute = `${host}/api/users/getDiplomas`;
export const setupUserRoute = `${host}/api/users/setupUser`;

//  Group Chat Route
export const groupMessageRoute = `${host}/api/group`;
export const addUserRoute = `${host}/api/group/addUser`;
export const leaveGroupRoute = `${host}/api/group/leaveGroup`;
export const deleteGroupRoute = `${host}/api/group/removeGroup`;
export const renameGroupRoute = `${host}/api/group/renameGroup`;
export const createGroupRoute = `${host}/api/group/createGroupChat`;
export const joinGroupRoute = `${host}/api/group/joinGroup`;
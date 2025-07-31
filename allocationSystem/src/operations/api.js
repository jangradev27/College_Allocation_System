const baseUrl=import.meta.env.VITE_API_BASE_URL
export const AuthApi={
    sendOtp:baseUrl+"/sendOtp",
    login:baseUrl+"/login",
    signUp:baseUrl+"/SignUp"

}
export const Allocationapi={
    createRoom:baseUrl+"/RoomsData",
    createTeacher:baseUrl+"/TeacherData",
    creatallocation:baseUrl+"/allocatedRooms",
    getallAllocation:baseUrl+"/allAllocations",
    getAllocationDetails:baseUrl+"/getAllocation",
    getTeachers:baseUrl+"/getTeachers",
    getRooms:baseUrl+"/getRooms"
}


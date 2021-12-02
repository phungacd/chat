import axios from 'utils/service/axiosServices';
const prefix = 'users/';

class UserServices {
  updateProfileUserService = data => {
    return axios.request({
      method: 'PUT',
      url: `${prefix}profiles`,
      data: data
    });
  };
  updateOtpUserService = data => {
    return axios.request({
      method: 'PUT',
      url: `${prefix}profiles/contacts`,
      data: data
    });
  };
  findUserById = id => {
    return axios.request({
      method: 'GET',
      url: `${prefix}detail?id=${id}`
    });
  };
}
export default UserServices;

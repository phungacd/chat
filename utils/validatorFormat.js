export const MIN_CHARS = 3;
export const MAX_CHARS = 128;

export const required = (nameField, message, isRequired = true) => ({
  required: isRequired,
  message: message || `${nameField} không được bỏ trống.`
});

export const max = (nameField, value = MAX_CHARS, message) => ({
  max: value,
  message: message || `${nameField} must be at most ${value} characters long.`
});

export const min = (nameField, value = MIN_CHARS, message) => ({
  min: value,
  message: message || `${nameField} must be at least ${value} characters long.`
});

export const type = (nameField, typeField, message) => ({
  type: typeField,
  message: message || `${nameField} must be a ${typeField}.`
});

export const pattern = (nameField, regx, message) => ({
  pattern: regx,
  message: message || `Special characters are not allowed in ${nameField}.`
});

export const emailFormat = (nameField, message) => ({
  pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  message: message || `Invalid ${nameField}.`
});

export const whitespace = (nameField, message) => ({
  whitespace: true,
  message: message || `${nameField} cannot be empty.`
});

export const number = (nameField, message) => ({
  pattern: /^\d+$/,
  message: message || `${nameField} must be a number.`
});

export const lowercase = (nameField, message) => ({
  pattern: /^[^A-Z\s]+$/,
  message: message || `${nameField} must be in lowercase.`
});
export const password = (nameField, message) => ({
  pattern: /[a-zA-Z0-9]{6,20}/,
  message: message || `${nameField} must be a number.`
});
export const phoneNumber = (nameField, message) => ({
  pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
  message: message || `${nameField} must be a number.`
});
export const NameUser = (nameField, message) => ({
  pattern: /^[ '.a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷýỹ]+$/u,
  message: message || `${nameField} must be a number.`
});
export const RGX = {
  NAME_RGX: /^[ '.a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷýỹ]+$/u,
  PASSWORD_RGX: /^[a-zA-Z0-9]{6,32}$/,
  PHONE_NUMBER_RGX: /((09|03|07|08|05)+([0-9]{8})\b)/
};

export const isPassConfirmedValid = (passValue, message) => ({
  validator: async (rule, value) => {
    if (!value || passValue === value) {
      return Promise.resolve();
    }
    return Promise.reject(message);
  }
});

export const hasNumber = value => {
  return new RegExp(/[0-9]/).test(value);
};
export const hasMixed = value => {
  return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};
export const hasSpecial = value => {
  return new RegExp(/[#$@!%&*?]/).test(value);
};

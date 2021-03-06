import { Button, Input, Form, Radio } from 'antd';
import PropTypes from 'prop-types';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from 'actions/accountAction';
import { toast } from 'react-toastify';
import { getProfileUser, updateOtpUser } from 'actions/userAction';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const SendOtpComponent = props => {
  const { cancelModal, visible, typeOfsendOtp } = props;
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState({});
  const { auth_token, isLoading } = useSelector(state => state.accountData);
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  const dispatch = useDispatch();
  const updateForOtp = value => {
    if (typeOfsendOtp) {
      const valueUpdate = {
        code: value.code,
        email: otp.email
      };
      dispatch(updateOtpUser(valueUpdate)).then(res => {
        if (res.error) {
          toast.error(res.data[0].msg, {
            position: 'top-right',
            autoClose: 3000
          });
        } else {
          toast.success(res.message, {
            position: 'top-right',
            autoClose: 3000
          });
          dispatch(getProfileUser(auth_token));
          handleCancelModal();
        }
      });
    } else {
      const valueUpdate = {
        code: value.code,
        phone: otp.phone
      };
      dispatch(updateOtpUser(valueUpdate)).then(res => {
        if (res.error) {
          toast.error(res.data[0].msg, {
            position: 'top-right',
            autoClose: 3000
          });
        } else {
          toast.success(res.message, {
            position: 'top-right',
            autoClose: 3000
          });
          dispatch(getProfileUser(auth_token));
          handleCancelModal();
        }
      });
    }
  };
  const sendOtpForConfirm = value => {
    if (typeOfsendOtp) {
      const apiSendOtp = `active/send?email=${value.email}`;
      dispatch(sendOtp(apiSendOtp)).then(res => {
        if (res.error) {
          toast.error(res.data, {
            position: 'top-right',
            autoClose: 3000
          });
        } else {
          toast.success('G???i m?? x??c nh???n th??nh c??ng', {
            position: 'top-right',
            autoClose: 3000
          });
          setOtp(value);
          setOtpSent(true);
        }
      });
    } else {
      const apiSendOtp = `active/send?phone=${value.phone}`;
      dispatch(sendOtp(apiSendOtp)).then(res => {
        if (res.error) {
          toast.error(res.data[0].msg, {
            position: 'top-right',
            autoClose: 3000
          });
        } else {
          toast.success(res.message, {
            position: 'top-right',
            autoClose: 3000
          });
          setOtp(value);
          setOtpSent(true);
        }
      });
    }
  };
  const handleCancelModal = () => {
    cancelModal();
    setOtpSent(false);
  };
  return (
    <Modal
      title={
        typeOfsendOtp
          ? 'X??c nh???n email c???a b???n'
          : 'X??c nh???n s??? ??i???n tho???i c???a b???n'
      }
      visible={visible}
      className="otpSend"
      onCancel={handleCancelModal}
      footer={false}
      style={{
        width: '150px'
      }}
    >
      {otpSent ? (
        <Form
          name="update"
          initialValues={{ remember: true }}
          onFinish={updateForOtp}
        >
          <Form.Item
            label="M?? x??c nh???n"
            name="code"
            rules={[
              { required: true, message: 'M?? x??c nh???n kh??ng ???????c ????? tr???ng!' }
            ]}
          >
            <Input placeholder="Nh???p m?? x??c nh???n " />
          </Form.Item>
          <FormItem>
            {isLoading ? (
              <Button
                style={{
                  background: '#0068ff',
                  fontSize: '12px',
                  color: 'white',
                  marginLeft: '40%'
                }}
              >
                <Spin indicator={antIcon} style={{ color: 'white' }} />
              </Button>
            ) : (
              <Button
                htmlType="submit"
                style={{
                  background: '#0068ff',
                  fontSize: '12px',
                  color: 'white',
                  marginLeft: '40%'
                }}
              >
                C???p nh???t
              </Button>
            )}
          </FormItem>
        </Form>
      ) : (
        <Form
          id="sendOtp"
          name="update"
          initialValues={{ remember: true }}
          onFinish={sendOtpForConfirm}
        >
          {typeOfsendOtp && typeOfsendOtp == true ? (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email kh??ng ???????c ????? tr???ng!' }
              ]}
            >
              <Input placeholder="Nh???p email " />
            </Form.Item>
          ) : (
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!'
                }
              ]}
            >
              <Input placeholder="Nh???p s??? ??i???n tho???i " />
            </Form.Item>
          )}
          <Form.Item label={`X??c nh???n `}>
            <Radio.Group value={1}>
              <Radio style={radioStyle} value={1}>
                {typeOfsendOtp && typeOfsendOtp == true
                  ? 'G???i Email cho t??i'
                  : 'G???i tin nh???n cho t??i'}
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            {typeOfsendOtp && typeOfsendOtp == true ? (
              <p>
                Khi x??c nh???n email, b???n c?? th??? ?????t l???i m???t kh???u d??? d??ng v?? nh???n
                th??ng b??o qua email. Nh??? ????, ch??ng t??i c??ng c?? th??? g???i ?? b???n b??,
                cung c???p c??ng nh?? c???i thi???n qu???ng c??o cho b???n v?? nh???ng ng?????i
                kh??c.
              </p>
            ) : (
              <p>
                Khi x??c nh???n s??? di ?????ng, b???n c?? th??? ?????t l???i m???t kh???u d??? d??ng v??
                nh???n th??ng b??o qua SMS. Nh??? ????, ch??ng t??i c??ng c?? th??? g???i ?? b???n
                b??, cung c???p c??ng nh?? c???i thi???n qu???ng c??o cho b???n v?? nh???ng ng?????i
                kh??c. Ch??? b???n m???i nh??n th???y s??? di ?????ng c???a m??nh.
              </p>
            )}
          </Form.Item>
          <Form.Item>
            {isLoading ? (
              <Button
                htmlType="submit"
                style={{
                  background: '#0068ff',
                  fontSize: '12px',
                  color: 'white',
                  marginLeft: '40%',
                  width: '100px'
                }}
              >
                <Spin indicator={antIcon} style={{ color: 'white' }} />
              </Button>
            ) : (
              <Button
                htmlType="submit"
                style={{
                  background: '#0068ff',
                  fontSize: '12px',
                  color: 'white',
                  marginLeft: '40%',
                  width: '100px'
                }}
              >
                Ti???p t???c
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
export default SendOtpComponent;

SendOtpComponent.propTypes = {
  children: PropTypes.objectOf(PropTypes.any),
  userProfile: PropTypes.objectOf(PropTypes.any),
  visible: PropTypes.any,
  setVisible: PropTypes.objectOf(PropTypes.any),
  cancelModal: PropTypes.any,
  typeOfsendOtp: PropTypes.any
};
SendOtpComponent.defaultProps = {
  children: {},
  userProfile: {},
  setVisible: {},
  cancelModal: {}
};

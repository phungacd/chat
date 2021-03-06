/* eslint-disable react-hooks/exhaustive-deps */
// React Libary
import React, { useContext, useCallback, useState, useEffect } from 'react';
import { Input, Tag } from 'antd';
import Avatar from 'react-avatar';
import { LeftOutlined, UsergroupAddOutlined } from '@ant-design/icons';

// NextJS
import dynamic from 'next/dynamic';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Common
import { classPrefixor } from 'utils/classPrefixor';
import { ManagePeopleGroupContext } from 'components/common/context/ManagePeopleGroupContext';
import { InfoRoomContext } from 'components/common/context/InfoRoomContext';
import {
  dispatchDefaulMessagetAddUserToGroupAction,
  getDetailGroupAction
} from 'actions/roomsAction';
import { findUserByIdAction } from 'actions/userAction';

// Component
const ModalAddFriendToGroup = dynamic(() => import('./ModalAddFriendToGroup'));

import ViewUserFriend from 'components/Friend/ViewUserFriend';
import { filterUserExitedRoom } from 'components/common/function/lodash';

const prefix = 'manage__people';
const c = classPrefixor(prefix);
const { Search } = Input;

const ManagePeopleInGroup = () => {
  // React Hook
  const [valueSearch, setValueSearch] = useState('');
  const [showModalAddFriendToGroup, setShowModalAddFriendToGroup] = useState(
    false
  );
  const [userInGroupData, setUserInGroupData] = useState({});
  const [visibleModalViewUserById, setVisibleModalViewUserById] = useState(
    false
  );

  // Context
  const { setClickPeopleIcon, setClickSideBarIcon } = useContext(
    ManagePeopleGroupContext
  );
  const { infoRoom, setInfoRoom } = useContext(InfoRoomContext);

  // Redux Hook
  const dispatch = useDispatch();
  const { userProfile } = useSelector(state => state.userData);
  const { listFriendContact } = useSelector(state => state.FriendReducer);
  const { infoRoomAfterAddUserToGroup } = useSelector(
    state => state.RoomsReducer
  );
  const { messageAddUserToGroup } = useSelector(state => state.RoomsReducer);

  const infoRoomClearUserExited = filterUserExitedRoom(infoRoom?.users);

  // useEffect n??y ch???y khi messageAddUserToGroup thay ?????i, ngh??a l?? ng?????i d??ng ???? ???????c add th??nh c??ng
  useEffect(() => {
    if (messageAddUserToGroup.length > 0) {
      dispatch(getDetailGroupAction(infoRoom?._id));
    }
  }, [messageAddUserToGroup]);

  useEffect(() => {
    setInfoRoom(infoRoomAfterAddUserToGroup);
    // Sau khi set th?? ph???i dispatch cho messageAddUserToGroup tr??? l???i ban ?????u ????? useEffect tr??n ch???y l???i
    dispatch(dispatchDefaulMessagetAddUserToGroupAction());
  }, [infoRoomAfterAddUserToGroup]);

  const handleSearchName = e => {
    setValueSearch(e.target.value);
  };

  const handleCheckAvatar = user => {
    const checkUserAvatar = user.avatar === null || user.avatar === '';
    if (checkUserAvatar) {
      return <Avatar name={user.name} size="50px" round={true} />;
    }
    return <img src={user.avatar} alt="avatar" className="avatar--user" />;
  };

  const findUserFriend = user => {
    return listFriendContact?.find(friend => friend.id === user.id);
  };

  const handleCheckStatusUser = user => {
    if (user.id === userProfile?.id) {
      return <Tag color="processing">Ch??nh B???n</Tag>;
    }
    if (findUserFriend(user)) {
      return <Tag color="success">B???n B??</Tag>;
    }
    if (findUserFriend(user) === undefined) {
      return <Tag color="error">K???t B???n</Tag>;
    }
  };

  const userSearch = infoRoomClearUserExited?.filter(
    user => user?.name?.toLowerCase().indexOf(valueSearch.toLowerCase()) !== -1
  );

  const handeGetUserIDInRoom = idUser => {
    dispatch(findUserByIdAction(idUser)).then(res => {
      setUserInGroupData(res.data);
      setVisibleModalViewUserById(true);
    });
  };

  const renderListUsersInGroup = useCallback(() => {
    return userSearch?.map(user => {
      return (
        <div
          className="user--info"
          key={user.id}
          onClick={() => handeGetUserIDInRoom(user.id)}
        >
          {handleCheckAvatar(user)}
          <span className="name--user">{user.name}</span>
          <span className="status--user">{handleCheckStatusUser(user)}</span>
        </div>
      );
    });
  }, [handleCheckStatusUser, userSearch]);

  const handleCloseModal = bool => {
    setShowModalAddFriendToGroup(bool);
  };
  const cancelModal = () => {
    setVisibleModalViewUserById(false);
  };
  const handleClickOutIcon = () => {
    setClickPeopleIcon('unClickPeopleIcon');
    setClickSideBarIcon('clickSidebarIcon');
  };
  return (
    <>
      <aside className={prefix}>
        <nav className={c`header`}>
          <span className="icon_out" onClick={() => handleClickOutIcon()}>
            <LeftOutlined />
          </span>
          <span className="title">
            <span>QU???N L?? TH??NH VI??N</span>
          </span>
        </nav>
        <section className={c`content--top`}>
          <div
            className="addMemberInGroup"
            onClick={() => setShowModalAddFriendToGroup(true)}
          >
            <UsergroupAddOutlined />
            <span>Th??m Th??nh Vi??n</span>
          </div>
        </section>
        <section className={c`content--middle`}>
          <Search placeholder="T??m Ki???m B???n B??" onChange={handleSearchName} />
          <div className="listUserInGroup">{renderListUsersInGroup()}</div>
        </section>
        {showModalAddFriendToGroup && (
          <ModalAddFriendToGroup
            showModalAddFriendToGroup={showModalAddFriendToGroup}
            handleCloseModalRoot={handleCloseModal}
          />
        )}
        {visibleModalViewUserById && (
          <ViewUserFriend
            userData={userInGroupData}
            visible={visibleModalViewUserById}
            onCancelModal={cancelModal}
          />
        )}
      </aside>
    </>
  );
};

export default ManagePeopleInGroup;

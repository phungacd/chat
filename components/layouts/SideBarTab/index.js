/* eslint-disable react-hooks/exhaustive-deps */
// React Libary
import React, { useState, useCallback, useContext, useEffect } from 'react';
// import { Tab, Tabs, TabPanel } from 'react-tabs';
import { Button, Dropdown, Menu, Popconfirm, Avatar, Collapse } from 'antd';
import { EditOutlined, EllipsisOutlined, KeyOutlined } from '@ant-design/icons';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { accountLogout } from 'actions/accountAction';
import { fetchFriendsContactAction } from 'actions/friendAction';
import {
  deleteRoomAction,
  dispatchDefaulRoomstAction,
  getDetailGroupAction
} from 'actions/roomsAction';

// NextJS
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

//Component
const HomePage = dynamic(() => import('components/HomePage'));
const MessageRoom = dynamic(() => import('components/Chat/MessageRoom'));
const Directory = dynamic(() => import('components/Directory'));
const FriendList = dynamic(() => import('components/Directory/FriendList'));
const PhoneBook = dynamic(() => import('components/Directory/PhoneBook'));
const SearchComponent = dynamic(() => import('components/Search'));
const Update = dynamic(() => import('components/Account/Update'));
const GroupList = dynamic(() => import('components/Directory/GroupList'));
const ChangePasswordUser = dynamic(() =>
  import('components/Account/ChangePassword')
);

// Common
import { classPrefixor } from 'utils/classPrefixor';
import useFetchAllGroup from 'components/common/hook/useFetchAllGroup';
import useRenderAvatar from 'components/common/hook/useRenderAvatar';
import ManagePeopleInGroup from 'components/ManagePeople';
import { ManagePeopleGroupContext } from 'components/common/context/ManagePeopleGroupContext';
import { InfoRoomContext } from 'components/common/context/InfoRoomContext';
import InfoConversation from 'components/InfoConversation';

const prefix = 'sidebar-tab';
const c = classPrefixor(prefix);
const SubMenu = Menu.SubMenu;
const { Panel } = Collapse;

const SideBarTab = () => {
  // react hook
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [visiblePassword, setVisiblePassword] = useState(false);
  // const [tabIndex, setTabIndex] = useState();
  const [stateIcon, setStateIcon] = useState('message_icon');
  const [stateIconInContact, setStateIconInContact] = useState('add-friend');
  const [clickRoom, setClickRoom] = useState(null);
  // redux hook
  const dispatch = useDispatch();
  const { userProfile } = useSelector(state => state.userData);
  const { listFriendContact } = useSelector(state => state.FriendReducer);
  const { infoRoomAfterAddUserToGroup, messageDeleteRoom } = useSelector(
    state => state.RoomsReducer
  );

  // custom hook
  const { listGroup } = useFetchAllGroup();

  // nextjs hook
  const { push } = useRouter();

  // Context
  const { clickPeopleIcon, setClickPeopleIcon, clickSideBarIcon } = useContext(
    ManagePeopleGroupContext
  );
  const {
    setStatusRoom,
    setInfoRoom,
    setLoading,
    infoRoom
    // sendMessage,
    // setSendMessage
  } = useContext(InfoRoomContext);
  // variable Global
  const totalFriend = listFriendContact?.length;

  const RenderAvatarUserGroup = group => {
    const [renderAvatarUserGroup] = useRenderAvatar(
      group,
      {
        borderRadius: '50%',
        width: '35px',
        height: '35px'
      },
      '35px'
    );
    return renderAvatarUserGroup();
  };
  useEffect(() => {
    if (userProfile?.id) {
      dispatch(fetchFriendsContactAction(userProfile?.id));
    }
  }, [userProfile]);
  useEffect(() => {
    if (messageDeleteRoom?.length > 0) {
      dispatch(getDetailGroupAction(infoRoom?._id));
    }
  }, [messageDeleteRoom]);

  useEffect(() => {
    setInfoRoom(infoRoomAfterAddUserToGroup);
    dispatch(dispatchDefaulRoomstAction());
  }, [infoRoomAfterAddUserToGroup]);

  const showModal = () => {
    setVisible(true);
    setUserData(userProfile);
  };

  const cancelModal = () => {
    setVisible(false);
    setUserData(userProfile);
  };
  const onCancelPassword = () => {
    setVisiblePassword(false);
  };

  const handleDeleteRoom = idRoom => {
    dispatch(deleteRoomAction(idRoom));
  };

  const menu = id => (
    <Menu>
      <Menu.Item key="1">
        <Popconfirm
          placement="right"
          title="B???n mu???n x??a Cu???c tr?? chuy???n n??y?"
          onConfirm={() => handleDeleteRoom(id)}
          okText="Yes"
          cancelText="No"
        >
          X??a cu???c tr?? chuy???n
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  const handleClickRoom = async value => {
    setClickRoom(value);
    setLoading(true);
    setInfoRoom(value);
    if (!value.group) {
      setStatusRoom(false);
      setLoading(false);
    } else {
      setStatusRoom(true);
      setTimeout(setLoading(false), 3000);
    }
  };
  const renderDropdownThreeDots = room => {
    return (
      <Dropdown overlay={() => menu(room._id)} trigger={['click']}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          <span className="right">
            <EllipsisOutlined />
          </span>
        </a>
      </Dropdown>
    );
  };

  //
  const renderTabSingleChat = room => {
    return room?.users.map(user => {
      if (user.id != userProfile.id) {
        return (
          <div
            key={user.id}
            className="tab_room"
            onClick={() => setClickPeopleIcon('unClickPeopleIcon')}
          >
            <div
              style={{
                width: '74px',
                display: 'inline-block'
              }}
            >
              {user?.avatar === null || user?.avatar === '' ? (
                <Avatar
                  size={64}
                  className="avatar-chat"
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {user?.name}
                </Avatar>
              ) : (
                <img
                  style={{
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    marginRight: '11px'
                  }}
                  src={user?.avatar}
                  alt="avatar"
                />
              )}
            </div>
            <div
              className="content-tab-chat"
              style={{ display: 'inline-block' }}
            >
              <p className="group__name">{user?.name}</p>
            </div>
            <div>{renderDropdownThreeDots(room)}</div>
          </div>
        );
      }
    });
  };

  const renderTabNameGroupRoom = room => {
    return (
      <div className="tab_room">
        <div style={{ display: 'inline-block' }}>
          <div className="avatar-group-vip-pro">
            {RenderAvatarUserGroup(room)}
          </div>
        </div>
        <div
          className="content-tab-chat_group"
          style={{ display: 'inline-block' }}
        >
          <p className="group__name_group">{room.name}</p>
        </div>
        {renderDropdownThreeDots(room)}
      </div>
    );
  };
  // Hi???n th??? c??c group v?? single group
  const renderNameListRoom = useCallback(() => {
    return listGroup?.map((room, key) => {
      return (
        <>
          <Menu.Item
            onClick={() => handleClickRoom(room)}
            style={{ height: '100px' }}
          >
            <div className="message_tab_chat" key={key}>
              <div className="list_user_room">
                <div className="info_user_room">
                  {room.group
                    ? renderTabNameGroupRoom(room)
                    : renderTabSingleChat(room)}
                </div>
              </div>
            </div>
          </Menu.Item>
        </>
      );
    });
  }, [listGroup]);
  const ClickAndressIcon = () => {
    setClickPeopleIcon('unClickPeopleIcon');
    setStateIcon('address_icon');
  };
  // Hi???n th??? ra c??c tab v???i c??c icon t????ng ???ng
  const renderTabsIcon = () => {
    return (
      <Menu className="sidebar_render_left">
        <Menu.Item
          style={{ paddingTop: '10px', height: '60px' }}
          onClick={() => setStateIcon('message_icon')}
        >
          <i className="fa fa-comment" style={{ fontSize: '20px' }}></i>
        </Menu.Item>
        <Menu.Item
          onClick={ClickAndressIcon}
          style={{ paddingTop: '10px', height: '60px' }}
        >
          <i className="fa fa-address-book" style={{ fontSize: '20px' }}></i>
        </Menu.Item>
        <div className="sign-out">
          <Button
            onClick={() => {
              dispatch(accountLogout(push));
            }}
          >
            <i className="fa fa-sign-out-alt"></i>
          </Button>
        </div>
      </Menu>
    );
  };

  // ????y l?? submenu khi ng?????i d??ng click v??o avatar s??? hi???n th??? ra
  const renderSubMenuWhenClickIconAvatar = useCallback(() => {
    return (
      <>
        <SubMenu
          className="Submenu"
          title={
            userProfile?.avatar == null ? (
              <div className="avatar" style={{ cursor: 'pointer' }}>
                <Avatar
                  size={56}
                  style={{
                    backgroundColor: '#4287f5'
                  }}
                >
                  {userProfile?.name}
                </Avatar>
                <div className="icon-online"></div>
              </div>
            ) : (
              <div className="avatar" style={{ cursor: 'pointer' }}>
                <img
                  src={userProfile?.avatar}
                  className="img_avatar"
                  data-reactid="23"
                  alt="null"
                />

                <div className="icon-online"></div>
              </div>
            )
          }
        >
          <Menu.Item className="styleMenuItem" onClick={showModal}>
            <EditOutlined className="styleIcon" />
            <a target="_blank" style={{ color: 'black' }}>
              C???p nh???t th??ng tin
            </a>
          </Menu.Item>
          <Menu.Item
            className="styleMenuItem"
            onClick={() => setVisiblePassword(true)}
          >
            <KeyOutlined className="styleIcon" />
            <a target="_blank" style={{ color: 'black' }}>
              ?????i m???t kh???u
            </a>
          </Menu.Item>
          <Menu.Item className="submenu__delete">
            <a
              target="_blank"
              style={{ color: 'red' }}
              onClick={() => {
                dispatch(accountLogout(push));
              }}
            >
              ????ng Xu???t
            </a>
          </Menu.Item>
        </SubMenu>
      </>
    );
  }, [userProfile]);

  //????y l?? tab ????? render ra b??n c??y m??u xanh n??!
  const renderTabList = () => {
    return (
      <div className={c`tabs__tablist`}>
        <div className="tablist__content">
          <Menu className="menuUser" triggerSubMenuAction="click">
            {renderSubMenuWhenClickIconAvatar()}
          </Menu>
          {renderTabsIcon()}
        </div>
      </div>
    );
  };
  const clickFriendInContact = friend => {
    handleClickRoom(friend);
    setStateIconInContact('room-friend');
  };
  //render Friend in Contact List
  const renderFriend = () => {
    return listFriendContact?.map((friend, key) => {
      return (
        <div key={key} onClick={() => clickFriendInContact(friend)}>
          <Directory elm={friend} totalFriend={totalFriend} />
        </div>
      );
    });
  };

  // ????y l?? tab c???a icon danh b??? ??i???n tho???i
  const renderTabPanelInPhoneBook = () => {
    return (
      <div className="tab-chat-render">
        <div className={c`tabs__tablist`}>
          <SearchComponent />
          <div className="scrollCustom">
            <div
              className="tab"
              onClick={() => setStateIconInContact('add-friend')}
            >
              <img
                src="https://zalo-chat-static.zadn.vn/v1/NewFr@2x.png"
                alt="imgAddF"
              />
              <span>Danh S??ch K???t B???n</span>
            </div>

            <div
              className="tab"
              onClick={() => setStateIconInContact('phone-book')}
            >
              <i className="fa fa-address-book"></i>
              <span>Danh s??ch ?????ng b???</span>
            </div>
            <div
              className="tab"
              onClick={() => setStateIconInContact('group-list')}
            >
              <img
                src="https://zalo-chat-static.zadn.vn/v1/group@2x.png"
                alt="imgAddF"
              />
              <span>Danh S??ch Nh??m</span>
            </div>
            <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} />
            <Collapse
              defaultActiveKey={['1']}
              bordered={false}
              expandIconPosition="right"
            >
              <Panel
                header={`B???n b?? ${totalFriend}`}
                key="1"
                style={{ backgroundColor: 'white' }}
                className="friend-list-contact"
              >
                <div className="scrollable-container">{renderFriend()}</div>
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    );
  };
  // ????y l?? tab c???a icon chat
  const renderTabpanelInChatting = useCallback(() => {
    return (
      <div className={c`tabs__tablist`}>
        <SearchComponent />
        <Menu
          style={{ border: 'none' }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
        ></Menu>
        <div className="scrollCustom">
          <Menu className="listRoom_name">{renderNameListRoom()}</Menu>
        </div>
      </div>
    );
  }, [renderNameListRoom]);
  const renderRoom = () => {
    return <MessageRoom id={clickRoom?.id} />;
  };
  const chooseOnList = () => {
    switch (stateIconInContact) {
      case 'add-friend':
        return <FriendList />;
      case 'phone-book':
        return <PhoneBook />;
      case 'group-list':
        return <GroupList />;
      case 'room-friend':
        return <MessageRoom id={clickRoom?.id} />;
    }
  };
  const renderTabsTree = () => {
    return (
      <>
        <secion className={`${prefix} ${clickPeopleIcon} ${clickSideBarIcon}`}>
          <div className={c`tabs`}>
            {renderTabList()}
            {stateIcon == 'message_icon' ? (
              <div className="tab-chat-render">
                {renderTabpanelInChatting()}
                {clickRoom ? renderRoom() : <HomePage />}
              </div>
            ) : stateIcon == 'address_icon' ? (
              <div className="tab-chat-render">
                {renderTabPanelInPhoneBook()}
                {chooseOnList()}
              </div>
            ) : (
              ''
            )}
          </div>
          <ManagePeopleInGroup />
          {visible ? (
            <Update
              cancelAvatar={cancelModal}
              visible={visible}
              userProfile={userData}
              setVisible={setVisible}
              setUserProfile={setUserData}
            />
          ) : (
            ' '
          )}
          <InfoConversation />

          {visiblePassword && (
            <ChangePasswordUser
              visible={visiblePassword}
              setVisible={setVisiblePassword}
              cancelPassword={onCancelPassword}
            />
          )}
        </secion>
      </>
    );
  };
  return <>{renderTabsTree()}</>;
};

export default SideBarTab;

import { useAuth0 } from "@auth0/auth0-react";
import { React, useEffect, useState } from "react";
import { getUser, updateUser } from "../services/auth0-management-service";
import { Modal, ModalConfirmCancel } from '../Components/Modal';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [notification, setNotification] = useState("")

  // Hook for the user data retreived from the management API
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (user) {
      getUser(user.sub, setUserData)
    }
  }, [user]);

  // Editing hooks
  const [editing, setEditing] = useState(false)
  const [editedUserData, setEditedUserData] = useState(null)

  // Modal hooks
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false)
  //const [modalText, setModalText] = useState("")

  // Stop rendering when data from Auth0 has not been loaded yet
  if (isLoading) {
    return null; // #Todo: add Loading spinner
  }

  // Show minimal information if user is not logged in
  if (!isAuthenticated) {
    return <div className="flex justify-center pt-10">You are not logged in.</div>
  }

  // Helper function to get the authentication method
  function authMethod(userData) {
    if (userData) {
      return userData['identities'][0]['provider']
    } else {
      return null;
    }
  }

  function modalText() {
    return (
      <span>If you proceed, you will be logged out
        and a verification mail will be sent to <b>{editedUserData.email}</b>.
        <br />
        <u>Important</u>: You will need to login using the <b>new email address</b>, even if you opt to not verify it.
      </span>
    )
  }

  function updateUserWrapper({ changedEmail = false } = {}) {
    let data = {
      nickname: editedUserData.nickname,
      given_name: editedUserData.given_name,
      family_name: editedUserData.family_name,
      name: editedUserData.given_name + " " + editedUserData.family_name,
    }
    if (changedEmail) {
      data = {
        ...data,
        ['email']: editedUserData.email, ['email_verified']: false, ['verify_email']: true
      }
    }
    updateUser(user.sub, data, setUserData);
    setEditing(false)
  }

  // Callback functions
  function handleEditClick() {
    setEditing(true);
    setEditedUserData(userData);
  }

  function handleSaveClick() {
    //   #TODO
    //  Sanitization of input in helper function
    //  - Meaningful values for all fields
    //  - Both mmail addresses equal ("email" and "email_control"), if editedUserData.email != userData.email

    if (editedUserData.email != userData.email) {
      setChangeEmailModalOpen(true)
    } else {
      updateUserWrapper({ changedEmail: false });
    }
  }

  function handleCancelClick() {
    setEditing(false);
    setEditedUserData({});
  }

  function handleInputChange(e) {
    let { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
    console.log(e.target.value)
  }

  // #TODO finalization
  const NotificationBox = () => {
    return (
      <div className={`notification ${notification ? 'show' : 'hide'}`}>
        <p>{notification}</p>
      </div>
    );
  }

  function renderRows() {
    if (!userData) {
      return null;
    }

    let values = [userData.nickname, userData.given_name, userData.family_name, userData.email, (userData.email_verified ? 'Yes' : 'No'), authMethod(userData)]
    let fieldNames = ['nickname', 'given_name', 'family_name', 'email', 'email_verified', 'auth_method']
    let labels = ["Nickname", "First Name", "Last Name", "Email", "Email is verified", "Authentication Method"]
    let editable = [true, true, true, true, false, false]

    return values.map((value, index) => (
      <tr key={index} className="tr-profile">
        <td className="text-nowrap font-bold text-right"><span>{labels[index]}:</span></td>
        <td className="pl-2 ">
            {(editing && editable[index]) ?
              <input type="text" name={fieldNames[index]} defaultValue={value} onChange={handleInputChange} className="input-profile" /> :
              value}
        </td>
      </tr>
    ))
  }

  return (
    <div className="p-5">
      <div className="p-2 page-title">
        Your Profile
      </div>
      <div className="profile-content flex justify-center flex-col gap-5 flex-wrap">
        <div>
          <img
            src={user.picture}
            alt="Profile"
            className="flex-shrink-0 flex-grow-0"
          />
        </div>
        <table className="table-profile">
          <thead></thead>
          <tbody>
            {renderRows()}
          </tbody>
        </table>

        <div>

          {authMethod(userData) === "auth0"
            ?
            editing
              ?
              <div className="flex flex-row-reverse gap-1">
                <button className="button-standard w-full" onClick={handleSaveClick}>
                  Save changes
                </button>
                <button className="button-standard w-full" onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
              :
              <button className="button-standard w-full" onClick={handleEditClick}>
                Edit profile
              </button>
            :
            <button className="button-standard button-disabled w-full" title="Not available for social login" disabled>
              Edit profile
            </button>
          }
        </div>

        {userData && userData.user_id}
      </div>

      <NotificationBox />

      {changeEmailModalOpen &&
        <ModalConfirmCancel
          title="Changing Email Address"
          text={modalText()}
          onConfirm={() => { updateUserWrapper({ changedEmail: true }); window.location.reload(); }}
          onCancel={() => setChangeEmailModalOpen(false)} />
      }

    </div >
  );
};
export default Profile;
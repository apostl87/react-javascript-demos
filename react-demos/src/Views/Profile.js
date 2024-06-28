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
  const [editedUserData, setEditedUserData] = useState({})
  const [submissionUserData, setSubmissionUserData] = useState({})

  // Modal hooks
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false)
  const [modalText, setModalText] = useState("")

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
  } //.sub.split("|")[0];

  function renderRows() {
    if (!userData) return null;
    let values = [userData.nickname, userData.given_name, userData.family_name, userData.email, (userData.email_verified ? 'Yes' : 'No'), authMethod(userData)]
    let fieldNames = ['nickname', 'given_name', 'family_name', 'email', 'email_verified', 'auth_method']
    let labels = ["Nickname", "First Name", "Last Name", "Email", "Email is verified", "Authentication Method"]
    let editable = [true, true, true, true, false, false]
    return values.map((value, index) => (
      <tr key={index}>
        <td className="text-nowrap font-bold">{labels[index]}:</td>
        <td>{(editing && editable[index]) ? <input type="text" name={fieldNames[index]} defaultValue={value} onChange={handleInputChange} className="input-profile" /> : value}</td>
      </tr>
    ))
  }

  function prepareUpdateUser() {
    setSubmissionUserData({
      nickname: editedUserData.nickname,
      given_name: editedUserData.given_name,
      family_name: editedUserData.family_name,
      name: `${editedUserData.given_name} ${editedUserData.family_name}`,
    })
    if (editedUserData.email != userData.email) {
      setSubmissionUserData({
        ...submissionUserData,
        email: editedUserData.email, email_verified: false, verify_email: true
      })
      setModalText(
        <span>If you proceed, you will be logged out
          and a verification mail will be sent to <b>{submissionUserData.email}</b>.
          Important: You need to <b>login with your new email address</b>, even if you opt to not verify it.
        </span>
      )
      setChangeEmailModalOpen(true)
    } else {
      updateUser(user.sub, submissionUserData, setUserData);
    }
  };

  // Callback functions
  function handleEditClick() {
    setEditing(true);
    setEditedUserData(userData);
  }

  function handleSaveClick() {
    setEditing(false);
    prepareUpdateUser();
  }

  function handleCancelClick() {
    setEditing(false);
    setEditedUserData({});
  }

  function handleInputChange(e) {
    let { name, value } = e.target;
    // Sanitization here #todo
    setEditedUserData({ ...editedUserData, [name]: value });
  }

  const NotificationBox = () => {
    return (
      <div className={`notification ${notification ? 'show' : 'hide'}`}>
        <p>{notification}</p>
      </div>
    );
  }

  // For development
  const UserAttributes = (user) => {
    return (
      <>
        {Object.entries(user).map(([attribute, value]) => (
          (typeof value == Object ? <p key={attribute}>-</p> :
            <p key={attribute}>
              {attribute}: {value}
            </p >
          )))}
      </>
    );
  };
  //

  return (
    <div className="p-5">
      <h3 className="p-2">
        Your Profile
      </h3>
      <div className="profile-content flex justify-center flex-row items-center gap-8">
        <div>
          <img
            src={user.picture}
            alt="Profile"
            className="align-center flex-shrink-0 flex-grow-0"
          />
        </div>
        <table className="table-profile">
          <thead></thead>
          <tbody>
            {renderRows()}

            {/* <tr>
              <td className="text-nowrap font-bold">Authentication Method:</td>
              <td>{authMethod(userData)}</td>
            </tr>

            {authMethod(userData) === "auth0" &&
              <tr>
                <td className="text-nowrap font-bold">Email Verification Status:</td>
                <td>{userData.email_verified ? 'Verified' : 'Not Verified'}</td>
              </tr>
            } */}

          </tbody>
        </table>

        <div className="pl-5 items-end justify-end flex flex-col">

          {authMethod(userData) === "auth0"
            ?
            editing
              ?
              <div className="flex flex-col gap-1">
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

      </div>

      {/* <NotificationBox /> */}

      {/* {UserAttributes(user)}
      <div>{JSON.stringify(userData)}</div> */}

      <button onClick={() => setChangeEmailModalOpen(true)}>Open Modal</button>

      {changeEmailModalOpen &&
        <ModalConfirmCancel
          title="Changing Email Address"
          text={modalText}
          onConfirm={() => { updateUser(user.sub, submissionUserData, setUserData); window.location.reload(); }}
          onClose={() => setChangeEmailModalOpen(false)} />
      }

    </div >
  );
};

export default Profile;
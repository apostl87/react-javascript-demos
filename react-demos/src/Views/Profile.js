import { useAuth0 } from "@auth0/auth0-react";
import { React, useEffect, useState } from "react";
import { getUser, updateUser } from "../services/auth0-management-service";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  // Editing hooks
  const [editing, setEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({})

  //NEXT TODO: Update Page after Saving.

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (user) {
      getUser(user.sub, setUserData)
    }
  }, [user]);

  // Stop rendering when data from Auth0 has not been loaded yet 
  if (!isAuthenticated) {
    return null;
  }

  const authMethod = user.sub.split("|")[0];

  function updateUserWrapper() {
    let userData = {
      nickname: editedUser.nickname,
      given_name: editedUser.given_name,
      family_name: editedUser.family_name,
    }
    if (editedUser.email != user.email) {
      userData.email = editedUser.email;
      userData.email_verified = false;
    }
    updateUser(user.sub, userData);
  };

  function renderEditableRows() {
    let values = [user.nickname, user.given_name, user.family_name, user.email]
    let fieldNames = ['nickname', 'given_name', 'family_name', 'email']
    let labels = ["Username", "First Name", "Last Name", "Email"]
    return values.map((value, index) => (
      <tr key={index}>
        <td className="text-nowrap font-bold">{labels[index]}:</td>
        <td>{editing ? <input type="text" name={fieldNames[index]} defaultValue={value} onChange={handleInputChange} className="input-profile" /> : value}</td>
      </tr>
    ))
  }

  function handleEditClick() {
    setEditing(true);
    setEditedUser(user);
  }

  function handleSaveClick() {
    setEditing(false);
    updateUserWrapper(user);
  }

  function handleCancelClick() {
    setEditing(false);
    setEditedUser(user);
  }

  function handleInputChange(e) {
    let { name, value } = e.target;
    // Sanitization here #todo
    setEditedUser({ ...editedUser, [name]: value });
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
            {renderEditableRows()}

            <tr>
              <td className="text-nowrap font-bold">Authentication Method:</td>
              <td>{authMethod}</td>
            </tr>

            {authMethod === "auth0" &&
              <tr>
                <td className="text-nowrap font-bold">Email Verification Status:</td>
                <td>{user.email_verified ? 'Verified' : 'Not Verified'}</td>
              </tr>
            }

          </tbody>
        </table>

        <div className="pl-5">

          {authMethod === "auth0"
            ?
            editing
              ?
              <>
                <button className="button-standard" onClick={handleSaveClick}>
                  Save changes
                </button>
                <button className="button-standard" onClick={handleCancelClick}>
                  Cancel
                </button>
              </>
              :
              <button className="button-standard" onClick={handleEditClick}>
                Edit profile
              </button>
            :
            <button className="button-standard button-disabled" title="Not available for social login" disabled>
              Edit profile
            </button>
          }
        </div>

      </div>

      {UserAttributes(user)}
      <div>{JSON.stringify(userData)}</div>

    </div >
  );
};

export default Profile;
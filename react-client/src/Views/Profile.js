import { useAuth0 } from "@auth0/auth0-react";
import { React, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import $ from 'jquery';
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import NotificationContainer from '../Components/NotificationContainer';
import { NotLoggedIn } from "../Components/Misc";
import Infobox from "../Components/Infobox";
import { getUser, updateUser, deleteUser } from "../Services/auth0-management-service";
import * as Utils from '../Utils/generic';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Hook for the user data retreived from the management API
  const [userData, setUserData] = useState(null);

  // Editing hooks
  const [editing, setEditing] = useState(false)
  const [editedUserData, setEditedUserData] = useState({})

  // Modal hooks
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Tooltip hook
  const [tooltipEmail2IsOpen, setTooltipEmail2IsOpen] = useState(false);

  // Infobox
  const [infoboxMessage, setInfoboxMessage] = useState("")
  const [responseStatusCode, setResponseStatusCode] = useState(-1)

  // If user data has been updated, update the local state
  useEffect(() => {
    if (userData && userData.email !== user.email) {
      setUserData({ ...userData, ['email']: user.email });
    }
  }, [user, userData]);

  // Get user data from the management API
  useEffect(() => {
    if (user) {
      const caller = async () => {
        let response = await getUser(user.sub);
        setUserData(response.data);
      }
      caller();
    }
  }, [user]);

  // Hide tooltip after appearTimeTooltip milliseconds
  const appearTimeTooltip = 2000;
  useEffect(() => {
    if (tooltipEmail2IsOpen) setTimeout(() => setTooltipEmail2IsOpen(false), appearTimeTooltip)
  }, [tooltipEmail2IsOpen])

  // Stop rendering when data from Auth0 has not been loaded yet
  if (isLoading) {
    return null; // #TODO: add Loading spinner
  }
  // Show minimal information if user is not logged in
  if (!isAuthenticated) {
    return <NotLoggedIn />
  }

  // Wrapper for the updateUser-function from the Auth0 management service
  async function updateUserWrapper({ changedEmail = false } = {}) {
    let data = {
      nickname: editedUserData.nickname,
      given_name: editedUserData.given_name,
      family_name: editedUserData.family_name,
    }

    if (editedUserData.given_name || editedUserData.family_name) {
      data = { ...data, ['name']: editedUserData.given_name + " " + editedUserData.family_name }
    }

    if (changedEmail) {
      data = {
        ...data,
        ['email']: editedUserData.email, ['email_verified']: false, ['verify_email']: true
      }
    }

    // TODO: We could check if any value has changed; if not, 

    // API call
    let response = await updateUser(user.sub, data);

    // Processing response
    setResponseStatusCode(response.status);
    if (response.status == 200) {
      setUserData(response.data);
      setInfoboxMessage("User data updated successfully.");
    } else if (response.status == 400) {
      setInfoboxMessage(`(${response.status}) Error: Updating user data denied. ${response.data.message}. `);
    } else {
      setInfoboxMessage(`(${response.status}) Unknown response status. Response message: ${response.data.message}`);
    }
  }

  // Wrapper for the deleteUser-function from the Auth0 management service
  async function deleteUserWrapper() {
    // API call
    let response = await deleteUser(user.sub);

    // Processing response
    setResponseStatusCode(response.status);
    if (response.status == 204) {
      setInfoboxMessage(`Profile deleted. You will be redirected in 2 seconds...`);
      setTimeout(() => window.location.reload(), 2000);
    }
    else if (response.status == 400) {
      setInfoboxMessage(`(${response.status}) Error: Deleting profile was denied. Response message: ${response.data.message}.`);
    }
    else {
      setInfoboxMessage(`(${response.status}) Unknown response status. Response message: ${response.data.message}.`);
    }
  }

  // Callback functions
  function handleEditClick() {
    setEditing(true);
    setEditedUserData(userData);
  }

  function handleSubmit(e) {
    e.preventDefault();

    //// Basic Validation: Done manually, since automatic form validation does not work for an unknown reason
    let infoMessage = "Validation fails: \n";
    let inp, isInvalid;

    // Nickname
    inp = $('#profileInput-nickname')
    if (!inp.val().trim()) { // this could also be done React-like with if (inp == editedUserData.nickname)
      infoMessage += "- Nickname cannot be empty \n";
      inp.addClass('invalid');
      isInvalid = true;
    }

    // First Name
    inp = $('#profileInput-given_name')
    if (!inp.val().trim()) {
      infoMessage += "- First Name cannot be empty \n";
      inp.addClass('invalid');
      isInvalid = true;
    }

    // Last Name
    inp = $('#profileInput-family_name')
    if (!inp.val().trim()) {
      infoMessage += "- Last Name cannot be empty \n";
      inp.addClass('invalid');
      isInvalid = true;
    }

    // Email
    inp = $('#profileInput-email')
    if (!Utils.validateEmail(inp.val())) {
      infoMessage += "- Email address is not valid \n";
      inp.addClass('invalid');
      isInvalid = true;
    }

    // Email2, resp. Double-Check Value for Email 
    if (editedUserData.email !== userData.email) {
      if (editedUserData.email2 !== editedUserData.email) {
        inp = $('#profileInput-email2')
        inp.addClass('invalid');
        isInvalid = true;
        setTooltipEmail2IsOpen(true);
      } else {
        setChangeEmailModalOpen(true);
        return;
      }
    }

    // If any validation failed, stop execution and display the Infobox
    if (isInvalid) {
      setResponseStatusCode(0);
      setInfoboxMessage(infoMessage);
      return;
    }

    // This is only reached if all validations were successful.
    setEditing(false)
    updateUserWrapper({ changedEmail: false });
  }

  function handleCancelClick() {
    setEditing(false);
    setEditedUserData({});
  }

  function handleDeleteClick() {
    setDeleteModalOpen(true);
  }

  function handleInputChanged(e) {
    let { name, value } = e.target;
    e.target.classList.remove('invalid');
    if (name === 'email' && value === userData.email) {
      setEditedUserData({ ...editedUserData, [name]: value, ['email2']: "" });
    } else {
      setEditedUserData({ ...editedUserData, [name]: value });
    }
  }

  // Helper functions
  function getAuthMethod(userData) {
    if (userData) {
      return userData['identities'][0]['provider']
    } else {
      return null;
    }
  }

  function getEditModalText(userData) {
    return (
      <span>If you proceed, you will be logged out
        and a verification mail will be sent to <b>{editedUserData.email}</b>.
        <br />
        <br />
        <u>Important</u>: You will need to login using the <b>new email address</b>, even if you opt to not verify it.
      </span>
    )
  }

  function getDeleteModalText(userData) {
    return (
      <span>Do you really want to delete your profile?
        <br />
        <br />
        {getAuthMethod(userData) != 'auth0' &&
          'Your retailer product portfolio will be preserved (Social login).'
        }
      </span>
    )
  }


  function renderRows() {
    if (!userData) {
      return null;
    }

    let fieldNames = ['nickname', 'given_name', 'family_name', 'email', 'email2', 'email_verified', 'auth_method']
    let labels = ["Nickname", "First Name", "Last Name", "Email", "Email (Confirmation)", "Email is verified", "Authentication Method"]
    let values = [userData.nickname, userData.given_name, userData.family_name, userData.email, '', (userData.email_verified ? 'Yes' : 'No'), getAuthMethod(userData)]
    let types = ["text", "text", "text", "email", "email", "text", "text"];
    let editable = [true, true, true, true, true, false, false];
    let required = [true, true, true, true, true, false, false];

    return values.map((value, index) => {
      if (fieldNames[index] === 'email2') {
        return renderEmail2(fieldNames[index], labels[index], values[index], types[index], required[index]);
      } else {
        return (
          <tr key={fieldNames[index]} className="tr-profile">
            <td className="text-nowrap font-bold text-right">
              <span>{labels[index]}:</span>
            </td>
            <td className="pl-2">
              {(editing && editable[index]) ?
                <input id={'profileInput-' + fieldNames[index]}
                  type={types[index]} name={fieldNames[index]} value={editedUserData[fieldNames[index]]}
                  placeholder="" onChange={handleInputChanged}
                  className="input-profile" required={required[index]} />
                :
                value}
            </td>
            <td className="w-16 pl-2">
              {editing && editable[index] &&
                editedUserData[fieldNames[index]] !== userData[fieldNames[index]] &&
                <em>changed</em>}
            </td>
          </tr>
        )
      }
    })
  }

  function renderEmail2(fieldName, label, value, type, required) {
    let disabled = (editing && editedUserData.email === userData.email)

    if (editing) {
      return (
        <tr className="tr-profile" key={fieldName}>
          <td className="text-wrap font-bold text-right align-middle">
            <span>{label}:</span>
          </td>
          <td className="pl-2 ">
            <input id={'profileInput-' + fieldName}
              type={type} name={fieldName} value={editedUserData.email2}
              placeholder={disabled ? "Email address unchanged" : "Retype new email address"}
              className={(disabled ? "bg-slate-300" : "") + " input-profile"}
              onChange={handleInputChanged} required={required} disabled={disabled}
              onPaste={(e) => { e.preventDefault() }} onDrop={(e) => { e.preventDefault() }}
              data-tooltip-id={fieldName} />
          </td>
          <td>
          </td>
        </tr>
      )
    } else {
      return <tr key={fieldName}></tr>;
    }
  }


  return (
    <>
      {userData &&
        <div className="p-5 flex flex-col items-center">
          <div className="p-2 page-title">
            Your user profile - fetched from <Link to={'https://auth0.com'} target="_blank">Auth0</Link>
          </div>

          <div id="profile-content" className="flex justify-center flex-row gap-5 flex-wrap">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-5 flex-wrap border-2 border-slate-500 rounded-lg p-6 justify-center" >
                <div>
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="flex-shrink-0 flex-grow-0 self-center"
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <table className="table-profile">
                    <thead></thead>
                    <tbody>
                      {renderRows()}
                      <tr className="tr-profile">
                        <td colSpan="2" className="text-center">
                          <div className="h-4" />
                          {getAuthMethod(userData) === "auth0"
                            ?
                            editing
                              ?
                              <div className="flex flex-row-reverse gap-2 w-full">
                                <button type="submit" className="button-standard w-1/2" onClick={handleSubmit}>
                                  Save changes
                                </button>
                                <button type="button" className="button-standard-blue-grey w-1/2" onClick={handleCancelClick}>
                                  Cancel
                                </button>
                              </div>
                              :
                              <button type="button" className="button-standard w-full" onClick={handleEditClick}>
                                Edit profile
                              </button>
                            :
                            <button type="button" className="button-standard disabled w-full"
                              title="Not available for social login" disabled>
                              Edit profile
                            </button>
                          }
                          {!editing &&
                            <button type="button" className="button-standard danger w-full mt-2.5" onClick={handleDeleteClick}>
                              Delete profile
                            </button>
                          }
                        </td>
                        <td>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <div className="w-full">
                <Infobox message={infoboxMessage} statusCode={responseStatusCode} />
              </div>
            </div>
          </div>


          {/* Overlay components */}
          <Tooltip id={'email2'}
            content={"Email addresses must match."}
            isOpen={tooltipEmail2IsOpen} />

          <ModalConfirmCancel
            isShown={changeEmailModalOpen}
            title="Changing Email Address"
            text={getEditModalText(editedUserData)}
            onConfirm={() => { updateUserWrapper({ changedEmail: true }); setChangeEmailModalOpen(false); setEditing(false); }}
            onCancel={() => setChangeEmailModalOpen(false)} />

          <ModalConfirmCancel
            isShown={deleteModalOpen}
            title="Deleting Profile"
            text={getDeleteModalText(userData)}
            onConfirm={() => { deleteUserWrapper(); setDeleteModalOpen(false); }}
            onCancel={() => setDeleteModalOpen(false)}
            isDangerous={true} />

        </div >
      }
    </>
  );
};

export default Profile;
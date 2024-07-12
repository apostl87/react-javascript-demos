import { useAuth0 } from "@auth0/auth0-react";
import { React, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import NotificationContainer from '../Components/NotificationContainer';
import { NotLoggedIn } from "../Components/Misc";
import Infobox from "../Components/Infobox";
import { getUser, updateUser } from "../Services/auth0-management-service";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Hook for the user data retreived from the management API
  const [userData, setUserData] = useState(null);

  // Editing hooks
  const [editing, setEditing] = useState(false)
  const [editedUserData, setEditedUserData] = useState({})

  // Modal hooks
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false)

  // Tooltip hook
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  // Infobox
  const [infoboxMessage, setInfoboxMessage] = useState("")
  const [responseStatusCode, setResponseStatusCode] = useState(-1)

  // Notification hook and functionality
  const [notifications, setNotifications] = useState([])
  function addNotification(notification) {
    setNotifications([...notifications, [(notifications.length > 0) ? notifications[notifications.length - 1][0] + 1 : 0, notification]]);
  }

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
        setUserData(response.data)
      }
      caller();
    }
  }, [user]);

  // Hide tooltip after appearTimeTooltip milliseconds
  const appearTimeTooltip = 5000;
  useEffect(() => {
    if (tooltipIsOpen) setTimeout(() => setTooltipIsOpen(false), appearTimeTooltip)
  }, [tooltipIsOpen])

  // Stop rendering when data from Auth0 has not been loaded yet
  if (isLoading) {
    return null; // #TODO: add Loading spinner
  }
  // Show minimal information if user is not logged in
  if (!isAuthenticated) {
    return <NotLoggedIn />
  }

  // Wrapper for the management-API-calling function
  async function updateUserWrapper({ changedEmail = false } = {}) {
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

    let response = await updateUser(user.sub, data);

    // Processing response
    setResponseStatusCode(response.status);
    if (response.status == 200) {
      setUserData(response.data);
      setInfoboxMessage("User data updated successfully.");
    } else if (response.status == 400) {
      setInfoboxMessage(`${response.data.message}. Updating user data denied. `);
    } else {
      setInfoboxMessage(`Unknown response status. Response message: ${response.data.message}`);
    }
  }

  // Callback functions
  function handleEditClick() {
    setEditing(true);
    setEditedUserData(userData);
  }

  function handleSubmit(e) {
    //   #TODO
    //  Sanitization of input in helper function
    //  - Meaningful values for all fields
    e.preventDefault();
    if (editedUserData.email !== userData.email) {
      if (editedUserData.email !== editedUserData.email2) {
        setTooltipIsOpen(true);
      } else {
        setChangeEmailModalOpen(true);
      }
    } else {
      setEditing(false)
      updateUserWrapper({ changedEmail: false });
    }
  }

  function handleCancelClick() {
    setEditing(false);
    setEditedUserData({});
  }

  function handleInputChanged(e) {
    let { name, value } = e.target;
    if (name === 'email' && value === userData.email) {
      setEditedUserData({ ...editedUserData, [name]: value, ['email2']: "" });
    } else {
      setEditedUserData({ ...editedUserData, [name]: value });
    }
  }

  // Helper functions
  function authMethod(userData) {
    if (userData) {
      return userData['identities'][0]['provider']
    } else {
      return null;
    }
  }

  function modalText() {
    if (editedUserData) {
      return (
        <span>If you proceed, you will be logged out
          and a verification mail will be sent to <b>{editedUserData.email}</b>.
          <br />
          <br />
          <u>Important</u>: You will need to login using the <b>new email address</b>, even if you opt to not verify it.
        </span>
      )
    } else {
      return;
    }
  }

  function renderRows() {
    if (!userData) {
      return null;
    }

    let fieldNames = ['nickname', 'given_name', 'family_name', 'email', 'email2', 'email_verified', 'auth_method']
    let labels = ["Nickname", "First Name", "Last Name", "Email", "Email (Confirmation)", "Email is verified", "Authentication Method"]
    let values = [userData.nickname, userData.given_name, userData.family_name, userData.email, '', (userData.email_verified ? 'Yes' : 'No'), authMethod(userData)]
    let types = ["text", "text", "text", "email", "email", "text", "text"];
    let editable = [true, true, true, true, true, false, false];
    let required = [false, false, false, true, true, false, false];

    return values.map((value, index) => {
      if (fieldNames[index] === 'email2') {
        return renderEmail2(fieldNames[index], labels[index], values[index], types[index], required[index]);
      } else {
        return (
          <tr key={fieldNames[index]} className="tr-profile">
            <td className="text-nowrap font-bold text-right align=middle">
              <span>{labels[index]}:</span>
            </td>
            <td className="pl-2 ">
              {(editing && editable[index]) ?
                <input type={types[index]} name={fieldNames[index]} defaultValue={value}
                  onChange={handleInputChanged} className="input-profile" required={required[index]} /> :
                value}
            </td>
            <td className="w-16 pl-2">
              {editing && editable[index] && editedUserData[fieldNames[index]] !== userData[fieldNames[index]] &&
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
            <input type={type} name={fieldName} value={editedUserData.email2} placeholder={disabled ? "Email address unchanged" : "Retype new email address"}
              className={(disabled ? "bg-slate-300" : "") + " input-profile"}
              onChange={handleInputChanged} required={required} disabled={disabled} data-tooltip-id={fieldName} />
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
    <div className="p-5 flex flex-col items-center">
      <div className="p-2 page-title">
        Your user profile (fetched from <Link to={'https://auth0.com'} target="_blank">Auth0</Link>)
      </div>

      <div id="profile-content" className="flex justify-center flex-row gap-5 flex-wrap">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-5 flex-wrap border-2 border-slate-400 rounded-lg p-3">
            <div>
              <img
                src={user.picture}
                alt="Profile"
                className="flex-shrink-0 flex-grow-0"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <table className="table-profile">
                <thead></thead>
                <tbody>
                  {renderRows()}
                  <tr className="tr-profile">
                    <td colSpan="2" className="text-center">
                      {authMethod(userData) === "auth0"
                        ?
                        editing
                          ?
                          <div className="flex flex-row-reverse gap-1 w-full">
                            <button type="submit" className="button-standard w-1/2" onClick={handleSubmit}>
                              Save changes
                            </button>
                            <button type="button" className="button-standard w-1/2" onClick={handleCancelClick}>
                              Cancel
                            </button>
                          </div>
                          :
                          <button type="button" className="button-standard w-full" onClick={handleEditClick}>
                            Edit profile
                          </button>
                        :
                        <button type="button" className="button-standard button-disabled w-full" title="Not available for social login" disabled>
                          Edit profile
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
        isOpen={tooltipIsOpen} />

      <ModalConfirmCancel
        isShown={changeEmailModalOpen}
        title="Changing Email Address"
        text={modalText()}
        // onConfirm={() => { updateUserWrapper({ changedEmail: true }); window.location.reload(); }}
        onConfirm={() => { updateUserWrapper({ changedEmail: true }); setChangeEmailModalOpen(false); setEditing(false); }}
        onCancel={() => setChangeEmailModalOpen(false)} />

      <NotificationContainer notifications={notifications} setNotifications={setNotifications} />

    </div >
  );
};

export default Profile;
import { useAuth0 } from "@auth0/auth0-react";
import { React, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import NotificationBox from '../Components/NotificationBox';
import { NotLoggedIn } from "../Components/Misc";
import { getUser, updateUser } from "../services/auth0-management-service";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Hook for the user data retreived from the management API
  const [userData, setUserData] = useState(null);

  // Editing hooks
  const [editing, setEditing] = useState(false)
  const [editedUserData, setEditedUserData] = useState({})

  // Modal hooks
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false)

  // Notification hook
  const [notifications, setNotifications] = useState([])

  // Tooltip hook
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  // Notification functions
  function addNotification(notification) {
    setNotifications([...notifications, notification]);
  }

  // #TODO finish notification functionality. Is this function needed?
  function handleDismissNotification(index) {
    setNotifications(notifications.filter((_, i) => i !== index));
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
      getUser(user.sub, setUserData)
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
      setEditedUserData({ ...editedUserData, ['email2']: '' });
    }
    setEditedUserData({ ...editedUserData, [name]: value });
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
          <u>Important</u>: You will need to login using the <b>new email address</b>, even if you opt to not verify it.
        </span>
      )
    } else {
      return;
    }
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
          <tr key={index} className="tr-profile">
            <td className="text-nowrap font-bold text-right align=middle">
              <span>{labels[index]}:</span>
            </td>
            <td className="pl-2 ">
              {(editing && editable[index]) ?
                <input type={types[index]} name={fieldNames[index]} defaultValue={value}
                  onChange={handleInputChanged} className="input-profile" required={required[index]} /> :
                value}
            </td>
            <td>
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
        <tr className="tr-profile">
          <td className="text-nowrap font-bold text-right align-middle">
            <span>{label}:</span>
          </td>
          <td className="pl-2 ">
            <input type={type} name={fieldName} value={value} placeholder={disabled ? "Email address unchanged" : "Retype new email address"}
              className={(disabled ? "bg-slate-300" : "") + " input-profile"}
              onChange={handleInputChanged} required={required} disabled={disabled} data-tooltip-id={fieldName} />
          </td>
          <td>
          </td>
        </tr>
      )
    } else {
      return <></>;
    }
  }

  return (
    <div className="p-5">
      <div className="p-2 page-title">
        Your Profile
      </div>
      <form onSubmit={handleSubmit}>
        <div className="profile-content flex justify-center flex-row gap-5 flex-wrap">
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
        </div>

        <div className="pt-2 flex flex-row justify-center">

          {authMethod(userData) === "auth0"
            ?
            editing
              ?
              <div className="flex flex-row-reverse gap-1 w-2/3">
                <button type="submit" className="button-standard w-1/2" onClick={handleSubmit}>
                  Save changes
                </button>
                <button type="button" className="button-standard w-1/2" onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
              :
              <button type="button" className="button-standard w-2/3" onClick={handleEditClick}>
                Edit profile
              </button>
            :
            <button type="button" className="button-standard button-disabled w-full" title="Not available for social login" disabled>
              Edit profile
            </button>
          }
        </div>
      </form>

      {/* Overlay components */}
      <Tooltip id={'email2'}
        content={"Email addresses must match."}
        isOpen={tooltipIsOpen} />

      <ModalConfirmCancel
        isShown={changeEmailModalOpen}
        title="Changing Email Address"
        text={modalText()}
        onConfirm={() => { updateUserWrapper({ changedEmail: true }); window.location.reload(); }}
        onCancel={() => setChangeEmailModalOpen(false)} />

      <NotificationBox notifications={notifications} setNotifications={setNotifications} />

    </div >
  );
};

export default Profile;
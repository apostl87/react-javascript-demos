import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  const authMethod = user.sub.split("|")[0];

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
            className="align-center"
          />
        </div>
        <table className="table-profile">
          <tr>
            <td>Username:</td>
            <td>{user.nickname}</td>
          </tr>

          <tr>
            <td>First Name:</td>
            <td>{user.given_name}</td>
          </tr>

          <tr>
            <td>Last Name:</td>
            <td>{user.family_name}</td>
          </tr>

          <tr>
            <td>Email Address:</td>
            <td>{user.email}</td>
          </tr>

          <tr>
            <td>Authentication Method:</td>
            <td>{authMethod}</td>
          </tr>

          {authMethod === "auth0" &&
            <tr>
              <td>Email Verification Status:</td>
              <td>{user.email_verified ? 'Verified' : 'Not Verified'}</td>
            </tr>
          }
        </table>

        <div className="pl-5">

          {authMethod === "auth0"
            ?
            <button className="button-standard">
              Edit profile
            </button>
            :
            <button className="button-standard button-disabled" title="Not available for social login" disabled>
              Edit profile
            </button>
          }
        </div>

      </div>
    </div>
  );
};

export default Profile;
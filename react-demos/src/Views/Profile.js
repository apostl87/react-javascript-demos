import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-5">
      <h3 className="p-2">
        Your Profile
      </h3>
      <div className="profile-content flex items-center justify-center flex-row">
        <div>
          <img
            src={user.picture}
            alt="Profile"
            className="profile__avatar"
          />
        </div>
        <table className="profile-table">
          <tr>
            <td className="profile__title">Name</td>
            <td className="profile__description">{user.name}</td>
          </tr>

          <tr className="profile__info">
            <td>Email Address:</td>
            <td>{user.email}</td>
          </tr>

          <tr className="profile__info">
            <td>Authentication Method:</td>
            <td>{user.sub.split("|")[0]}</td>
          </tr>

          <tr className="profile__info">
            <td>Email Verification Status:</td>
            {user.email_verified ? (
              <td>Verified</td>
            ) : (
              <td>Not Verified</td>
            )}
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Profile;
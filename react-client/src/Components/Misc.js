import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export const NoDeveloper = () => {
  return (
    <div className='text-center mt-10'>Your account is not registered as a developer account.</div>
  )
}

export const NotLoggedIn = () => {
    const { loginWithRedirect } = useAuth0()

    return (
        <div className='text-center mt-10'>
            You need to <a href="" onClick={() => loginWithRedirect({
                appState: {
                    returnTo: window.location.pathname
                }
            })}>log in (Auth0, Google, Apple, or Microsoft)</a> to view this page.
        </div>
    )
}

export const Loading = () => {
  return (
    <div className='text-center mt-10'>
        Loading...
    </div>
)
}

export const NotFound = () => {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for could not be found.</p>
    </>
  );
};
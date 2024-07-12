import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export const NoDeveloper = () => {
  return (
    <div className='text-center mt-10'>Your account is not registered as a developer account.</div>
  )
}

export const NotLoggedIn = (props) => {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className='flex flex-col items-center w-2/3 gap-5 self-center'>
      <div className='text-center mt-10'>
        You need to <a href="" onClick={() => loginWithRedirect({
          appState: {
            returnTo: window.location.pathname
          }
        })}>log in (Auth0, Google, Apple, or Microsoft)</a> to view this page.
      </div>
      {props.additionalHtml &&
        <div className='text-center mt-2' dangerouslySetInnerHTML={{ __html: props.additionalHtml }} />
      }
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

export const DownCaret = (props) => {
  const size = props.size ? props.size : 10;
  const color = props.color ? props.color : 'black';
  const style = {
    width: 0,
    height: 0,
    borderLeft: `${size}px solid transparent`,
    borderRight: `${size}px solid transparent`,
    borderTop: `${size}px solid ${color}`
  }
  return <div className={props.className + ' down-caret'} style={style}></div>
}

export const UpCaret = (props) => {
  const size = props.size ? props.size : 10;
  const color = props.color ? props.color : 'black';
  const style = {
    width: 0,
    height: 0,
    borderLeft: `${size}px solid transparent`,
    borderRight: `${size}px solid transparent`,
    borderBottom: `${size}px solid ${color}`
  }
  return <div className={props.className + ' up-caret'} style={style}></div>
}

export const RightCaret = (props) => {
  const size = props.size ? props.size : 10;
  const color = props.color ? props.color : 'black';
  const style = {
    width: 0,
    height: 0,
    borderTop: `${size}px solid transparent`,
    borderBottom: `${size}px solid transparent`,
    borderLeft: `${size}px solid ${color}`
  }
  return <div className={props.className + ' right-caret'} style={style}></div>
}

export const LeftCaret = (props) => {
  const size = props.size ? props.size : 10;
  const color = props.color ? props.color : 'black';
  const style = {
    width: 0,
    height: 0,
    borderTop: `${size}px solid transparent`,
    borderBottom: `${size}px solid transparent`,
    borderRight: `${size}px solid ${color}`
  }
  return <div className={props.className + ' left-caret'} style={style}></div>
}
import React from 'react';

const Home = () => {
  return (
    <div className='p-5'>
      This is a small demonstration page utilizing a database CRUD application and basic pure JavaScript applications.
      <br />
      <br />
      Note that the API is protected JWT Bearer Token Authentication, however, since limited quota for tokens is available at my hosting provider,
      Token Authentication can be disabled from time to time.
    </div>
  )
}

export default Home
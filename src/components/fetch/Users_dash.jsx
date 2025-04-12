import React, { useEffect } from 'react';
import { useUserByAdmin, useFirestoreUser } from '../context/users';

export default function Users_dash() {
  const { firebaseUser } = useFirestoreUser();
  console.log(firebaseUser);

  const Users = useUserByAdmin(firebaseUser?.uid);

  useEffect(() => {
  }, [firebaseUser?.uid]);

  return (
    <>
      <div>Users_dash</div>
      {Users && Users.map((user) => (
        <div key={user.id}>
          <p>{user.fullName}</p>
          <p>{user.admin_id}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </>
  );
}
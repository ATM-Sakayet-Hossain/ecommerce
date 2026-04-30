import React from 'react'

const page = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/getprofile`,
        {
          method: "get",
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.message || "login failed");
        return;
      }
  return (
    <div>page</div>
  )
}

export default page
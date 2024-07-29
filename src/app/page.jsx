"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decodeJWT } from "../app/admin/components/DecodeJWT";

function Home() {
  const router = useRouter();

  useEffect(() => {
    const decodedData = decodeJWT();
    if (decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee")) {
      router.push("./auth/login");
    }
  }, [router]);

  return (
    <div className='bg-white h-screen'>
    </div>
  );
}

export default Home;
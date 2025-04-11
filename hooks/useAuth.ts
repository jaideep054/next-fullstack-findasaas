// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUser, logout } from '@/services/api'; 

type UserType = {
  id: string;
  name: string;
  email: string;
  is_seller?: boolean;
  [key: string]: any; 
};

export const useAuth = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [alreadyListed, setAlreadyListed] = useState<boolean>(false);
  const router = useRouter();

  const fetchUserCall = async () => {
    setLoading(true);
    try {
      const response : any = await fetchUser();
      setUser(response?.data);
      setIsLoggedIn(true);
      setAlreadyListed(response.data.is_seller ?? false);
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCall();
  }, []);

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      setAlreadyListed(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return {
    user,
    loading,
    isLoggedIn,
    logoutUser,
    refetchUser: fetchUserCall,
    alreadyListed,
  };
};
